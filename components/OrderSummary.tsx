import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = require('react-native').Dimensions.get('window');
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
  lightBg: '#F8FAFC',
  cardBg: '#FFFFFF',
};

interface OrderSummaryProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
}

// Sample delivery boys data
const deliveryBoys = [
  { id: '1', name: 'Rahul Sharma', phone: '9876543210', status: 'Available', orders: 3 },
  { id: '2', name: 'Amit Kumar', phone: '9876543211', status: 'Available', orders: 1 },
  { id: '3', name: 'Suresh Patel', phone: '9876543212', status: 'Busy', orders: 5 },
  { id: '4', name: 'Vikash Singh', phone: '9876543213', status: 'Available', orders: 2 },
  { id: '5', name: 'Ravi Gupta', phone: '9876543214', status: 'Available', orders: 0 },
];

export default function OrderSummary({ values, setFieldValue }: OrderSummaryProps) {
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  
  const validMedications = values.medications.filter((med: any) => med.name && med.qty >= 1);
  
  const subtotal = validMedications.reduce((sum: number, med: any) => 
    sum + (med.qty * parseFloat(med.price || 0)), 0);
  
  const discountAmount = subtotal * (values.discountPercent || 0) / 100;
  const totalPayable = subtotal - discountAmount;

  const getCustomerAddress = () => {
    if (values.society === 'Others') {
      return values.address;
    } else {
      return `${values.flatNo} ${values.wing} ${values.society}`;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={32 * scale} color={COLORS.primary} />
        <Text style={styles.stepTitle}>Order Summary</Text>
        <Text style={styles.stepSubtitle}>Review your order details before submitting</Text>
      </View>

      {/* Order Type Selector */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="swap-horizontal" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Order Type</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10 * scale,
                marginRight: 6 * scale,
                borderRadius: 10 * scale,
                borderWidth: 1,
                borderColor: values.orderType === 'delivery' ? COLORS.primary : '#E2E8F0',
                backgroundColor: values.orderType === 'delivery' ? COLORS.chipBg : COLORS.surface,
                alignItems: 'center',
              }}
              onPress={() => setFieldValue('orderType', 'delivery')}
            >
              <Text style={{ color: COLORS.text, fontWeight: '600' }}>Delivery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 10 * scale,
                marginLeft: 6 * scale,
                borderRadius: 10 * scale,
                borderWidth: 1,
                borderColor: values.orderType === 'counter' ? COLORS.primary : '#E2E8F0',
                backgroundColor: values.orderType === 'counter' ? COLORS.chipBg : COLORS.surface,
                alignItems: 'center',
              }}
              onPress={() => setFieldValue('orderType', 'counter')}
            >
              <Text style={{ color: COLORS.text, fontWeight: '600' }}>On Counter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Customer Details Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Customer Details</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailValue}>{values.customerName || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{values.contactNumber || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{getCustomerAddress() || 'Not specified'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order Date:</Text>
            <Text style={styles.detailValue}>
              {values.orderDate ? new Date(values.orderDate).toLocaleDateString() : 'Not specified'}
            </Text>
          </View>
        </View>
      </View>

      {/* Medications Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="medical" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Medications ({validMedications.length})</Text>
        </View>
        <View style={styles.cardContent}>
          {validMedications.length === 0 ? (
            <View style={styles.emptyMedications}>
              <Text style={styles.emptyText}>No medications added</Text>
            </View>
          ) : (
            validMedications.map((med: any, index: number) => (
              <View key={index} style={styles.medicationItem}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetails}>
                    Qty: {med.qty} × ₹{parseFloat(med.price || 0).toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.medicationTotal}>
                  ₹{(med.qty * parseFloat(med.price || 0)).toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Billing Summary Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="calculator" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Billing Summary</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.discountRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <View style={styles.discountInput}>
              <TextInput
                style={styles.discountPercentInput}
                placeholder="0"
                keyboardType="numeric"
                value={values.discountPercent?.toString() || '0'}
                onChangeText={text => setFieldValue('discountPercent', parseFloat(text) || 0)}
                placeholderTextColor="#BFC3C9"
              />
              <Text style={styles.percentSymbol}>%</Text>
            </View>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount Amount</Text>
            <Text style={styles.summaryValue}>-₹{discountAmount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{totalPayable.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Payment Status Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="card" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Payment Information</Text>
        </View>
        <View style={styles.cardContent}>
          {values.orderType === 'counter' ? (
            <View>
              <Text style={[styles.summaryLabel, { marginBottom: 8 * scale }]}>Payment Status</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 10 * scale,
                    marginRight: 6 * scale,
                    borderRadius: 10 * scale,
                    borderWidth: 1,
                    borderColor: values.paymentStatus === 'paid' ? COLORS.primary : '#E2E8F0',
                    backgroundColor: values.paymentStatus === 'paid' ? COLORS.chipBg : COLORS.surface,
                    alignItems: 'center',
                  }}
                  onPress={() => setFieldValue('paymentStatus', 'paid')}
                >
                  <Text style={{ color: COLORS.text, fontWeight: '600' }}>PAID</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 10 * scale,
                    marginLeft: 6 * scale,
                    borderRadius: 10 * scale,
                    borderWidth: 1,
                    borderColor: values.paymentStatus === 'credit' ? COLORS.primary : '#E2E8F0',
                    backgroundColor: values.paymentStatus === 'credit' ? COLORS.chipBg : COLORS.surface,
                    alignItems: 'center',
                  }}
                  onPress={() => setFieldValue('paymentStatus', 'credit')}
                >
                  <Text style={{ color: COLORS.text, fontWeight: '600' }}>CREDIT</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.paymentInfo}>
              <View style={styles.paymentStatus}>
                <View style={styles.statusIndicator} />
                <Text style={styles.statusText}>Payment Pending</Text>
              </View>
              <Text style={styles.paymentNote}>
                Payment will be collected upon delivery
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Delivery Assignment - only for Delivery orders */}
      {values.orderType === 'delivery' && (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="bicycle" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Delivery Assignment</Text>
          <Text style={styles.requiredText}>*</Text>
        </View>
        <View style={styles.cardContent}>
          <TouchableOpacity
            style={[
              styles.deliverySelector,
              !values.deliveryBoy && styles.deliverySelectorEmpty
            ]}
            onPress={() => setShowDeliveryModal(true)}
          >
            {values.deliveryBoy ? (
              <View style={styles.selectedDeliveryBoy}>
                <View style={styles.deliveryBoyInfo}>
                  <Text style={styles.deliveryBoyName}>{values.deliveryBoy.name}</Text>
                  <Text style={styles.deliveryBoyPhone}>{values.deliveryBoy.phone}</Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: values.deliveryBoy.status === 'Available' ? COLORS.success : COLORS.warning }
                ]}>
                  <Text style={styles.statusText}>{values.deliveryBoy.status}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyDeliverySelector}>
                <Ionicons name="person-add" size={24 * scale} color={COLORS.muted} />
                <Text style={styles.emptyDeliveryText}>Select Delivery Boy</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20 * scale} color={COLORS.muted} />
          </TouchableOpacity>
        </View>
      </View>
      )}

      {/* Order Notes */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text" size={20 * scale} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Order Notes (Optional)</Text>
        </View>
        <View style={styles.cardContent}>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any special instructions or notes for this order..."
            value={values.notes || ''}
            onChangeText={text => setFieldValue('notes', text)}
            placeholderTextColor="#BFC3C9"
            multiline
            numberOfLines={3}
          />
        </View>
      </View>

      {/* Delivery Boy Selection Modal */}
      <Modal
        visible={showDeliveryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDeliveryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Delivery Boy</Text>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowDeliveryModal(false)}
            >
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={deliveryBoys}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.deliveryBoyItem,
                  item.status === 'Busy' && styles.deliveryBoyItemDisabled
                ]}
                onPress={() => {
                  if (item.status === 'Available') {
                    setFieldValue('deliveryBoy', item);
                    setShowDeliveryModal(false);
                  }
                }}
                disabled={item.status === 'Busy'}
              >
                <View style={styles.deliveryBoyDetails}>
                  <Text style={[
                    styles.deliveryBoyItemName,
                    item.status === 'Busy' && styles.disabledText
                  ]}>
                    {item.name}
                  </Text>
                  <Text style={[
                    styles.deliveryBoyItemPhone,
                    item.status === 'Busy' && styles.disabledText
                  ]}>
                    {item.phone}
                  </Text>
                  <Text style={[
                    styles.deliveryBoyOrders,
                    item.status === 'Busy' && styles.disabledText
                  ]}>
                    Current Orders: {item.orders}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  { 
                    backgroundColor: item.status === 'Available' ? COLORS.success : COLORS.warning,
                    opacity: item.status === 'Busy' ? 0.6 : 1
                  }
                ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16 * scale,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20 * scale,
    marginBottom: 16 * scale,
  },
  stepTitle: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
    marginTop: 8 * scale,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginTop: 4 * scale,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16 * scale,
    marginBottom: 16 * scale,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  cardTitle: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
    marginLeft: 8 * scale,
  },
  cardContent: {
    padding: 20 * scale,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12 * scale,
  },
  detailLabel: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    flex: 1,
  },
  detailValue: {
    fontSize: 14 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
    flex: 2,
    textAlign: 'right',
  },
  emptyMedications: {
    alignItems: 'center',
    paddingVertical: 20 * scale,
  },
  emptyText: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 15 * scale,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
    marginBottom: 4 * scale,
  },
  medicationDetails: {
    fontSize: 13 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
  },
  medicationTotal: {
    fontSize: 15 * scale,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'ManropeBold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  summaryLabel: {
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeRegular',
  },
  summaryValue: {
    fontSize: 15 * scale,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  discountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightBg,
    borderRadius: 8 * scale,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
  },
  discountPercentInput: {
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
    minWidth: 40 * scale,
  },
  percentSymbol: {
    fontSize: 15 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginLeft: 4 * scale,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16 * scale,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8 * scale,
    backgroundColor: COLORS.lightBg,
    paddingHorizontal: 16 * scale,
    borderRadius: 12 * scale,
    marginTop: 8 * scale,
  },
  totalLabel: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
  },
  totalValue: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'ManropeBold',
  },
  paymentInfo: {
    alignItems: 'center',
  },
  paymentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  statusIndicator: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale,
    backgroundColor: COLORS.warning,
    marginRight: 8 * scale,
  },
  statusText: {
    fontSize: 15 * scale,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
  },
  paymentNote: {
    fontSize: 13 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  notesInput: {
    borderRadius: 12 * scale,
    backgroundColor: COLORS.lightBg,
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeRegular',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    textAlignVertical: 'top',
    minHeight: 80 * scale,
  },
  // Delivery Assignment Styles
  requiredText: {
    color: COLORS.danger,
    fontSize: 16 * scale,
    fontWeight: 'bold',
    marginLeft: 4 * scale,
  },
  deliverySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16 * scale,
    borderRadius: 12 * scale,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: COLORS.surface,
  },
  deliverySelectorEmpty: {
    borderColor: COLORS.danger,
    borderStyle: 'dashed',
  },
  selectedDeliveryBoy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  deliveryBoyInfo: {
    flex: 1,
  },
  deliveryBoyName: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
  },
  deliveryBoyPhone: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginTop: 2 * scale,
  },
  statusBadge: {
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
    marginLeft: 12 * scale,
  },
  emptyDeliverySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emptyDeliveryText: {
    fontSize: 16 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginLeft: 12 * scale,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
  },
  modalCloseBtn: {
    padding: 8 * scale,
  },
  deliveryBoyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deliveryBoyItemDisabled: {
    opacity: 0.6,
  },
  deliveryBoyDetails: {
    flex: 1,
  },
  deliveryBoyItemName: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'ManropeSemiBold',
  },
  deliveryBoyItemPhone: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginTop: 2 * scale,
  },
  deliveryBoyOrders: {
    fontSize: 13 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginTop: 4 * scale,
  },
  disabledText: {
    opacity: 0.6,
  },
});
