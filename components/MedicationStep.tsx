import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { Swipeable } from 'react-native-gesture-handler';
import * as Yup from 'yup';

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

interface MedicationStepProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  errors: any;
  touched: any;
}

export default function MedicationStep({
  values,
  setFieldValue,
  errors,
  touched,
}: MedicationStepProps) {
  const [showMedModal, setShowMedModal] = useState(false);
  const [editMedIdx, setEditMedIdx] = useState<number | null>(null);
  const [medInitial, setMedInitial] = useState({ name: '', qty: 1, price: 0 });
  const [addMethod, setAddMethod] = useState<'manual' | 'barcode'>('manual');
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  const handleAddMedication = (method: 'manual' | 'barcode') => {
    setAddMethod(method);
    setEditMedIdx(null);
    setMedInitial({ name: '', qty: 1, price: 0 });
    
    if (method === 'barcode') {
      setShowBarcodeScanner(true);
    } else {
      setShowMedModal(true);
    }
  };

  const handleEditMedication = (index: number) => {
    setEditMedIdx(index);
    setMedInitial(values.medications[index]);
    setAddMethod('manual');
    setShowMedModal(true);
  };

  const handleDeleteMedication = (index: number) => {
    const updatedMedications = values.medications.filter((_: any, i: number) => i !== index);
    setFieldValue('medications', updatedMedications);
  };

  const handleBarcodeScanned = (data: string) => {
    setShowBarcodeScanner(false);
    
    const mockMedication = {
      name: `Medicine-${data.slice(-4)}`,
      qty: 1,
      price: Math.floor(Math.random() * 500) + 50,
    };
    
    setMedInitial(mockMedication);
    setShowMedModal(true);
  };

  const renderMedicationCard = (med: any, index: number) => (
    <Swipeable
      key={`med-${index}-${med.name}-${med.qty}`}
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => handleDeleteMedication(index)}
        >
          <Ionicons name="trash" size={24 * scale} color="#fff" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.medicationCard}
        onPress={() => handleEditMedication(index)}
        activeOpacity={0.7}
      >
        <View style={styles.medicationHeader}>
          <View style={styles.medicationIcon}>
            <Ionicons name="medical" size={20 * scale} color={COLORS.primary} />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationName} numberOfLines={1}>
              {med.name}
            </Text>
            <View style={styles.medicationDetails}>
              <Text style={styles.medicationQty}>Qty: {med.qty}</Text>
              <Text style={styles.medicationPrice}>₹{parseFloat(med.price.toString()).toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.medicationTotal}>
            <Text style={styles.totalAmount}>
              ₹{(med.qty * parseFloat(med.price.toString())).toFixed(2)}
            </Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.muted} />
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="medical-outline" size={32 * scale} color={COLORS.primary} />
        <Text style={styles.stepTitle}>Add Medications</Text>
        <Text style={styles.stepSubtitle}>Add medicines manually or scan barcode</Text>
      </View>

      {/* Add Medication Methods */}
      <View style={styles.addMethodsContainer}>
        <TouchableOpacity
          style={styles.addMethodCard}
          onPress={() => handleAddMedication('manual')}
          activeOpacity={0.7}
        >
          <View style={styles.methodIcon}>
            <Ionicons name="create-outline" size={28 * scale} color={COLORS.primary} />
          </View>
          <Text style={styles.methodTitle}>Manual Entry</Text>
          <Text style={styles.methodSubtitle}>Enter medicine details manually</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addMethodCard}
          onPress={() => handleAddMedication('barcode')}
          activeOpacity={0.7}
        >
          <View style={styles.methodIcon}>
            <Ionicons name="barcode-outline" size={28 * scale} color={COLORS.primary} />
          </View>
          <Text style={styles.methodTitle}>Scan Barcode</Text>
          <Text style={styles.methodSubtitle}>Scan medicine barcode</Text>
        </TouchableOpacity>
      </View>

      {/* Medications List */}
      <View style={styles.medicationsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Added Medications</Text>
          <Text style={styles.medicationCount}>
            {values.medications.filter((med: any) => med.name && med.qty >= 1).length} items
          </Text>
        </View>

        {values.medications.filter((med: any) => med.name && med.qty >= 1).length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={48 * scale} color={COLORS.muted} />
            <Text style={styles.emptyStateText}>No medications added yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add medications using manual entry or barcode scanning
            </Text>
          </View>
        ) : (
          <View style={styles.medicationsList}>
            {values.medications
              .filter((med: any) => med.name && med.qty >= 1)
              .map((med: any, index: number) => renderMedicationCard(med, index))}
          </View>
        )}
      </View>

      {/* Medication Modal */}
      <Modal
        visible={showMedModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editMedIdx !== null ? 'Edit Medication' : 'Add Medication'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowMedModal(false)}
              >
                <Ionicons name="close" size={24 * scale} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            <Formik
              initialValues={medInitial}
              validationSchema={Yup.object().shape({
                name: Yup.string().required('Medicine name is required'),
                qty: Yup.number().required('Quantity is required').min(1, 'Minimum 1'),
                price: Yup.number().required('Price is required').min(0, 'Minimum 0'),
              })}
              onSubmit={medValues => {
                if (editMedIdx !== null) {
                  const updatedMedications = [...values.medications];
                  updatedMedications[editMedIdx] = medValues;
                  setFieldValue('medications', updatedMedications);
                } else {
                  setFieldValue('medications', [...values.medications, medValues]);
                }
                setShowMedModal(false);
              }}
              enableReinitialize
            >
              {({ values: medValues, handleChange, handleBlur, handleSubmit, errors: medErrors, touched: medTouched }) => (
                <View style={styles.modalForm}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Medicine Name *</Text>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="Enter medicine name"
                      value={medValues.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      placeholderTextColor="#BFC3C9"
                    />
                    {medTouched.name && medErrors.name && (
                      <Text style={styles.errorText}>{medErrors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 * scale }]}>
                      <Text style={styles.inputLabel}>Quantity *</Text>
                      <TextInput
                        style={styles.inputBox}
                        placeholder="Qty"
                        keyboardType="numeric"
                        value={medValues.qty.toString()}
                        onChangeText={text => handleChange('qty')(text.replace(/[^0-9]/g, ''))}
                        onBlur={handleBlur('qty')}
                        placeholderTextColor="#BFC3C9"
                      />
                      {medTouched.qty && medErrors.qty && (
                        <Text style={styles.errorText}>{medErrors.qty}</Text>
                      )}
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 * scale }]}>
                      <Text style={styles.inputLabel}>Price (₹) *</Text>
                      <TextInput
                        style={styles.inputBox}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        value={medValues.price.toString()}
                        onChangeText={text => handleChange('price')(text.replace(/[^0-9.]/g, ''))}
                        onBlur={handleBlur('price')}
                        placeholderTextColor="#BFC3C9"
                      />
                      {medTouched.price && medErrors.price && (
                        <Text style={styles.errorText}>{medErrors.price}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => setShowMedModal(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={() => handleSubmit()}
                    >
                      <Text style={styles.saveButtonText}>
                        {editMedIdx !== null ? 'Update' : 'Add'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      {/* Barcode Scanner Modal */}
      <Modal
        visible={showBarcodeScanner}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowBarcodeScanner(false)}
      >
        <View style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              style={styles.scannerCloseButton}
              onPress={() => setShowBarcodeScanner(false)}
            >
              <Ionicons name="close" size={24 * scale} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan Barcode</Text>
          </View>
          
          <View style={styles.scannerContent}>
            <View style={styles.scannerFrame}>
              <Ionicons name="scan" size={100 * scale} color={COLORS.primary} />
              <Text style={styles.scannerText}>Position barcode within the frame</Text>
            </View>
            
            <TouchableOpacity
              style={styles.mockScanButton}
              onPress={() => handleBarcodeScanned('1234567890123')}
            >
              <Text style={styles.mockScanButtonText}>Simulate Scan (Demo)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {errors.medications && touched.medications && (
        <Text style={styles.errorText}>{errors.medications}</Text>
      )}
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
    marginBottom: 10 * scale,
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
  addMethodsContainer: {
    flexDirection: 'row',
    gap: 12 * scale,
    marginBottom: 24 * scale,
  },
  addMethodCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16 * scale,
    padding: 20 * scale,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  methodIcon: {
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    backgroundColor: COLORS.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * scale,
  },
  methodTitle: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
    marginBottom: 4 * scale,
    textAlign: 'center',
  },
  methodSubtitle: {
    fontSize: 12 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
  },
  medicationsSection: {
    marginBottom: 20 * scale,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  sectionTitle: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
  },
  medicationCount: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40 * scale,
    paddingHorizontal: 20 * scale,
  },
  emptyStateText: {
    fontSize: 16 * scale,
    fontWeight: '600',
    color: COLORS.muted,
    fontFamily: 'ManropeSemiBold',
    marginTop: 12 * scale,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
    marginTop: 4 * scale,
    textAlign: 'center',
  },
  medicationsList: {
    gap: 12 * scale,
  },
  medicationCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12 * scale,
    padding: 16 * scale,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    backgroundColor: COLORS.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
    marginBottom: 4 * scale,
  },
  medicationDetails: {
    flexDirection: 'row',
    gap: 12 * scale,
  },
  medicationQty: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
  },
  medicationPrice: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    fontFamily: 'ManropeRegular',
  },
  medicationTotal: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'ManropeBold',
    marginBottom: 4 * scale,
  },
  deleteAction: {
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80 * scale,
    borderRadius: 12 * scale,
    marginVertical: 2 * scale,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4 * scale,
    fontSize: 12 * scale,
    fontFamily: 'ManropeBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20 * scale,
    width: '90%',
    maxWidth: 400 * scale,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'ManropeBold',
  },
  closeButton: {
    padding: 4 * scale,
  },
  modalForm: {
    padding: 20 * scale,
  },
  inputGroup: {
    marginBottom: 16 * scale,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputLabel: {
    fontSize: 14 * scale,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8 * scale,
    fontFamily: 'ManropeSemiBold',
  },
  inputBox: {
    borderRadius: 12 * scale,
    backgroundColor: COLORS.lightBg,
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeRegular',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12 * scale,
    marginTop: 4 * scale,
    fontFamily: 'ManropeRegular',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12 * scale,
    marginTop: 20 * scale,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.lightBg,
    borderRadius: 12 * scale,
    paddingVertical: 14 * scale,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 16 * scale,
    fontWeight: '600',
    fontFamily: 'ManropeSemiBold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12 * scale,
    paddingVertical: 14 * scale,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: 'bold',
    fontFamily: 'ManropeBold',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50 * scale,
    paddingHorizontal: 20 * scale,
    paddingBottom: 20 * scale,
  },
  scannerCloseButton: {
    padding: 8 * scale,
  },
  scannerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    fontFamily: 'ManropeBold',
    textAlign: 'center',
    marginRight: 40 * scale,
  },
  scannerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40 * scale,
  },
  scannerFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40 * scale,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20 * scale,
    backgroundColor: 'rgba(46, 196, 214, 0.1)',
  },
  scannerText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontFamily: 'ManropeRegular',
    textAlign: 'center',
    marginTop: 20 * scale,
  },
  mockScanButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12 * scale,
    paddingVertical: 16 * scale,
    paddingHorizontal: 32 * scale,
    marginTop: 40 * scale,
  },
  mockScanButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: 'bold',
    fontFamily: 'ManropeBold',
  },
});
