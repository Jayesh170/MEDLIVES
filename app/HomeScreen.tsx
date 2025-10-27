import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Alert, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { apiService } from '../src/services/api';
import AddOrder from './AddOrderFixed';

const { width } = Dimensions.get('window');
const scale = width / 320;

// Theme tokens aligned with Login/Signup
const COLORS = {
  primary: '#2EC4D6',
  primaryAlt: '#37B9C5',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  border: '#eee',
  chipBg: '#e0f7fa',
  success: '#65B924',
  danger: '#FF2A2A',
  warning: '#F4A261',
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

const ordersData: any[] = [];

const HomeScreen = forwardRef<any, any>((props, ref) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('today');
  const [orders, setOrders] = useState(ordersData);
  const [filteredOrders, setFilteredOrders] = useState(ordersData);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'credit' | 'pending'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const formatINR = (n: number) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const computeFilters = (base: typeof orders) => {
    let targetDate: Date;
    if (tab === 'today') targetDate = new Date();
    else if (tab === 'yesterday') targetDate = subDays(new Date(), 1);
    else targetDate = date;

    const formatted = format(targetDate, 'dd/MM/yy');
    let list = base.filter(o => o.date === formatted);

    if (statusFilter !== 'all') {
      list = list.filter(o => (o.status || 'pending').toLowerCase() === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o =>
        o.orderId?.toString().toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.address?.toLowerCase().includes(q) ||
        (Array.isArray(o.medications) && o.medications.some((m: any) => m.name?.toLowerCase().includes(q)))
      );
    }

    return list;
  };

  useEffect(() => {
    setFilteredOrders(computeFilters(orders));
  }, [tab, date, statusFilter, searchQuery, orders]);

  useEffect(() => {
    loadOrders();
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const user = await apiService.getStoredUserInfo();
      setUserInfo(user);
    } catch (error) {
      console.error('Failed to load user info:', error);
      // Set default user info for offline mode
      setUserInfo({
        businessName: 'MEDICAL STORE',
        name: 'User'
      });
    }
  };

  const loadOrders = async () => {
    try {
      const res = await apiService.getOrders();
      if (res.success && (res.data as any)?.data) {
        setOrders((res.data as any).data);
      } else {
        console.log('No orders found or API unavailable');
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setTab('custom');
    }
  };

  const handleTabChange = (selectedTab: string) => {
    setTab(selectedTab);
  };

  const handleAddOrder = async (newOrder: any): Promise<boolean> => {
    // Optimistic update: show immediately
    setOrders(prev => [newOrder, ...prev]);
    console.log('Order created successfully in offline mode:', newOrder.customerName);
    
    try {
      const res = await apiService.createOrder(newOrder);
      if (res.success && (res.data as any)?.data) {
        const created = (res.data as any).data;
        setOrders(prev => prev.map(o => (o.id && o.id === newOrder.id) || (o.orderId && o.orderId === newOrder.orderId) ? created : o));
        console.log('Order synced with server successfully');
        // Fetch latest list from DB to ensure exact ordering and fields
        await loadOrders();
        return true;
      } else {
        console.log('Order saved locally, will sync when server is available');
        setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, _unsynced: true } : o));
        return true; // still consider success for UI
      }
    } catch (e) {
      console.error('Failed to create order on server:', e);
      setOrders(prev => prev.map(o => o.id === newOrder.id ? { ...o, _unsynced: true } : o));
      return true; // optimistic success
    }
  };

  // Expose handleAddOrder to parent component via ref
  useImperativeHandle(ref, () => ({
    handleAddOrder
  }));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setFilteredOrders(computeFilters(orders));
    setRefreshing(false);
  };

  const markStatus = (id: string, status: 'paid' | 'credit' | 'pending') => {
    setOrders(prev => prev.map(o => ((o as any)._id === id || (o as any).id === id ? { ...o, status } : o)));
  };

  const deleteOrder = async (id: string) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Optimistic update: remove from UI immediately
              setOrders(prev => prev.filter(o => (o as any)._id !== id && (o as any).id !== id));
              
              // Try to delete from server
              const res = await apiService.deleteOrder(id);
              if (res.success) {
                console.log('Order deleted successfully from server');
              } else {
                console.log('Order deleted locally, will sync when server is available');
              }
            } catch (error) {
              console.error('Failed to delete order:', error);
              // Optionally show error message to user
              Alert.alert('Error', 'Failed to delete order. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderLeftActions = (item: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.success,
        justifyContent: 'center',
        alignItems: 'center',
        width: 80 * scale,
        marginVertical: 8 * scale,
        borderRadius: 12 * scale,
      }}
      onPress={() => markStatus(item._id || item.id, 'paid')}
    >
      <Ionicons name="checkmark" size={20 * scale} color="#fff" />
      <Text style={{ color: '#fff', fontFamily: FONTS.semi, marginTop: 4 * scale }}>Paid</Text>
    </TouchableOpacity>
  );

  const renderRightActions = (item: any) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.danger,
          justifyContent: 'center',
          alignItems: 'center',
          width: 80 * scale,
          marginVertical: 8 * scale,
          borderRadius: 12 * scale,
        }}
        onPress={() => markStatus(item._id || item.id, 'credit')}
      >
        <Ionicons name="close" size={20 * scale} color="#fff" />
        <Text style={{ color: '#fff', fontFamily: FONTS.semi, marginTop: 4 * scale }}>Credit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#FF4444',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80 * scale,
          marginVertical: 8 * scale,
          marginLeft: 4 * scale,
          borderRadius: 12 * scale,
        }}
        onPress={() => deleteOrder(item._id || item.id)}
      >
        <Ionicons name="trash" size={20 * scale} color="#fff" />
        <Text style={{ color: '#fff', fontFamily: FONTS.semi, marginTop: 4 * scale }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderCard = ({ item }: any) => (
    <Swipeable renderLeftActions={() => renderLeftActions(item)} renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { ...item, medications: JSON.stringify(item.medications) })} activeOpacity={0.9}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardId}>Order #{item.orderId}</Text>
            </View>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    item.status === 'paid'
                      ? COLORS.success
                      : item.status === 'credit'
                      ? COLORS.danger
                      : COLORS.warning,
                },
              ]}
            >
              <Text style={styles.statusPillText}>
                {item.status === 'paid' ? 'PAID' : item.status === 'credit' ? 'CREDIT' : 'PENDING'}
              </Text>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Customer</Text>
            <Text style={styles.cardValue}>{item.customerName}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.cardLabel}>Address</Text>
            <Text style={[styles.cardValue, { flex: 1, textAlign: 'right' }]} numberOfLines={1}>{item.address}</Text>
          </View>

          <View style={styles.chipsWrap}>
            {item.medications.slice(0, 3).map((m: any, idx: number) => (
              <View key={idx} style={styles.chipItem}>
                <Text style={styles.itemChipText}>{m.name} · {m.qty}x</Text>
              </View>
            ))}
            {item.medications.length > 3 && (
              <View style={[styles.chipItem, { backgroundColor: COLORS.primary }]}>
                <Text style={[styles.itemChipText, { color: '#fff' }]}>+{item.medications.length - 3} more</Text>
              </View>
            )}
          </View>

          <View style={styles.totalsRow}>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatINR(item.totalAmount)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-{formatINR(item.discount || 0)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Payable</Text>
              <Text style={[styles.totalValue, { color: COLORS.text }]}>{formatINR(item.payableAmount || item.totalAmount)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoBox}>
            <MaterialIcons name="local-hospital" size={24 * scale} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{userInfo?.businessName || 'MEDICAL STORE'}</Text>
            {userInfo?.name && (
              <Text style={styles.headerSubtitle}>Welcome, {userInfo.name}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Orders List with sticky filter header and metrics only when there are orders */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item._id || item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: 80 * scale + (insets.bottom || 0) }]}
          ListHeaderComponent={
            <View>
              {/* Sticky filter header */}
              <View style={styles.stickyHeader}>
                <View style={styles.searchRow}>
                  <Ionicons name="search-outline" size={18 * scale} color={COLORS.text} style={{ marginRight: 8 * scale }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, order ID or medicine..."
                    placeholderTextColor={COLORS.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <View style={styles.tabs}>
                  <TouchableOpacity style={[styles.tabBtn, tab === 'today' && styles.tabBtnActive]} onPress={() => handleTabChange('today')}>
                    <Text style={[styles.tabText, tab === 'today' && styles.tabTextActive]}>TODAY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tabBtn, tab === 'yesterday' && styles.tabBtnActive]} onPress={() => handleTabChange('yesterday')}>
                    <Text style={[styles.tabText, tab === 'yesterday' && styles.tabTextActive]}>YESTERDAY</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar" size={20 * scale} color={COLORS.text} />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
                <Text style={styles.selectedDateText}>{date.toLocaleDateString()}</Text>
                <View style={styles.chipsRow}>
                  {(['all', 'paid', 'credit', 'pending'] as const).map(k => (
                    <TouchableOpacity key={k} style={[styles.chip, statusFilter === k && styles.chipActive]} onPress={() => setStatusFilter(k)}>
                      <Text style={[styles.chipText, statusFilter === k && styles.chipTextActive]}>{k.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {/* Metrics below sticky header */}
              <View style={styles.metricsRow}>
                <View style={styles.metricCard}>
                  <Ionicons name="receipt-outline" size={18 * scale} color={COLORS.text} />
                  <Text style={styles.metricLabel}>Orders</Text>
                  <Text style={styles.metricValue}>{filteredOrders.length}</Text>
                </View>
                <View style={styles.metricCard}>
                  <Ionicons name="cube-outline" size={18 * scale} color={COLORS.text} />
                  <Text style={styles.metricLabel}>Items</Text>
                  <Text style={styles.metricValue}>{filteredOrders.reduce((s, o) => s + (o.medications?.reduce((x: number, m: any) => x + Number(m.qty || 0), 0) || 0), 0)}</Text>
                </View>
                <View style={styles.metricCard}>
                  <Ionicons name="cash-outline" size={18 * scale} color={COLORS.text} />
                  <Text style={styles.metricLabel}>Revenue</Text>
                  <Text style={styles.metricValue}>{formatINR(filteredOrders.reduce((s, o) => s + Number(o.payableAmount || 0), 0))}</Text>
                </View>
              </View>
            </View>
          }
          ListFooterComponent={
            <>
              <View style={styles.card} />
              <View style={styles.card} />
            </>
          }
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          stickyHeaderIndices={[0]}
        />
      ) : (
        <View style={{ paddingBottom: 80 * scale + (insets.bottom || 0) }}>
          {/* Non-sticky filters when there are no orders */}
          <View style={styles.stickyHeader}>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={18 * scale} color={COLORS.text} style={{ marginRight: 8 * scale }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name, order ID or medicine..."
                placeholderTextColor={COLORS.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <View style={styles.tabs}>
              <TouchableOpacity style={[styles.tabBtn, tab === 'today' && styles.tabBtnActive]} onPress={() => handleTabChange('today')}>
                <Text style={[styles.tabText, tab === 'today' && styles.tabTextActive]}>TODAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabBtn, tab === 'yesterday' && styles.tabBtnActive]} onPress={() => handleTabChange('yesterday')}>
                <Text style={[styles.tabText, tab === 'yesterday' && styles.tabTextActive]}>YESTERDAY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar" size={20 * scale} color={COLORS.text} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            <Text style={styles.selectedDateText}>{date.toLocaleDateString()}</Text>
            <View style={styles.chipsRow}>
              {(['all', 'paid', 'credit', 'pending'] as const).map(k => (
                <TouchableOpacity key={k} style={[styles.chip, statusFilter === k && styles.chipActive]} onPress={() => setStatusFilter(k)}>
                  <Text style={[styles.chipText, statusFilter === k && styles.chipTextActive]}>{k.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Metrics and empty state */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Ionicons name="receipt-outline" size={18 * scale} color={COLORS.text} />
              <Text style={styles.metricLabel}>Orders</Text>
              <Text style={styles.metricValue}>0</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="cube-outline" size={18 * scale} color={COLORS.text} />
              <Text style={styles.metricLabel}>Items</Text>
              <Text style={styles.metricValue}>0</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons name="cash-outline" size={18 * scale} color={COLORS.text} />
              <Text style={styles.metricLabel}>Revenue</Text>
              <Text style={styles.metricValue}>{formatINR(0)}</Text>
            </View>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={42 * scale} color={COLORS.primary} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>Try changing the filters or create a new order.</Text>
            <TouchableOpacity style={styles.emptyCta} onPress={() => setShowAddOrder(true)}>
              <Text style={styles.emptyCtaText}>Create Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


      {/* AddOrder Modal */}
      <AddOrder
        visible={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onAddOrder={handleAddOrder}
        existingOrdersCount={orders.length}
      />
    </SafeAreaView>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16 * scale,
    paddingTop: 8 * scale,
    paddingBottom: 8 * scale,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
  },
  logoBox: {
    width: 32 * scale,
    height: 32 * scale,
    backgroundColor: COLORS.primaryAlt,
    borderRadius: 8 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19 * scale,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    opacity: 0.9,
    marginTop: 2 * scale,
  },
  stickyHeader: {
    backgroundColor: COLORS.surface,
    paddingBottom: 8 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12 * scale,
    marginHorizontal: 8 * scale,
    backgroundColor: COLORS.chipBg,
    borderRadius: 18 * scale,
    paddingHorizontal: 12 * scale,
    paddingVertical: 6 * scale,
    borderWidth: 1,
    borderColor: COLORS.primaryAlt,
  },
  searchInput: {
    flex: 1,
    fontSize: 13 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
    paddingVertical: 4 * scale,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12 * scale,
    marginBottom: 8 * scale,
    paddingHorizontal: 8 * scale,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 6 * scale,
    marginHorizontal: 4 * scale,
    borderRadius: 12 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontFamily: FONTS.semi,
    fontSize: 14 * scale,
  },
  tabTextActive: {
    color: '#fff',
  },
  calendarBtn: {
    padding: 6 * scale,
    marginLeft: 8 * scale,
    backgroundColor: COLORS.chipBg,
    borderRadius: 8 * scale,
  },
  selectedDateText: {
    alignSelf: 'center',
    color: COLORS.text,
    marginBottom: 8 * scale,
    fontFamily: FONTS.semi,
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 8 * scale,
    marginBottom: 8 * scale,
  },
  chip: {
    paddingVertical: 6 * scale,
    paddingHorizontal: 12 * scale,
    backgroundColor: COLORS.chipBg,
    borderRadius: 14 * scale,
    marginRight: 8 * scale,
    borderWidth: 1,
    borderColor: COLORS.primaryAlt,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.text,
    fontFamily: FONTS.semi,
    fontSize: 12 * scale,
  },
  chipTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 8 * scale,
    paddingBottom: 80 * scale,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 14 * scale,
    marginBottom: 12 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8 * scale,
  },
  cardDate: {
    fontWeight: 'bold',
    fontSize: 13 * scale,
    marginBottom: 2 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  cardId: {
    fontSize: 12 * scale,
    color: COLORS.muted,
    fontFamily: FONTS.regular,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4 * scale,
  },
  cardLabel: {
    fontSize: 12 * scale,
    color: COLORS.muted,
    fontFamily: FONTS.regular,
  },
  cardValue: {
    fontSize: 13 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
    marginLeft: 8 * scale,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
    fontFamily: FONTS.semi,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8 * scale,
    gap: 6 * scale,
  },
  chipItem: {
    paddingVertical: 4 * scale,
    paddingHorizontal: 8 * scale,
    borderRadius: 12 * scale,
    backgroundColor: COLORS.chipBg,
    borderWidth: 1,
    borderColor: COLORS.primaryAlt,
  },
  itemChipText: {
    fontSize: 11 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    marginTop: 8 * scale,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16 * scale,
    paddingVertical: 4 * scale,
    paddingHorizontal: 16 * scale,
    marginRight: 12 * scale,
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6 * scale,
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
  },
  statusPill: {
    paddingVertical: 4 * scale,
    paddingHorizontal: 10 * scale,
    borderRadius: 12 * scale,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 11 * scale,
    fontFamily: FONTS.semi,
    letterSpacing: 0.5,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10 * scale,
  },
  totalBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 8 * scale,
    paddingHorizontal: 10 * scale,
    borderRadius: 12 * scale,
    marginHorizontal: 3 * scale,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalLabel: {
    fontSize: 11 * scale,
    color: COLORS.muted,
    fontFamily: FONTS.regular,
  },
  totalValue: {
    fontSize: 13 * scale,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginTop: 2 * scale,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8 * scale,
    marginBottom: 8 * scale,
    marginTop: 4 * scale,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    marginHorizontal: 4 * scale,
    borderRadius: 14 * scale,
    padding: 10 * scale,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 11 * scale,
    color: COLORS.muted,
    marginTop: 4 * scale,
    fontFamily: FONTS.regular,
  },
  metricValue: {
    fontSize: 14 * scale,
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginTop: 2 * scale,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40 * scale,
    paddingHorizontal: 16 * scale,
  },
  emptyTitle: {
    marginTop: 8 * scale,
    fontSize: 16 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
  },
  emptySubtitle: {
    marginTop: 4 * scale,
    fontSize: 12 * scale,
    color: COLORS.muted,
    textAlign: 'center',
    fontFamily: FONTS.regular,
  },
  emptyCta: {
    marginTop: 12 * scale,
    paddingVertical: 8 * scale,
    paddingHorizontal: 16 * scale,
    backgroundColor: COLORS.primary,
    borderRadius: 16 * scale,
  },
  emptyCtaText: {
    color: '#fff',
    fontFamily: FONTS.semi,
    fontSize: 13 * scale,
  },
  moreLink: {
    color: COLORS.primary,
    fontFamily: FONTS.semi,
    marginTop: 2 * scale,
    marginBottom: 2 * scale,
  },
});