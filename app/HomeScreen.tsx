import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddOrder from './AddOrder';
import DatabaseService, { Order } from './services/DatabaseService';
import { societies } from './constants/societies';

const { width } = Dimensions.get('window');
const scale = width / 320;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState('today');
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [selectedSociety, setSelectedSociety] = useState<string>('All');
  const [showSocietyFilter, setShowSocietyFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load orders from database on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders when tab, date, or society changes
  useEffect(() => {
    filterOrders();
  }, [orders, tab, date, selectedSociety]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const dbService = DatabaseService.getInstance();
      await dbService.initializeSampleData(); // Initialize sample data if needed
      const allOrders = await dbService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let targetDate: Date;
    if (tab === 'today') {
      targetDate = new Date();
    } else if (tab === 'yesterday') {
      targetDate = subDays(new Date(), 1);
    } else {
      targetDate = date;
    }
    
    const formatted = format(targetDate, 'dd/MM/yy');
    let filtered = orders.filter(order => order.date === formatted);
    
    // Apply society filter
    if (selectedSociety !== 'All') {
      filtered = filtered.filter(order => order.society === selectedSociety);
    }
    
    setFilteredOrders(filtered);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setTab('custom'); // Set to custom when date picker is used
    }
  };

  const handleTabChange = (selectedTab: string) => {
    setTab(selectedTab);
    // filterOrders will be called automatically by useEffect
  };

  const handleAddOrder = async (newOrder: Order) => {
    // Reload orders from database to ensure we have the latest data
    await loadOrders();
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={styles.filterBtn} 
            onPress={() => setShowSocietyFilter(true)}
          >
            <Ionicons name="filter" size={20 * scale} color="#fff" />
            <Text style={styles.filterText}>{selectedSociety}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleBtn}>
            <Ionicons name="toggle" size={32 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
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
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 16 }}>Loading orders...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={item => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<>
            <View style={styles.card} />
            <View style={styles.card} />
          </>}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ textAlign: 'center', color: '#888', fontSize: 16, marginBottom: 8 }}>
                No orders found
              </Text>
              <Text style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>
                {selectedSociety !== 'All' ? `for ${selectedSociety}` : 'for the selected date'}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
      
      {/* Society Filter Modal */}
      <Modal
        visible={showSocietyFilter}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSocietyFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Society</Text>
            <ScrollView style={styles.societyList}>
              <TouchableOpacity
                style={[
                  styles.societyItem,
                  selectedSociety === 'All' && styles.societyItemSelected
                ]}
                onPress={() => {
                  setSelectedSociety('All');
                  setShowSocietyFilter(false);
                }}
              >
                <Text style={[
                  styles.societyItemText,
                  selectedSociety === 'All' && styles.societyItemTextSelected
                ]}>All Societies</Text>
              </TouchableOpacity>
              {societies.map((society) => (
                <TouchableOpacity
                  key={society.name}
                  style={[
                    styles.societyItem,
                    selectedSociety === society.name && styles.societyItemSelected
                  ]}
                  onPress={() => {
                    setSelectedSociety(society.name);
                    setShowSocietyFilter(false);
                  }}
                >
                  <Text style={[
                    styles.societyItemText,
                    selectedSociety === society.name && styles.societyItemTextSelected
                  ]}>{society.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[
                  styles.societyItem,
                  selectedSociety === 'Others' && styles.societyItemSelected
                ]}
                onPress={() => {
                  setSelectedSociety('Others');
                  setShowSocietyFilter(false);
                }}
              >
                <Text style={[
                  styles.societyItemText,
                  selectedSociety === 'Others' && styles.societyItemTextSelected
                ]}>Others</Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowSocietyFilter(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12 * scale,
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    marginRight: 8 * scale,
  },
  filterText: {
    color: '#fff',
    fontSize: 12 * scale,
    fontWeight: 'bold',
    marginLeft: 4 * scale,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20 * scale,
    padding: 24 * scale,
    width: '80%',
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    marginBottom: 16 * scale,
    textAlign: 'center',
  },
  societyList: {
    maxHeight: 300 * scale,
  },
  societyItem: {
    paddingVertical: 12 * scale,
    paddingHorizontal: 16 * scale,
    borderRadius: 8 * scale,
    marginBottom: 8 * scale,
    backgroundColor: '#F2F6FA',
  },
  societyItemSelected: {
    backgroundColor: '#2EC4D6',
  },
  societyItemText: {
    fontSize: 16 * scale,
    color: '#0A174E',
    fontWeight: '500',
  },
  societyItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    backgroundColor: '#2EC4D6',
    borderRadius: 12 * scale,
    paddingVertical: 12 * scale,
    alignItems: 'center',
    marginTop: 16 * scale,
  },
  modalCloseBtnText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: 'bold',
  },
}); 