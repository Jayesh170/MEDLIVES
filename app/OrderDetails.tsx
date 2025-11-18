import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  success: '#65B924',
  danger: '#FF2A2A',
  warning: '#F4A261',
  border: '#eee',
  chipBg: '#e0f7fa',
};

// Font tokens to match the app (see HomeScreen)
const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
} as const;

const OrderDetails = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const {
    orderId,
    date,
    address,
    contactNumber,
    customerName,
    medications,
    totalAmount,
    discount,
    discountPercent,
    payableAmount,
    status,
    deliveryBoy,
    deliveryBoyPhone,
    paymentMethod,
    notes,
  } = params;

  const handleCall = () => {
    Linking.openURL(`tel:${contactNumber}`);
  };

  const handleCallDelivery = () => {
    if (deliveryBoyPhone) {
      Linking.openURL(`tel:${deliveryBoyPhone}`);
    }
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
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top info card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.orderTitle}>Order #{orderId}</Text>
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    String(status) === 'paid'
                      ? COLORS.success
                      : String(status) === 'credit'
                      ? COLORS.danger
                      : COLORS.warning,
                },
              ]}
            >
              <Text style={styles.statusPillText}>{String(status || 'pending').toUpperCase()}</Text>
            </View>
          </View>
          <View style={[styles.rowBetween, { marginTop: 6 }]}> 
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{(date as string) || '-'}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 8 }]}>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{customerName}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 6 }]}>
            <Text style={styles.label}>Contact</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text style={[styles.value, { color: COLORS.primary, textDecorationLine: 'underline' }]}>{contactNumber}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 6 }}>
            <Text style={styles.label}>Delivery Address</Text>
            <View style={styles.addressRow}>
              <Text style={[styles.value, { flex: 1 }]}>{address}</Text>
              <MaterialIcons name="location-pin" size={18 * scale} color="#222" />
            </View>
          </View>
        </View>

        {/* Delivery & Payment */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery & Payment</Text>
          <View style={[styles.rowBetween, { marginTop: 6 }]}> 
            <Text style={styles.label}>Delivery Boy</Text>
            <Text style={styles.value}>{(deliveryBoy as string) || '-'}</Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 6 }]}> 
            <Text style={styles.label}>Delivery Phone</Text>
            {deliveryBoyPhone ? (
              <TouchableOpacity onPress={handleCallDelivery}>
                <Text style={[styles.value, { color: COLORS.primary, textDecorationLine: 'underline' }]}>{deliveryBoyPhone}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.value}>-</Text>
            )}
          </View>
          <View style={[styles.rowBetween, { marginTop: 6 }]}> 
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{(paymentMethod as string) || '-'}</Text>
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

        {/* Notes */}
        {(notes as string) ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={[styles.value, { marginTop: 4 }]}>{notes as string}</Text>
          </View>
        ) : null}

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
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]}>
              <Ionicons name="checkmark" size={18 * scale} color="#fff" />
              <Text style={styles.actionBtnText}>Mark Paid</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.danger }]}>
              <Ionicons name="close" size={18 * scale} color="#fff" />
              <Text style={styles.actionBtnText}>Mark Credit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 18 * scale,
    color: '#fff',
    fontFamily: FONTS.semi,
    flex: 1,
    textAlign: 'center',
    marginRight: 36 * scale, // to center title with back button
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 12 * scale,
    paddingBottom: 24 * scale,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
    marginBottom: 10 * scale,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    fontSize: 15 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  statusPill: {
    paddingVertical: 4 * scale,
    paddingHorizontal: 10 * scale,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.chipBg,
  },
  statusPillText: {
    color: '#fff',
    fontSize: 11 * scale,
    fontFamily: FONTS.semi,
  },
  label: {
    fontSize: 12.5 * scale,
    color: '#222',
    fontFamily: FONTS.regular,
  },
  value: {
    fontSize: 13 * scale,
    color: '#222',
    fontFamily: FONTS.regular,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 15 * scale,
    color: '#222',
    marginBottom: 4 * scale,
    fontFamily: FONTS.semi,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  medName: {
    fontSize: 14 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  medSub: {
    color: COLORS.muted,
    fontSize: 12 * scale,
    marginTop: 2 * scale,
    fontFamily: FONTS.regular,
  },
  itemAmt: {
    color: COLORS.text,
    fontFamily: FONTS.semi,
    fontSize: 14 * scale,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2 * scale,
  },
  amountLabel: {
    fontSize: 13 * scale,
    color: '#222',
    fontFamily: FONTS.regular,
  },
  amountValue: {
    fontSize: 14 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  discountLabel: {
    color: COLORS.muted,
    fontSize: 12.5 * scale,
    fontFamily: FONTS.regular,
  },
  discountValue: {
    color: COLORS.muted,
    fontSize: 12.5 * scale,
    fontFamily: FONTS.regular,
  },
  payableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10 * scale,
    marginBottom: 14 * scale,
  },
  payableLabel: {
    fontSize: 15 * scale,
    color: '#222',
    fontFamily: FONTS.semi,
  },
  payableValue: {
    fontSize: 16 * scale,
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8 * scale,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12 * scale,
    paddingVertical: 10 * scale,
    paddingHorizontal: 16 * scale,
    gap: 8,
    flex: 1,
    marginHorizontal: 4 * scale,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: FONTS.semi,
  },
});

export default OrderDetails;