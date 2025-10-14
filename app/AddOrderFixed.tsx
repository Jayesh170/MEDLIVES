import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';

// Import our new components
import Stepper from '../components/Stepper';
import CustomerInfoStep from '../components/CustomerInfoStep';
import MedicationStep from '../components/MedicationStep';
import OrderSummary from '../components/OrderSummary';

const { width } = require('react-native').Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  success: '#65B924',
  lightBg: '#F8FAFC',
};

const orderValidationSchema = Yup.object().shape({
  customerName: Yup.string().required('Customer name is required'),
  society: Yup.string().required('Society is required'),
  wing: Yup.string().when('society', {
    is: (val: string) => val && val !== 'Others',
    then: schema => schema.required('Wing is required'),
    otherwise: schema => schema.notRequired(),
  }),
  flatNo: Yup.string().when('society', {
    is: (val: string) => val && val !== 'Others',
    then: schema => schema.required('Flat No is required'),
    otherwise: schema => schema.notRequired(),
  }),
  address: Yup.string().when('society', {
    is: (val: string) => val === 'Others',
    then: schema => schema.required('Address is required'),
    otherwise: schema => schema.notRequired(),
  }),
  contactNumber: Yup.string()
    .required('Contact number is required')
    .matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
  orderDate: Yup.date().required('Order date is required'),
  medications: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Medicine name'),
      qty: Yup.number().required('Qty').min(1),
      price: Yup.number().required('MRP').min(0),
    })
  ).min(1, 'Add at least one medication'),
  discountPercent: Yup.number().min(0).max(100),
});

type AddOrderProps = {
  visible: boolean;
  onClose: () => void;
  onAddOrder: (values: any) => void;
  existingOrdersCount: number;
};

const steps = ['Customer Info', 'Medications', 'Order Summary'];

export default function AddOrder({ visible, onClose, onAddOrder, existingOrdersCount }: AddOrderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDeliveryAssignment, setShowDeliveryAssignment] = useState(false);

  const transformOrderData = (formValues: any) => {
    const totalAmount = formValues.medications.reduce((sum: number, med: any) => 
      sum + (med.qty * parseFloat(med.price || 0)), 0);
    
    const discount = totalAmount * (formValues.discountPercent || 0) / 100;
    const payableAmount = totalAmount - discount;
    
    const address = formValues.society === 'Others' 
      ? formValues.address 
      : `${formValues.flatNo} ${formValues.wing} ${formValues.society}`;
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: format(formValues.orderDate, 'dd/MM/yy'),
      orderId: (existingOrdersCount + 1).toString(),
      address,
      contactNumber: formValues.contactNumber,
      customerName: formValues.customerName.toUpperCase(),
      medications: formValues.medications.map((med: any) => ({
        ...med,
        price: parseFloat(med.price || 0),
      })),
      totalAmount,
      discount,
      discountPercent: formValues.discountPercent || 0,
      payableAmount,
      status: 'pending',
      deliveryBoy: formValues.deliveryBoy?.name || '',
      deliveryBoyPhone: formValues.deliveryBoy?.phone || '',
      paymentMethod: '',
      notes: formValues.notes || '',
    };
  };

  const handleNext = (values: any, errors: any) => {
    console.log('HandleNext called - Current step:', currentStep);
    console.log('Form values:', values);
    console.log('Form errors:', errors);
    
    // More lenient validation - only check if required fields have values
    if (currentStep === 0) {
      // Customer Info validation - check if fields have values, not just errors
      const requiredFields = ['customerName', 'society', 'contactNumber'];
      const missingFields = requiredFields.filter(field => !values[field] || values[field].trim() === '');
      
      if (missingFields.length > 0) {
        Alert.alert('Required Fields', `Please fill in: ${missingFields.join(', ')}`);
        return;
      }
      
      // Check society-specific requirements
      if (values.society !== 'Others') {
        if (!values.wing || !values.flatNo) {
          Alert.alert('Required Fields', 'Please select wing and flat number');
          return;
        }
      } else {
        if (!values.address || values.address.trim() === '') {
          Alert.alert('Required Fields', 'Please enter address');
          return;
        }
      }
      
      if (!values.orderDate) {
        Alert.alert('Required Fields', 'Please select order date');
        return;
      }
    } else if (currentStep === 1) {
      // Medications validation
      const validMedications = values.medications.filter(
        (med: any) => med.name && med.name.trim() !== '' && med.qty > 0 && med.price >= 0
      );
      
      if (validMedications.length === 0) {
        Alert.alert('Error', 'Please add at least one medication');
        return;
      }
    } else if (currentStep === 2) {
      // Order Summary validation - check delivery boy assignment
      if (!values.deliveryBoy) {
        Alert.alert('Required Field', 'Please assign a delivery boy before creating the order');
        return;
      }
    }

    // Navigate to next step
    if (currentStep < steps.length - 1) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (values: any, helpers: { resetForm: () => void }) => {
    try {
      const orderData = transformOrderData(values);
      // Immediately submit to parent (backend integration happens there)
      onAddOrder(orderData);
      helpers.resetForm();
      setCurrentStep(0);
      setShowDeliveryAssignment(false);
      onClose();
      Alert.alert(
        'Success',
        'Order created successfully! It has been added to the orders list.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      setShowDeliveryAssignment(false);
      Alert.alert('Error', 'Failed to create order. Please try again.');
      console.error('Order creation error:', error);
    }
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Order</Text>
        </View>

        {/* Stepper */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
        />

        <Formik
          initialValues={{
            customerName: '',
            society: '',
            wing: '',
            flatNo: '',
            address: '',
            contactNumber: '',
            orderDate: new Date(),
            medications: [{ name: '', qty: 1, price: 0 }],
            discountPercent: 0,
            notes: '',
            deliveryBoy: null,
          }}
          validationSchema={orderValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, setFieldValue, handleSubmit, errors, touched, isSubmitting }) => {
            // Create wrapper functions to match component interfaces
            const wrappedHandleChange = (field: string) => (value: string) => {
              setFieldValue(field, value);
            };
            
            const wrappedHandleBlur = (field: string) => () => {
              handleBlur(field);
            };
            
            return (
            <>
              {/* Step Content */}
              {currentStep === 0 && (
                <CustomerInfoStep
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={wrappedHandleChange}
                  handleBlur={wrappedHandleBlur}
                  setFieldValue={setFieldValue}
                />
              )}

              {currentStep === 1 && (
                <MedicationStep
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                />
              )}

              {currentStep === 2 && (
                <OrderSummary
                  values={values}
                  setFieldValue={setFieldValue}
                />
              )}

              {/* Navigation Buttons */}
              <View style={styles.navigationContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={styles.previousButton}
                    onPress={handlePrevious}
                  >
                    <Ionicons name="chevron-back" size={20 * scale} color={COLORS.primary} />
                    <Text style={styles.previousButtonText}>Previous</Text>
                  </TouchableOpacity>
                )}
                
                {currentStep < steps.length - 1 ? (
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => handleNext(values, errors)}
                  >
                    <Text style={styles.nextButtonText}>Next</Text>
                    <Ionicons name="chevron-forward" size={20 * scale} color={COLORS.primary} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>
                      {isSubmitting ? 'Creating...' : 'Create Order'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Delivery Assignment Modal */}
              {showDeliveryAssignment && (
                <View style={styles.deliveryModal}>
                  <View style={styles.deliveryContent}>
                    <Text style={styles.deliveryTitle}>Assigning Delivery Boy...</Text>
                    <Text style={styles.deliverySubtitle}>Please wait while we process your order</Text>
                  </View>
                </View>
              )}
            </>
            );
          }}
        </Formik>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 16 * scale,
    paddingBottom: 16 * scale,
    paddingHorizontal: 16 * scale,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8 * scale,
    marginRight: 8 * scale,
  },
  headerTitle: {
    fontSize: 20 * scale,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'WorkSans',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12 * scale,
    paddingHorizontal: 20 * scale,
    borderRadius: 25 * scale,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  previousButtonText: {
    color: COLORS.primary,
    fontSize: 16 * scale,
    fontWeight: '600',
    marginLeft: 4 * scale,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12 * scale,
    paddingHorizontal: 24 * scale,
    borderRadius: 25 * scale,
    backgroundColor: COLORS.primary,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: '600',
    marginRight: 4 * scale,
  },
  submitButton: {
    paddingVertical: 12 * scale,
    paddingHorizontal: 24 * scale,
    borderRadius: 25 * scale,
    backgroundColor: COLORS.success,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: '600',
  },
  deliveryModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryContent: {
    backgroundColor: '#fff',
    padding: 30 * scale,
    borderRadius: 15 * scale,
    alignItems: 'center',
  },
  deliveryTitle: {
    fontSize: 18 * scale,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  deliverySubtitle: {
    fontSize: 14 * scale,
    color: COLORS.muted,
    textAlign: 'center',
  },
});
