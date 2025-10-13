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
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

// Mock customer data
const customersData = [
  {
    id: '1',
    name: 'John Doe',
    phone: '9876543210',
    society: 'Green Valley',
    wing: 'A',
    flatNo: '101',
    totalOrders: 15,
    lastOrder: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '9876543211',
    society: 'Sunshine Apartments',
    wing: 'B',
    flatNo: '205',
    totalOrders: 8,
    lastOrder: '2024-01-14',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '9876543212',
    society: 'Others',
    address: '123 Main Street, City',
    totalOrders: 22,
    lastOrder: '2024-01-13',
  },
];

const CustomersScreen = () => {
  const insets = useSafeAreaInsets();
  const [customers, setCustomers] = useState(customersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customersData);

  React.useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.society.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const renderCustomerCard = ({ item }: any) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>
        <View style={styles.orderStats}>
          <Text style={styles.orderCount}>{item.totalOrders}</Text>
          <Text style={styles.orderLabel}>Orders</Text>
        </View>
      </View>
      
      <View style={styles.addressSection}>
        <Ionicons name="location-outline" size={16 * scale} color={COLORS.muted} />
        <Text style={styles.addressText}>
          {item.society === 'Others' 
            ? item.address 
            : `${item.flatNo} ${item.wing} ${item.society}`
          }
        </Text>
      </View>
      
      <View style={styles.lastOrderSection}>
        <Text style={styles.lastOrderLabel}>Last Order:</Text>
        <Text style={styles.lastOrderDate}>{item.lastOrder}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoBox}>
            <Ionicons name="people" size={24 * scale} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>CUSTOMERS</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18 * scale} color={COLORS.text} style={{ marginRight: 8 * scale }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            placeholderTextColor={COLORS.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Customers List */}
      {filteredCustomers.length > 0 ? (
        <FlatList
          data={filteredCustomers}
          keyExtractor={item => item.id}
          renderItem={renderCustomerCard}
          contentContainerStyle={[styles.listContent, { paddingBottom: 80 * scale + (insets.bottom || 0) }]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={42 * scale} color={COLORS.primary} />
          <Text style={styles.emptyTitle}>No customers found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or add new customers through orders.</Text>
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
  searchContainer: {
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
  },
  searchInput: {
    flex: 1,
    fontSize: 13 * scale,
    color: COLORS.text,
    fontFamily: FONTS.semi,
    paddingVertical: 4 * scale,
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
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  avatar: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  customerPhone: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  orderStats: {
    alignItems: 'center',
  },
  orderCount: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  orderLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  addressText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 6 * scale,
    flex: 1,
  },
  lastOrderSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastOrderLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  lastOrderDate: {
    fontSize: 12 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
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

export default CustomersScreen;
