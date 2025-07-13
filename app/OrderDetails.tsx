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
        <Text style={styles.orderId}>Order #{orderId}</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Delivery Address</Text>
            <Text style={styles.value}>{address}</Text>
          </View>
          <MaterialIcons name="location-pin" size={22} color="#222" style={{ marginTop: 8 }} />
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Contact Number</Text>
            <Text style={[styles.value, { color: '#2EC4D6', textDecorationLine: 'underline' }]}>{contactNumber}</Text>
          </View>
          <TouchableOpacity onPress={handleCall}>
            <Ionicons name="call" size={22} color="#222" style={{ marginTop: 8 }} />
          </TouchableOpacity>
        </View>
        <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={styles.label}>Customer Name</Text>
          <Text style={styles.value}>{customerName}</Text>
        </View>
        <Text style={{ fontWeight: 'bold', fontSize: 16, borderWidth: 1, borderColor: '#222', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 10, marginBottom: 4 }}>List Of Items</Text>
        {Array.isArray(meds) && meds.map((med, idx) => {
          const qty = Number(med.qty ?? 0);
          const price = Number(med.price ?? 0);
          return (
            <View key={idx} style={{ marginTop: 12 }}>
              <Text style={styles.medName}>{med.name}</Text>
              <View style={styles.medRow}>
                <Text style={styles.medQty}>Quantity: {qty}</Text>
                <Text style={styles.medCalc}>{qty} x {price} = <Text style={{ fontWeight: 'bold' }}>{qty * price}</Text></Text>
              </View>
            </View>
          );
        })}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amountValue}>₹{Number(totalAmount).toFixed(2)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.discountLabel}>DISCOUNT(%)</Text>
            <Text style={styles.discountValue}>-₹{Number(discount).toFixed(2)} ({discountPercent}%)</Text>
          </View>
        </View>
        <View style={styles.payableRow}>
          <Text style={styles.payableLabel}>Payable Amount</Text>
          <Text style={styles.payableValue}>₹{Number(payableAmount).toFixed(2)}</Text>
        </View>
        <View style={styles.statusRow}>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#65B924' }]}>
            <Text style={styles.statusBtnText}>PAID</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statusBtn, { backgroundColor: '#FF2A2A' }]}>
            <Text style={styles.statusBtnText}>CREDIT</Text>
          </TouchableOpacity>
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
    padding: 20,
    flex: 1,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
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
  medName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 32,
    marginHorizontal: 12,
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
});

export default OrderDetails; 