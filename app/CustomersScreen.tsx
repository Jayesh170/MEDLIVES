import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Modal } from 'react-native';
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
  info: '#3B82F6',
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

// Enhanced customer data structure
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
    creditAmount: 2500,
    hasCredit: true,
    hasOrders: true,
    status: 'active',
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
    creditAmount: 0,
    hasCredit: false,
    hasOrders: true,
    status: 'active',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '9876543212',
    society: 'Others',
    address: '123 Main Street, City',
    totalOrders: 22,
    lastOrder: '2024-01-13',
    creditAmount: 5000,
    hasCredit: true,
    hasOrders: true,
    status: 'active',
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    phone: '9876543213',
    society: 'Green Valley',
    wing: 'B',
    flatNo: '302',
    totalOrders: 0,
    lastOrder: null,
    creditAmount: 0,
    hasCredit: false,
    hasOrders: false,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'David Brown',
    phone: '9876543214',
    society: 'Others',
    address: '456 Oak Avenue, Downtown',
    totalOrders: 5,
    lastOrder: '2024-01-10',
    creditAmount: 1200,
    hasCredit: true,
    hasOrders: true,
    status: 'active',
  },
  {
    id: '6',
    name: 'Lisa Davis',
    phone: '9876543215',
    society: 'Sunshine Apartments',
    wing: 'A',
    flatNo: '103',
    totalOrders: 12,
    lastOrder: '2024-01-12',
    creditAmount: 0,
    hasCredit: false,
    hasOrders: true,
    status: 'active',
  },
];

// Societies data
const societiesData = [
  {
    name: 'Green Valley',
    wings: [
      { name: 'A', flats: ['101', '102', '103', '104', '105'] },
      { name: 'B', flats: ['201', '202', '203', '204', '205'] },
      { name: 'C', flats: ['301', '302', '303', '304', '305'] },
    ],
  },
  {
    name: 'Sunshine Apartments',
    wings: [
      { name: 'A', flats: ['101', '102', '103'] },
      { name: 'B', flats: ['201', '202', '203'] },
    ],
  },
];

const CustomersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [customers, setCustomers] = useState(customersData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(customersData);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedSociety, setSelectedSociety] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedFlat, setSelectedFlat] = useState('');
  const [creditFilter, setCreditFilter] = useState('all'); // all, hasCredit, noCredit
  const [orderFilter, setOrderFilter] = useState('all'); // all, hasOrders, noOrders
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  // Get available options for filters
  const availableSocieties = [...new Set(customers.map(c => c.society))];
  const availableWings = selectedSociety && selectedSociety !== 'Others' 
    ? [...new Set(customers.filter(c => c.society === selectedSociety).map(c => c.wing).filter(Boolean))]
    : [];
  const availableFlats = selectedSociety && selectedSociety !== 'Others' && selectedWing
    ? [...new Set(customers.filter(c => c.society === selectedSociety && c.wing === selectedWing).map(c => c.flatNo).filter(Boolean))]
    : [];

  // Apply filters
  useEffect(() => {
    let filtered = customers;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery) ||
        customer.society.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Society filter
    if (selectedSociety) {
      filtered = filtered.filter(customer => customer.society === selectedSociety);
    }

    // Wing filter
    if (selectedWing) {
      filtered = filtered.filter(customer => customer.wing === selectedWing);
    }

    // Flat filter
    if (selectedFlat) {
      filtered = filtered.filter(customer => customer.flatNo === selectedFlat);
    }

    // Credit filter
    if (creditFilter === 'hasCredit') {
      filtered = filtered.filter(customer => customer.hasCredit);
    } else if (creditFilter === 'noCredit') {
      filtered = filtered.filter(customer => !customer.hasCredit);
    }

    // Order filter
    if (orderFilter === 'hasOrders') {
      filtered = filtered.filter(customer => customer.hasOrders);
    } else if (orderFilter === 'noOrders') {
      filtered = filtered.filter(customer => !customer.hasOrders);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(customer => customer.status === 'active');
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(customer => customer.status === 'inactive');
    }

    setFilteredCustomers(filtered);
  }, [searchQuery, selectedSociety, selectedWing, selectedFlat, creditFilter, orderFilter, statusFilter, customers]);

  const clearAllFilters = () => {
    setSelectedSociety('');
    setSelectedWing('');
    setSelectedFlat('');
    setCreditFilter('all');
    setOrderFilter('all');
    setStatusFilter('all');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSociety) count++;
    if (selectedWing) count++;
    if (selectedFlat) count++;
    if (creditFilter !== 'all') count++;
    if (orderFilter !== 'all') count++;
    if (statusFilter !== 'all') count++;
    return count;
  };

  const handleCustomerPress = (customer: any) => {
    router.push({
      pathname: '/CustomerDetails',
      params: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        society: customer.society,
        wing: customer.wing || '',
        flatNo: customer.flatNo || '',
        address: customer.address || '',
        totalOrders: customer.totalOrders.toString(),
        lastOrder: customer.lastOrder || '',
        creditAmount: customer.creditAmount.toString(),
        hasCredit: customer.hasCredit.toString(),
        hasOrders: customer.hasOrders.toString(),
        status: customer.status,
      },
    });
  };

  const renderCustomerCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.8}
      onPress={() => handleCustomerPress(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: item.status === 'active' ? COLORS.success : COLORS.muted }
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.orderStats}>
            <Text style={styles.orderCount}>{item.totalOrders}</Text>
            <Text style={styles.orderLabel}>Orders</Text>
          </View>
          {item.hasCredit && (
            <View style={styles.creditStats}>
              <Text style={styles.creditAmount}>₹{item.creditAmount}</Text>
              <Text style={styles.creditLabel}>Credit</Text>
            </View>
          )}
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
        <Text style={styles.lastOrderDate}>
          {item.lastOrder || 'No orders yet'}
        </Text>
      </View>

      {/* Credit and Order indicators */}
      <View style={styles.indicatorsContainer}>
        {item.hasCredit && (
          <View style={styles.creditIndicator}>
            <Ionicons name="card-outline" size={14 * scale} color={COLORS.warning} />
            <Text style={styles.indicatorText}>Credit</Text>
          </View>
        )}
        {item.hasOrders && (
          <View style={styles.orderIndicator}>
            <Ionicons name="bag-outline" size={14 * scale} color={COLORS.success} />
            <Text style={styles.indicatorText}>Orders</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFilterModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Customers</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Society Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Society</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                <TouchableOpacity
                  style={[styles.filterChip, selectedSociety === '' && styles.activeChip]}
                  onPress={() => setSelectedSociety('')}
                >
                  <Text style={[styles.chipText, selectedSociety === '' && styles.activeChipText]}>All</Text>
                </TouchableOpacity>
                {availableSocieties.map((society, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.filterChip, selectedSociety === society && styles.activeChip]}
                    onPress={() => {
                      setSelectedSociety(society);
                      setSelectedWing('');
                      setSelectedFlat('');
                    }}
                  >
                    <Text style={[styles.chipText, selectedSociety === society && styles.activeChipText]}>{society}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Wing Filter */}
            {selectedSociety && selectedSociety !== 'Others' && availableWings.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Wing</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                  <TouchableOpacity
                    style={[styles.filterChip, selectedWing === '' && styles.activeChip]}
                    onPress={() => setSelectedWing('')}
                  >
                    <Text style={[styles.chipText, selectedWing === '' && styles.activeChipText]}>All</Text>
                  </TouchableOpacity>
                  {availableWings.map((wing, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterChip, selectedWing === wing && styles.activeChip]}
                      onPress={() => {
                        setSelectedWing(wing);
                        setSelectedFlat('');
                      }}
                    >
                      <Text style={[styles.chipText, selectedWing === wing && styles.activeChipText]}>{wing}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Flat Filter */}
            {selectedSociety && selectedSociety !== 'Others' && selectedWing && availableFlats.length > 0 && (
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Flat</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
                  <TouchableOpacity
                    style={[styles.filterChip, selectedFlat === '' && styles.activeChip]}
                    onPress={() => setSelectedFlat('')}
                  >
                    <Text style={[styles.chipText, selectedFlat === '' && styles.activeChipText]}>All</Text>
                  </TouchableOpacity>
                  {availableFlats.map((flat, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.filterChip, selectedFlat === flat && styles.activeChip]}
                      onPress={() => setSelectedFlat(flat)}
                    >
                      <Text style={[styles.chipText, selectedFlat === flat && styles.activeChipText]}>{flat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Credit Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Credit Status</Text>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, creditFilter === 'all' && styles.activeChip]}
                  onPress={() => setCreditFilter('all')}
                >
                  <Text style={[styles.chipText, creditFilter === 'all' && styles.activeChipText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, creditFilter === 'hasCredit' && styles.activeChip]}
                  onPress={() => setCreditFilter('hasCredit')}
                >
                  <Text style={[styles.chipText, creditFilter === 'hasCredit' && styles.activeChipText]}>Has Credit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, creditFilter === 'noCredit' && styles.activeChip]}
                  onPress={() => setCreditFilter('noCredit')}
                >
                  <Text style={[styles.chipText, creditFilter === 'noCredit' && styles.activeChipText]}>No Credit</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Order Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Order Status</Text>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, orderFilter === 'all' && styles.activeChip]}
                  onPress={() => setOrderFilter('all')}
                >
                  <Text style={[styles.chipText, orderFilter === 'all' && styles.activeChipText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, orderFilter === 'hasOrders' && styles.activeChip]}
                  onPress={() => setOrderFilter('hasOrders')}
                >
                  <Text style={[styles.chipText, orderFilter === 'hasOrders' && styles.activeChipText]}>Has Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, orderFilter === 'noOrders' && styles.activeChip]}
                  onPress={() => setOrderFilter('noOrders')}
                >
                  <Text style={[styles.chipText, orderFilter === 'noOrders' && styles.activeChipText]}>No Orders</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Customer Status</Text>
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'all' && styles.activeChip]}
                  onPress={() => setStatusFilter('all')}
                >
                  <Text style={[styles.chipText, statusFilter === 'all' && styles.activeChipText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'active' && styles.activeChip]}
                  onPress={() => setStatusFilter('active')}
                >
                  <Text style={[styles.chipText, statusFilter === 'active' && styles.activeChipText]}>Active</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterChip, statusFilter === 'inactive' && styles.activeChip]}
                  onPress={() => setStatusFilter('inactive')}
                >
                  <Text style={[styles.chipText, statusFilter === 'inactive' && styles.activeChipText]}>Inactive</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={20 * scale} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.customerSection}>
          <View style={styles.logoBox}>
            <Ionicons name="people" size={24 * scale} color="#fff" />
          </View>
          <Text style={styles.headerTitle}>CUSTOMERS</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter" size={20 * scale} color="#fff" />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
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

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeFilters}>
            {selectedSociety && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Society: {selectedSociety}</Text>
                <TouchableOpacity onPress={() => {
                  setSelectedSociety('');
                  setSelectedWing('');
                  setSelectedFlat('');
                }}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedWing && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Wing: {selectedWing}</Text>
                <TouchableOpacity onPress={() => {
                  setSelectedWing('');
                  setSelectedFlat('');
                }}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedFlat && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Flat: {selectedFlat}</Text>
                <TouchableOpacity onPress={() => setSelectedFlat('')}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            {creditFilter !== 'all' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  Credit: {creditFilter === 'hasCredit' ? 'Has Credit' : 'No Credit'}
                </Text>
                <TouchableOpacity onPress={() => setCreditFilter('all')}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            {orderFilter !== 'all' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  Orders: {orderFilter === 'hasOrders' ? 'Has Orders' : 'No Orders'}
                </Text>
                <TouchableOpacity onPress={() => setOrderFilter('all')}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
            {statusFilter !== 'all' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Status: {statusFilter}</Text>
                <TouchableOpacity onPress={() => setStatusFilter('all')}>
                  <Ionicons name="close" size={16 * scale} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

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
          <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find customers.</Text>
        </View>
      )}

      {renderFilterModal()}
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16 * scale,
    paddingTop: 8 * scale,
    paddingBottom: 8 * scale,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
  },
  backButton: {
    padding: 8 * scale,
    marginRight: 12 * scale,
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBox: {
    padding: 8 * scale,
    marginRight: 8 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8 * scale,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4 * scale,
    right: -4 * scale,
    backgroundColor: COLORS.danger,
    borderRadius: 10 * scale,
    width: 20 * scale,
    height: 20 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: 10 * scale,
    fontFamily: FONTS.bold,
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
  activeFiltersContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activeFilters: {
    flexDirection: 'row',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * scale,
    paddingVertical: 6 * scale,
    borderRadius: 16 * scale,
    marginRight: 8 * scale,
  },
  activeFilterText: {
    color: '#fff',
    fontSize: 12 * scale,
    fontFamily: FONTS.semi,
    marginRight: 4 * scale,
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
    marginBottom: 4 * scale,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8 * scale,
    paddingVertical: 2 * scale,
    borderRadius: 10 * scale,
  },
  statusText: {
    fontSize: 10 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
    textTransform: 'uppercase',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  orderStats: {
    alignItems: 'center',
    marginBottom: 4 * scale,
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
  creditStats: {
    alignItems: 'center',
  },
  creditAmount: {
    fontSize: 14 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.warning,
  },
  creditLabel: {
    fontSize: 10 * scale,
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
    marginBottom: 8 * scale,
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
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
    marginRight: 8 * scale,
  },
  orderIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
  },
  indicatorText: {
    fontSize: 10 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginLeft: 4 * scale,
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20 * scale,
    borderTopRightRadius: 20 * scale,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  filterContent: {
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
  },
  filterSection: {
    marginBottom: 20 * scale,
  },
  filterLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  chipContainer: {
    flexDirection: 'row',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 20 * scale,
    marginRight: 8 * scale,
    marginBottom: 8 * scale,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
  activeChipText: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  clearButton: {
    flex: 1,
    backgroundColor: COLORS.muted + '20',
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginRight: 8 * scale,
  },
  clearButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.muted,
  },
  applyButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginLeft: 8 * scale,
  },
  applyButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
});

export default CustomersScreen;
