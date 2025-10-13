import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AddOrder from './AddOrderFixed';
import { apiService } from '../src/services/api';

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

const HomeScreen = () => {
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
  }, []);

  const loadOrders = async () => {
    try {
      const res = await apiService.getOrders();
      if (res.success && (res.data as any)?.data) {
        setOrders((res.data as any).data);
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

  const handleAddOrder = async (newOrder: any) => {
    // Optimistic update: show immediately
    setOrders(prev => [newOrder, ...prev]);
    try {
      const res = await apiService.createOrder(newOrder);
      if (res.success && (res.data as any)?.data) {
        const created = (res.data as any).data;
        // Replace the temp item (matched by temp id or orderId) with server doc
        setOrders(prev => prev.map(o => (o.id && o.id === newOrder.id) || (o.orderId && o.orderId === newOrder.orderId) ? created : o));
      }
    } catch (e) {
      console.error('Failed to create order', e);
      // Keep optimistic item; optionally flag unsynced
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setFilteredOrders(computeFilters(orders));
    setRefreshing(false);
  };

  const markStatus = (id: string, status: 'paid' | 'credit' | 'pending') => {
    setOrders(prev => prev.map(o => ((o as any)._id === id || (o as any).id === id ? { ...o, status } : o)));
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
  );

  const renderOrderCard = ({ item }: any) => (
    <Swipeable renderLeftActions={() => renderLeftActions(item)} renderRightActions={() => renderRightActions(item)}>
      <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { ...item, medications: JSON.stringify(item.medications) })} activeOpacity={0.8}>
        <View style={styles.card}>
          <Text style={styles.cardDate}>{item.date}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>ORDER ID :</Text> {item.orderId}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>ORDER BY :</Text> {item.customerName}</Text>
          <Text style={styles.cardText} numberOfLines={1}><Text style={styles.bold}>ADDRESS :</Text> {item.address}</Text>
          <Text style={styles.cardText}><Text style={styles.bold}>LIST OF ORDERS</Text></Text>
          <View style={styles.orderListHeader}>
            <Text style={[styles.bold, { flex: 1 }]}>NAME</Text>
            <Text style={[styles.bold, { flex: 1, textAlign: 'center' }]}>QTY</Text>
            <Text style={[styles.bold, { flex: 1, textAlign: 'right' }]}>MRP</Text>
          </View>
        {item.medications.slice(0, 2).map((med: any, idx: number) => (
          <View style={styles.orderListRow} key={idx}>
            <Text style={[styles.medCell, { flex: 1 }]}>{med.name}</Text>
            <Text style={[styles.medCell, { flex: 1, textAlign: 'center' }]}>{med.qty}</Text>
            <Text style={[styles.medCell, { flex: 1, textAlign: 'right' }]}>{med.qty} x {med.price} = {med.qty * med.price}</Text>
          </View>
        ))}
        {item.medications.length > 2 && (
          <Text style={styles.moreLink}>More...</Text>
        )}
        <Text style={styles.cardText}><Text style={styles.bold}>TOTAL AMOUNT :</Text> {formatINR(item.totalAmount)}</Text>
        <View style={styles.statusRow}>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: COLORS.success }]} activeOpacity={0.7}>
            <Ionicons name="checkmark" size={18 * scale} color="#fff" />
            <Text style={styles.statusBtnText}>PAID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: COLORS.danger }]} activeOpacity={0.7}>
            <Text style={styles.statusBtnText}>CREDIT</Text>
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>OMKAR MEDICAL</Text>
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

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: (insets.bottom || 10 * scale),
            height: 54 * scale + (insets.bottom || 10 * scale),
          },
        ]}
      >
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="home" size={20 * scale} color={COLORS.primary} />
          <Text style={[styles.bottomLabel, { color: COLORS.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="people" size={20 * scale} color={COLORS.text} />
          <Text style={styles.bottomLabel}>Customers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddOrder(true)}>
          <Ionicons name="add" size={28 * scale} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="checkmark-circle-outline" size={20 * scale} color={COLORS.text} />
          <Text style={styles.bottomLabel}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <FontAwesome name="user" size={20 * scale} color={COLORS.text} />
          <Text style={styles.bottomLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* AddOrder Modal */}
      <AddOrder
        visible={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onAddOrder={handleAddOrder}
        existingOrdersCount={orders.length}
      />
    </SafeAreaView>
  );
};

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
    fontSize: 18 * scale,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    letterSpacing: 1,
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
    borderRadius: 20 * scale,
    padding: 12 * scale,
    marginBottom: 16 * scale,
    minHeight: 180 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardDate: {
    fontWeight: 'bold',
    fontSize: 13 * scale,
    marginBottom: 2 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  cardText: {
    fontSize: 12 * scale,
    color: '#222',
    marginBottom: 2 * scale,
    fontFamily: FONTS.regular,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
    fontFamily: FONTS.semi,
  },
  orderListHeader: {
    flexDirection: 'row',
    marginTop: 6 * scale,
    marginBottom: 2 * scale,
  },
  orderListRow: {
    flexDirection: 'row',
    marginBottom: 2 * scale,
  },
  medCell: {
    fontFamily: FONTS.regular,
    color: '#222',
    fontSize: 12 * scale,
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
    position: 'absolute',
    right: 12 * scale,
    top: 12 * scale,
    paddingVertical: 3 * scale,
    paddingHorizontal: 10 * scale,
    borderRadius: 12 * scale,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 11 * scale,
    fontFamily: FONTS.semi,
    letterSpacing: 0.5,
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
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12 * scale,
    paddingVertical: 10 * scale,
    height: 64 * scale,
    zIndex: 10,
  },
  bottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56 * scale,
    paddingHorizontal: 4 * scale,
  },
  bottomLabel: {
    marginTop: 3 * scale,
    fontSize: 11 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
  },
  addBtn: {
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8 * scale,
    marginTop: -28 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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