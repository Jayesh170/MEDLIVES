import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

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

// Mock completed orders data
const completedOrdersData = [
  {
    id: '1',
    orderId: 'ORD001',
    customerName: 'John Doe',
    date: '15/01/24',
    totalAmount: 1250.50,
    status: 'paid',
    deliveryBoy: 'Rajesh Kumar',
    completedAt: '15/01/24 14:30',
  },
  {
    id: '2',
    orderId: 'ORD002',
    customerName: 'Jane Smith',
    date: '14/01/24',
    totalAmount: 890.00,
    status: 'credit',
    deliveryBoy: 'Amit Singh',
    completedAt: '14/01/24 16:45',
  },
  {
    id: '3',
    orderId: 'ORD003',
    customerName: 'Mike Johnson',
    date: '13/01/24',
    totalAmount: 2100.75,
    status: 'paid',
    deliveryBoy: 'Vikram Patel',
    completedAt: '13/01/24 11:20',
  },
];

const CompletedScreen = () => {
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState(completedOrdersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'credit'>('all');
  const [filteredOrders, setFilteredOrders] = useState(completedOrdersData);

  React.useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.deliveryBoy.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

  const formatINR = (n: number) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const renderOrderCard = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.orderId}</Text>
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: item.status === 'paid' ? COLORS.success : COLORS.danger,
            },
          ]}
        >
          <Text style={styles.statusPillText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <Ionicons name="person-outline" size={16 * scale} color={COLORS.muted} />
        <Text style={styles.customerName}>{item.customerName}</Text>
      </View>

      <View style={styles.deliveryInfo}>
        <Ionicons name="bicycle-outline" size={16 * scale} color={COLORS.muted} />
        <Text style={styles.deliveryText}>{item.deliveryBoy}</Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Total Amount:</Text>
        <Text style={styles.amountValue}>{formatINR(item.totalAmount)}</Text>
      </View>

      <View style={styles.completedInfo}>
        <Ionicons name="checkmark-circle" size={16 * scale} color={COLORS.success} />
        <Text style={styles.completedText}>Completed: {item.completedAt}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoBox}>
            <Ionicons name="checkmark-circle" size={24 * scale} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>COMPLETED ORDERS</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18 * scale} color={COLORS.text} style={{ marginRight: 8 * scale }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.chipsRow}>
          {(['all', 'paid', 'credit'] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.chip, statusFilter === status && styles.chipActive]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[styles.chipText, statusFilter === status && styles.chipTextActive]}>
                {status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: 80 * scale + (insets.bottom || 0) }]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={42 * scale} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>No completed orders</Text>
          <Text style={styles.emptySubtitle}>Completed orders will appear here once they are finished.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

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
  filtersContainer: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 12 * scale,
    backgroundColor: COLORS.surface,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    borderRadius: 18 * scale,
    paddingHorizontal: 12 * scale,
    paddingVertical: 6 * scale,
    borderWidth: 1,
    borderColor: COLORS.primaryAlt,
    marginBottom: 12 * scale,
  },
  searchInput: {
    flex: 1,
    fontSize: 13 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
    paddingVertical: 4 * scale,
  },
  chipsRow: {
    flexDirection: 'row',
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
    paddingHorizontal: 16 * scale,
    paddingBottom: 80 * scale,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
    marginBottom: 12 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  orderId: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  statusPill: {
    paddingVertical: 4 * scale,
    paddingHorizontal: 8 * scale,
    borderRadius: 12 * scale,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 11 * scale,
    fontFamily: FONTS.semi,
    letterSpacing: 0.5,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  customerName: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginLeft: 6 * scale,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  deliveryText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 6 * scale,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  amountLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  amountValue: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.success,
    marginLeft: 6 * scale,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32 * scale,
  },
  emptyTitle: {
    marginTop: 16 * scale,
    fontSize: 18 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8 * scale,
    fontSize: 14 * scale,
    color: COLORS.muted,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    lineHeight: 20 * scale,
  },
});

export default CompletedScreen;
