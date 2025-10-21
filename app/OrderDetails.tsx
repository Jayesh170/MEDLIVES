import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const {
    orderId,
    address,
    contactNumber,
    customerName,
    medications,
    totalAmount,
    discount,
    discountPercent,
    payableAmount,
    status,
  } = params;

  const handleCall = () => {
    Linking.openURL(`tel:${contactNumber}`);
  };

  // Parse medications if passed as a string (Expo Router serializes arrays/objects)
  let meds = [];
  if (typeof medications === 'string') {
    try {
      meds = JSON.parse(medications);
    } catch {
      meds = [];
    }
  } else if (Array.isArray(medications)) {
    meds = medications;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>
      <View style={styles.container}>
        {/* Top info card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderTitle}>Order #{orderId}</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{String(status || 'pending').toUpperCase()}</Text>
            </View>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 6 }]}>
            <Text style={styles.label}>Contact</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text style={[styles.value, { color: '#2EC4D6', textDecorationLine: 'underline' }]}>{contactNumber}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.label}>Delivery Address</Text>
            <View style={styles.addressRow}>
              <Text style={[styles.value, { flex: 1 }]}>{address}</Text>
              <MaterialIcons name="location-pin" size={18} color="#222" />
            </View>
          </View>
        </View>

        {/* Items list */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {Array.isArray(meds) && meds.map((med, idx) => {
            const qty = Number((med as any).qty ?? 0);
            const price = Number((med as any).price ?? 0);
            return (
              <View key={idx} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medName}>{(med as any).name}</Text>
                  <Text style={styles.medSub}>{qty} x {price} = {qty * price}</Text>
                </View>
                <Text style={styles.itemAmt}>₹{(qty * price).toFixed(2)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={styles.card}>
          <View style={styles.amountRow}> 
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{Number(totalAmount).toFixed(2)}</Text>
          </View>
          <View style={styles.amountRow}> 
            <Text style={styles.discountLabel}>DISCOUNT(%)</Text>
            <Text style={styles.discountValue}>-₹{Number(discount).toFixed(2)} ({discountPercent}%)</Text>
          </View>
          <View style={styles.payableRow}> 
            <Text style={styles.payableLabel}>Payable Amount</Text>
            <Text style={styles.payableValue}>₹{Number(payableAmount).toFixed(2)}</Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#65B924' }]}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Mark Paid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF2A2A' }]}>
              <Ionicons name="close" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Mark Credit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2EC4D6',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 36, // to center title with back button
  },
  container: {
    padding: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  statusPill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F4A261',
  },
  statusPillText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
  },
  value: {
    fontSize: 14,
    color: '#222',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  medName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  medSub: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  itemAmt: {
    fontWeight: 'bold',
    color: '#0A174E',
  },
  medRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  medQty: {
    color: '#888',
    fontSize: 13,
  },
  medCalc: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#222',
  },
  amountSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  amountLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  amountValue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  discountLabel: {
    color: '#888',
    fontSize: 13,
  },
  discountValue: {
    color: '#888',
    fontSize: 13,
  },
  payableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  payableLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  payableValue: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default OrderDetails; 