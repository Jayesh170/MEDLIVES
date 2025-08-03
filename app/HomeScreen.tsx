import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddOrder from './AddOrder';

const { width } = Dimensions.get('window');
const scale = width / 320;

const ordersData = [
  {
    id: '1',
    date: '19/11/24',
    orderId: '1',
    address: 'F-101 SHANTINAGAR',
    contactNumber: '8888133849',
    customerName: 'JAYESH DANGI',
    medications: [
      { name: 'Dolo', qty: 2, price: 150 },
      { name: 'Cyclopalm', qty: 1, price: 250 },
      { name: 'Manforce-Family-Pack', qty: 1, price: 650 },
    ],
    totalAmount: 1100,
    discount: 165,
    discountPercent: 15,
    payableAmount: 935,
    status: 'paid',
  },
  // Add more mock orders as needed
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState('today');
  const [orders, setOrders] = useState(ordersData);
  const [filteredOrders, setFilteredOrders] = useState(ordersData);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      // Filter orders by selected date
      const formatted = format(selectedDate, 'dd/MM/yy');
      setFilteredOrders(ordersData.filter(order => order.date === formatted));
    }
  };

  const handleTabChange = (selectedTab: string) => {
    setTab(selectedTab);
    let targetDate: Date;
    if (selectedTab === 'today') {
      targetDate = new Date();
    } else if (selectedTab === 'yesterday') {
      targetDate = subDays(new Date(), 1);
    } else {
      targetDate = date;
    }
    const formatted = format(targetDate, 'dd/MM/yy');
    setFilteredOrders(orders.filter(order => order.date === formatted));
  };

  const handleAddOrder = (newOrder: any) => {
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    setFilteredOrders(prevFiltered => [newOrder, ...prevFiltered]);
  };

  const renderOrderCard = ({ item }: any) => (
    <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { ...item, medications: JSON.stringify(item.medications) })} activeOpacity={0.8}>
      <View style={styles.card}>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardText}><Text style={styles.bold}>ORDER ID :</Text> {item.orderId}</Text>
        <Text style={styles.cardText}><Text style={styles.bold}>ORDER BY :</Text> {item.customerName}</Text>
        <Text style={styles.cardText}><Text style={styles.bold}>ADDRESS :</Text> {item.address}</Text>
        <Text style={styles.cardText}><Text style={styles.bold}>LIST OF ORDERS</Text></Text>
        <View style={styles.orderListHeader}>
          <Text style={[styles.bold, { flex: 1 }]}>NAME</Text>
          <Text style={[styles.bold, { flex: 1, textAlign: 'center' }]}>QTY</Text>
          <Text style={[styles.bold, { flex: 1, textAlign: 'right' }]}>MRP</Text>
        </View>
        {item.medications.slice(0, 2).map((med: any, idx: number) => (
          <View style={styles.orderListRow} key={idx}>
            <Text style={{ flex: 1 }}>{med.name}</Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>{med.qty}</Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>{med.qty} x {med.price} = {med.qty * med.price}</Text>
          </View>
        ))}
        {item.medications.length > 2 && (
          <Text style={{ color: '#2EC4D6', fontWeight: 'bold', marginTop: 2, marginBottom: 2 }}>More...</Text>
        )}
        <Text style={styles.cardText}><Text style={styles.bold}>TOTAL AMOUNT :</Text> ₹{item.totalAmount.toFixed(2)}</Text>
        <View style={styles.statusRow}>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#65B924' }]} activeOpacity={0.7}>
            <Ionicons name="checkmark" size={18 * scale} color="#fff" />
            <Text style={styles.statusBtnText}>PAID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#FF2A2A' }]} activeOpacity={0.7}>
            <Text style={styles.statusBtnText}>CREDIT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
        <TouchableOpacity style={styles.toggleBtn}>
          <Ionicons name="toggle" size={32 * scale} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'today' && styles.tabBtnActive]} onPress={() => handleTabChange('today')}>
          <Text style={[styles.tabText, tab === 'today' && styles.tabTextActive]}>TODAY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'yesterday' && styles.tabBtnActive]} onPress={() => handleTabChange('yesterday')}>
          <Text style={[styles.tabText, tab === 'yesterday' && styles.tabTextActive]}>YESTERDAY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar" size={20 * scale} color="#0A174E" />
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
      {/* Optionally show selected date */}
      <Text style={{alignSelf: 'center', color: '#0A174E', marginBottom: 8 * scale}}>
        {date.toLocaleDateString()}
      </Text>
      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={renderOrderCard}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<>
          <View style={styles.card} />
          <View style={styles.card} />
        </>}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>No orders found</Text>}
        showsVerticalScrollIndicator={false}
      />
      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="home" size={24 * scale} color="#0A174E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="search" size={24 * scale} color="#0A174E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddOrder(true)}>
          <Ionicons name="add" size={32 * scale} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <Ionicons name="checkmark" size={24 * scale} color="#0A174E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIcon}>
          <FontAwesome name="user" size={24 * scale} color="#0A174E" />
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2EC4D6',
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
    backgroundColor: '#37b9c5',
    borderRadius: 8 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  toggleBtn: {
    padding: 4 * scale,
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
    backgroundColor: '#e0f7fa',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#2EC4D6',
  },
  tabText: {
    color: '#0A174E',
    fontWeight: 'bold',
    fontSize: 14 * scale,
  },
  tabTextActive: {
    color: '#fff',
  },
  calendarBtn: {
    padding: 6 * scale,
    marginLeft: 8 * scale,
    backgroundColor: '#e0f7fa',
    borderRadius: 8 * scale,
  },
  listContent: {
    paddingHorizontal: 8 * scale,
    paddingBottom: 80 * scale,
  },
  card: {
    backgroundColor: '#f3f3f3',
    borderRadius: 20 * scale,
    padding: 12 * scale,
    marginBottom: 16 * scale,
    minHeight: 180 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDate: {
    fontWeight: 'bold',
    fontSize: 13 * scale,
    marginBottom: 2 * scale,
    color: '#222',
  },
  cardText: {
    fontSize: 12 * scale,
    color: '#222',
    marginBottom: 2 * scale,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
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
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 24 * scale,
    paddingVertical: 8 * scale,
    height: 60 * scale,
    zIndex: 10,
  },
  bottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addBtn: {
    width: 48 * scale,
    height: 48 * scale,
    borderRadius: 24 * scale,
    backgroundColor: '#2EC4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8 * scale,
    marginTop: -24 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
}); 