import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  primaryAlt: '#37B9C5',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  border: '#eee',
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

// Mock customer orders data
const customerOrders = [
  {
    id: '1',
    orderId: 'ORD-001',
    date: '2024-01-15',
    totalAmount: 1500,
    status: 'completed',
    items: [
      { name: 'Paracetamol 500mg', qty: 2, price: 25 },
      { name: 'Amoxicillin 250mg', qty: 1, price: 45 },
    ],
  },
  {
    id: '2',
    orderId: 'ORD-002',
    date: '2024-01-10',
    totalAmount: 2200,
    status: 'pending',
    items: [
      { name: 'Vitamin D3', qty: 1, price: 120 },
      { name: 'Calcium Tablets', qty: 2, price: 180 },
    ],
  },
];

const CustomerDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const customer = {
    id: params.id || '1',
    name: params.name || 'John Doe',
    phone: params.phone || '9876543210',
    society: params.society || 'Green Valley',
    wing: params.wing || 'A',
    flatNo: params.flatNo || '101',
    address: params.address || '',
    totalOrders: parseInt(params.totalOrders as string) || 15,
    lastOrder: params.lastOrder || '2024-01-15',
    creditAmount: parseInt(params.creditAmount as string) || 2500,
    hasCredit: params.hasCredit === 'true',
    hasOrders: params.hasOrders === 'true',
    status: params.status || 'active',
  };

  const handleCall = () => {
    Linking.openURL(`tel:${customer.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `Hello ${customer.name}, I hope you're doing well. This is regarding your recent orders.`;
    Linking.openURL(`whatsapp://send?phone=${customer.phone}&text=${encodeURIComponent(message)}`);
  };

  const renderOrderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={styles.orderAmount}>
          <Text style={styles.amountText}>₹{item.totalAmount}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: item.status === 'completed' ? COLORS.success : COLORS.warning }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.itemsContainer}>
        {item.items.map((med: any, index: number) => (
          <View key={index} style={styles.medItem}>
            <Text style={styles.medName}>{med.name}</Text>
            <Text style={styles.medDetails}>{med.qty} x ₹{med.price} = ₹{med.qty * med.price}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Customer Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{customer.name.charAt(0)}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{customer.name}</Text>
            <Text style={styles.customerPhone}>{customer.phone}</Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: customer.status === 'active' ? COLORS.success : COLORS.muted }
              ]}>
                <Text style={styles.statusText}>{customer.status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.addressSection}>
          <Ionicons name="location-outline" size={16 * scale} color={COLORS.muted} />
          <Text style={styles.addressText}>
            {customer.society === 'Others' 
              ? customer.address 
              : `${customer.flatNo} ${customer.wing} ${customer.society}`
            }
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall}>
            <Ionicons name="call" size={18 * scale} color="#fff" />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={18 * scale} color="#fff" />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="bag-outline" size={24 * scale} color={COLORS.primary} />
          <Text style={styles.statValue}>{customer.totalOrders}</Text>
          <Text style={styles.statLabel}>Total Orders</Text>
        </View>
        {customer.hasCredit && (
          <View style={styles.statCard}>
            <Ionicons name="card-outline" size={24 * scale} color={COLORS.warning} />
            <Text style={styles.statValue}>₹{customer.creditAmount}</Text>
            <Text style={styles.statLabel}>Credit Amount</Text>
          </View>
        )}
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={24 * scale} color={COLORS.info} />
          <Text style={styles.statValue}>{customer.lastOrder || 'N/A'}</Text>
          <Text style={styles.statLabel}>Last Order</Text>
        </View>
      </View>
    </View>
  );

  const renderOrders = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={customerOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerActionBtn} 
            onPress={() => router.push('/')}
          >
            <Ionicons name="home" size={20 * scale} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn} onPress={handleCall}>
            <Ionicons name="call" size={20 * scale} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionBtn} onPress={handleWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer Name */}
      <View style={styles.customerHeader}>
        <Text style={styles.customerTitle}>{customer.name}</Text>
        <Text style={styles.customerSubtitle}>
          {customer.society === 'Others' 
            ? customer.address 
            : `${customer.flatNo} ${customer.wing} ${customer.society}`
          }
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            Orders ({customer.totalOrders})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'overview' ? renderOverview() : renderOrders()}
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
    paddingBottom: 16 * scale,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
  },
  backBtn: {
    marginRight: 12 * scale,
    padding: 4 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    marginLeft: 12 * scale,
    padding: 8 * scale,
    backgroundColor: COLORS.primaryAlt,
    borderRadius: 20 * scale,
  },
  customerHeader: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  customerTitle: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  customerSubtitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12 * scale,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.muted,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16 * scale,
    paddingTop: 16 * scale,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
    marginBottom: 16 * scale,
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
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  customerPhone: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 8 * scale,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
  },
  statusText: {
    fontSize: 10 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
    textTransform: 'uppercase',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  addressText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 6 * scale,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success,
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    marginRight: 8 * scale,
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    marginLeft: 8 * scale,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    marginLeft: 6 * scale,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16 * scale,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12 * scale,
    padding: 16 * scale,
    alignItems: 'center',
    marginHorizontal: 4 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 8 * scale,
    marginBottom: 4 * scale,
  },
  statLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
  },
  ordersList: {
    paddingBottom: 20 * scale,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12 * scale,
    padding: 16 * scale,
    marginBottom: 12 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12 * scale,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  orderDate: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12 * scale,
  },
  medItem: {
    marginBottom: 8 * scale,
  },
  medName: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  medDetails: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
});

export default CustomerDetails;
