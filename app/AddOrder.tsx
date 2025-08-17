import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { FieldArray, Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';

const { width } = require('react-native').Dimensions.get('window');
const scale = width / 320;

const customers = [
  { name: 'JAYESH DANGI', address: 'F-101 SHANTINAGAR', contactNumber: '8888133849' },
  { name: 'RAVI PATEL', address: 'A-202 GREEN PARK', contactNumber: '9876543210' },
  { name: 'PRIYA SHARMA', address: 'B-303 SUNSHINE', contactNumber: '9123456780' },
];

// Societies data structure
const societies = [
  {
    name: 'Shantinagar',
    wings: [
      { name: 'A', flats: ['101', '102', '103', '104'] },
      { name: 'B', flats: ['201', '202', '203', '204'] },
      { name: 'C', flats: ['301', '302', '303', '304'] },
    ],
  },
  {
    name: 'Green Park',
    wings: [
      { name: 'A', flats: ['101', '102', '103'] },
      { name: 'B', flats: ['201', '202', '203'] },
    ],
  },
  {
    name: 'Sunshine',
    wings: [
      { name: 'A', flats: ['101', '102'] },
      { name: 'B', flats: ['201', '202'] },
    ],
  },
];

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
  contactNumber: Yup.string().required('Contact number is required').matches(/^[0-9]{10}$/, 'Contact number must be 10 digits'),
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

type AddOrderRouteParams = {
  onAddOrder?: (values: any, helpers: { resetForm: () => void }) => void;
};

type AddOrderProps = {
  visible: boolean;
  onClose: () => void;
  onAddOrder: (values: any) => void;
  existingOrdersCount: number;
};

export default function AddOrder({ visible, onClose, onAddOrder, existingOrdersCount }: AddOrderProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [showMedModal, setShowMedModal] = useState(false);
  const [editMedIdx, setEditMedIdx] = useState<number | null>(null);
  const [medInitial, setMedInitial] = useState({ name: '', qty: 1, price: 0 });
  const [societySearch, setSocietySearch] = useState('');
  const [wingSearch, setWingSearch] = useState('');
  const [flatSearch, setFlatSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const transformOrderData = (formValues: any) => {
    const totalAmount = formValues.medications.reduce((sum: number, med: any) => 
      sum + (med.qty * parseFloat(med.price)), 0);
    
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
        price: parseFloat(med.price),
      })),
      totalAmount,
      discount,
      discountPercent: formValues.discountPercent || 0,
      payableAmount,
      status: 'pending'
    };
  };

  const resetForm = () => {
    setCustomerSearch('');
    setSocietySearch('');
    setWingSearch('');
    setFlatSearch('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose}>
            <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Order</Text>
        </View>
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
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
            }}
            validationSchema={orderValidationSchema}
            onSubmit={(values, helpers) => {
              // Filter out empty medications
              const validMedications = values.medications.filter(
                med => med.name && med.name.trim() !== '' && med.qty > 0 && med.price >= 0
              );
              
              if (validMedications.length === 0) {
                Alert.alert('Error', 'Please add at least one medication');
                return;
              }
              
              const submitValues = {
                ...values,
                medications: validMedications
              };
              
              try {
                const orderData = transformOrderData(submitValues);
                onAddOrder(orderData);
                helpers.resetForm();
                resetForm();
                onClose();
              } catch (error) {
                Alert.alert('Error', 'Failed to create order. Please try again.');
                console.error('Order creation error:', error);
              }
            }}
          >
            {({ values, handleChange, handleBlur, setFieldValue, handleSubmit, errors, touched }) => {
              // Find selected society and wing objects
              const selectedSociety = societies.find(s => s.name === values.society);
              const selectedWing = selectedSociety?.wings.find(w => w.name === values.wing);

              // Autocomplete for society
              const societyOptions = [
                ...societies
                  .filter(s =>
                    societySearch.length === 0 ||
                    s.name.toLowerCase().includes(societySearch.toLowerCase())
                  )
                  .map(s => s.name),
                'Others',
              ];

              // Autocomplete for wing
              const wingOptions = selectedSociety && values.society !== 'Others'
                ? selectedSociety.wings
                    .filter(w =>
                      wingSearch.length === 0 ||
                      w.name.toLowerCase().includes(wingSearch.toLowerCase())
                    )
                    .map(w => w.name)
                : [];

              // Autocomplete for flatNo
              const flatOptions = selectedWing && values.society !== 'Others'
                ? selectedWing.flats.filter(f =>
                    flatSearch.length === 0 ||
                    f.toLowerCase().includes(flatSearch.toLowerCase())
                  )
                : [];

              // Autofill on customer selection
              const handleCustomerSelect = (c: any) => {
                setFieldValue('customerName', c.name);
                setFieldValue('contactNumber', c.contactNumber);
                setCustomerSearch('');
                // Try to parse address for society/wing/flat
                const addr = c.address || '';
                let foundSociety = societies.find(s => addr.toLowerCase().includes(s.name.toLowerCase()));
                if (foundSociety) {
                  setFieldValue('society', foundSociety.name);
                  // Try to find wing and flat
                  let foundWing = foundSociety.wings.find(w => addr.toUpperCase().includes(w.name.toUpperCase()));
                  if (foundWing) {
                    setFieldValue('wing', foundWing.name);
                    let foundFlat = foundWing.flats.find(f => addr.includes(f));
                    if (foundFlat) setFieldValue('flatNo', foundFlat);
                  }
                  setFieldValue('address', '');
                } else {
                  setFieldValue('society', 'Others');
                  setFieldValue('wing', '');
                  setFieldValue('flatNo', '');
                  setFieldValue('address', addr);
                }
              };

              return (
                <>
                  {/* Customer Name Dropdown with Search */}
                  <Text style={styles.inputLabel}>Customer Name</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="Enter customer name"
                      value={values.customerName}
                      onChangeText={text => {
                        setFieldValue('customerName', text);
                        setCustomerSearch(text);
                        const found = customers.find(c => c.name.toLowerCase() === text.toLowerCase());
                        if (found) {
                          handleCustomerSelect(found);
                        }
                      }}
                      onBlur={handleBlur('customerName')}
                      placeholderTextColor="#BFC3C9"
                    />
                    <Ionicons name="chevron-down" size={20 * scale} color="#BFC3C9" style={styles.dropdownIcon} />
                    {customerSearch.length > 0 && customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).length > 0 && (
                      <View style={styles.dropdownList}>
                        {customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase())).map((c, idx) => (
                          <TouchableOpacity key={`customer-${c.name}-${idx}`} onPress={() => handleCustomerSelect(c)}>
                            <Text style={styles.dropdownItem}>{c.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  {touched.customerName && errors.customerName && <Text style={styles.errorText}>{errors.customerName}</Text>}

                  {/* Society Dropdown with Autocomplete */}
                  <Text style={styles.inputLabel}>Society</Text>
                  <View style={{ position: 'relative' }}>
                    <TextInput
                      style={styles.inputBox}
                      placeholder="Select society"
                      value={values.society}
                      onChangeText={text => {
                        setFieldValue('society', text);
                        setSocietySearch(text);
                        // Reset dependent fields
                        setFieldValue('wing', '');
                        setFieldValue('flatNo', '');
                        setFieldValue('address', '');
                      }}
                      onBlur={handleBlur('society')}
                      placeholderTextColor="#BFC3C9"
                    />
                    <Ionicons name="chevron-down" size={20 * scale} color="#BFC3C9" style={styles.dropdownIcon} />
                    {societySearch.length > 0 && societyOptions.filter(s => s.toLowerCase().includes(societySearch.toLowerCase())).length > 0 && (
                      <View style={styles.dropdownList}>
                        {societyOptions.filter(s => s.toLowerCase().includes(societySearch.toLowerCase())).map((s, idx) => (
                          <TouchableOpacity key={`society-${s}-${idx}`} onPress={() => {
                            setFieldValue('society', s);
                            setSocietySearch('');
                            setFieldValue('wing', '');
                            setFieldValue('flatNo', '');
                            setFieldValue('address', '');
                          }}>
                            <Text style={styles.dropdownItem}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                  {touched.society && errors.society && <Text style={styles.errorText}>{errors.society}</Text>}

                  {/* Wing Dropdown (if not Others) */}
                  {values.society && values.society !== 'Others' && (
                    <>
                      <Text style={styles.inputLabel}>Wing</Text>
                      <View style={{ position: 'relative' }}>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Select wing"
                          value={values.wing}
                          onChangeText={text => {
                            setFieldValue('wing', text);
                            setWingSearch(text);
                            setFieldValue('flatNo', '');
                          }}
                          onBlur={handleBlur('wing')}
                          placeholderTextColor="#BFC3C9"
                        />
                        <Ionicons name="chevron-down" size={20 * scale} color="#BFC3C9" style={styles.dropdownIcon} />
                        {wingSearch.length > 0 && wingOptions.filter(w => w.toLowerCase().includes(wingSearch.toLowerCase())).length > 0 && (
                          <View style={styles.dropdownList}>
                            {wingOptions.filter(w => w.toLowerCase().includes(wingSearch.toLowerCase())).map((w, idx) => (
                              <TouchableOpacity key={`wing-${w}-${idx}`} onPress={() => {
                                setFieldValue('wing', w);
                                setWingSearch('');
                                setFieldValue('flatNo', '');
                              }}>
                                <Text style={styles.dropdownItem}>{w}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                      {touched.wing && errors.wing && <Text style={styles.errorText}>{errors.wing}</Text>}
                    </>
                  )}

                  {/* Flat No Dropdown/Input (if not Others) */}
                  {values.society && values.society !== 'Others' && values.wing && (
                    <>
                      <Text style={styles.inputLabel}>Flat No</Text>
                      <View style={{ position: 'relative' }}>
                        <TextInput
                          style={styles.inputBox}
                          placeholder="Select or enter flat no"
                          value={values.flatNo}
                          onChangeText={text => {
                            setFieldValue('flatNo', text);
                            setFlatSearch(text);
                          }}
                          onBlur={handleBlur('flatNo')}
                          placeholderTextColor="#BFC3C9"
                        />
                        <Ionicons name="chevron-down" size={20 * scale} color="#BFC3C9" style={styles.dropdownIcon} />
                        {flatSearch.length > 0 && flatOptions.filter(f => f.toLowerCase().includes(flatSearch.toLowerCase())).length > 0 && (
                          <View style={styles.dropdownList}>
                            {flatOptions.filter(f => f.toLowerCase().includes(flatSearch.toLowerCase())).map((f, idx) => (
                              <TouchableOpacity key={`flat-${f}-${idx}`} onPress={() => {
                                setFieldValue('flatNo', f);
                                setFlatSearch('');
                              }}>
                                <Text style={styles.dropdownItem}>{f}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                      {touched.flatNo && errors.flatNo && <Text style={styles.errorText}>{errors.flatNo}</Text>}
                    </>
                  )}

                  {/* Address Input (if Others) */}
                  {values.society === 'Others' && (
                    <>
                      <Text style={styles.inputLabel}>Address</Text>
                      <TextInput
                        style={styles.inputBox}
                        placeholder="Enter address"
                        value={values.address}
                        onChangeText={handleChange('address')}
                        onBlur={handleBlur('address')}
                        placeholderTextColor="#BFC3C9"
                      />
                      {touched.address && errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                    </>
                  )}

                  {/* Contact Number */}
                  <Text style={styles.inputLabel}>Contact Number</Text>
                  <TextInput
                    style={styles.inputBox}
                    placeholder="Enter contact number"
                    keyboardType="phone-pad"
                    value={values.contactNumber}
                    onChangeText={handleChange('contactNumber')}
                    onBlur={handleBlur('contactNumber')}
                    maxLength={10}
                    placeholderTextColor="#BFC3C9"
                  />
                  {touched.contactNumber && errors.contactNumber && <Text style={styles.errorText}>{errors.contactNumber}</Text>}

                  {/* Order Date */}
                  <Text style={styles.inputLabel}>Order Date</Text>
                    <TouchableOpacity
                      style={[styles.inputBox, { flexDirection: 'row', alignItems: 'center' }]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text
                        style={{
                          flex: 1,
                          color: values.orderDate ? '#0A174E' : '#BFC3C9',
                          fontFamily: 'WorkSans',
                        }}
                      >
                        {values.orderDate ? format(values.orderDate, 'dd/MM/yyyy') : 'Select order date'}
                      </Text>
                      <Ionicons
                        name="calendar"
                        size={20 * scale}
                        color="#0A174E"
                        style={styles.dateIcon}
                      />
                    </TouchableOpacity>                    
                    {showDatePicker && (
                      <DateTimePicker
                        value={values.orderDate || new Date()}
                        mode="date"
                        display="default"   // "default" | "spinner" | "calendar"
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setFieldValue('orderDate', selectedDate);
                         }
                        }}
                      />
                    )}

                  {/* Medications Section */}
                  <Text style={styles.sectionTitle}>Medications</Text>
                  <View style={styles.medHeaderRow}>
                    <View style={styles.medHeaderLeft}>
                      <Text style={styles.medHeader}>Medicine</Text>
                      <Text style={styles.medHeader}>Quantity</Text>
                      <Text style={styles.medHeader}>MRP</Text>
                    </View>
                    <View style={styles.medHeaderRight}>
                      <Text style={styles.medHeader}>Total Amount</Text>
                    </View>
                  </View>
                  <FieldArray
                    name="medications"
                    render={arrayHelpers => (
                      <>
                        {/* Filter out invalid medications */}
                        {values.medications.filter(med => med.name && med.qty >= 1).map((med, idx) => (
                          <Swipeable
                            key={`med-${idx}-${med.name}-${med.qty}`}
                            renderRightActions={() => (
                              <TouchableOpacity
                                style={{
                                  backgroundColor: '#FF2A2A',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  width: 80 * scale,
                                  height: '100%',
                                  borderRadius: 16 * scale,
                                  marginVertical: 2 * scale,
                                }}
                                onPress={() => {
                                  const meds = values.medications.filter((_, i) => i !== idx);
                                  setFieldValue('medications', meds);
                                }}
                              >
                                <Ionicons name="trash" size={24 * scale} color="#fff" />
                                <Text style={{ color: '#fff', fontWeight: 'bold', marginTop: 4 * scale }}>Delete</Text>
                              </TouchableOpacity>
                            )}
                          >
                            <TouchableOpacity
                              style={styles.medRow}
                              activeOpacity={0.8}
                              onPress={() => {
                                setEditMedIdx(idx);
                                setMedInitial(med);
                                setShowMedModal(true);
                              }}
                            >
                              {/* Use fixed width for each column for alignment */}
                              <View style={[styles.medRowLeft, { flexDirection: 'row', alignItems: 'center', flex: 1.5 }]}>  
                                <Text style={[styles.medNameDisplay, { flex: 2 }]}> 
                                  {med.name.length > 12 ? med.name.slice(0, 12) : med.name}
                                  {med.name.length > 12 ? '...' : ''}
                                </Text>
                                <Text style={[styles.medQtyDisplay, { flex: 1, textAlign: 'center' }]}>{med.qty}</Text>
                                <Text style={[styles.medMrpDisplay, { flex: 1, textAlign: 'center' }]}>{parseFloat(med.price.toString()).toFixed(2)}</Text>
                              </View>
                              <View style={styles.medRowRight}>
                                <View style={styles.medTotalBlock}>
                                  <Text style={styles.medTotalText} numberOfLines={1} ellipsizeMode="tail">
                                    <Text style={styles.medTotalBold}>₹{(med.qty * parseFloat(med.price.toString())).toFixed(2)}</Text>
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </Swipeable>
                        ))}
                        <TouchableOpacity style={styles.addMedBtn} onPress={() => {
                          setEditMedIdx(null);
                          setMedInitial({ name: '', qty: 1, price: 0 });
                          setShowMedModal(true);
                        }}>
                          <Text style={styles.addMedBtnText}>+ Add Medication</Text>
                        </TouchableOpacity>
                        {/* Medication Modal (full form) */}
                        <Modal
                          visible={showMedModal}
                          animationType="slide"
                          transparent={true}
                          onRequestClose={() => setShowMedModal(false)}
                        >
                          <View style={styles.medModalOverlay}>
                            <View style={styles.medModalContent}>
                              <Text style={styles.sectionTitle}>{editMedIdx !== null ? 'Edit Medication' : 'Add Medication'}</Text>
                              <Formik
                                initialValues={medInitial}
                                validationSchema={Yup.object().shape({
                                  name: Yup.string().required('Medicine name is required'),
                                  qty: Yup.number().required('Quantity is required').min(1, 'Min 1'),
                                  price: Yup.number().required('MRP is required').min(0, 'Min 0'),
                                })}
                                onSubmit={medValues => {
                                  if (editMedIdx !== null) {
                                    // Edit existing
                                    const meds = [...values.medications];
                                    meds[editMedIdx] = medValues;
                                    setFieldValue('medications', meds);
                                  } else {
                                    // Add new
                                    setFieldValue('medications', [...values.medications, medValues]);
                                  }
                                  setShowMedModal(false);
                                }}
                              >
                                {({ values: medValues, handleChange: medChange, handleBlur: medBlur, handleSubmit: medSubmit, errors: medErrors, touched: medTouched }) => (
                                  <>
                                    <Text style={styles.inputLabel}>Medicine Name</Text>
                                    <TextInput
                                      style={styles.inputBox}
                                      placeholder="Enter medicine name"
                                      value={medValues.name}
                                      onChangeText={medChange('name')}
                                      onBlur={medBlur('name')}
                                      placeholderTextColor="#BFC3C9"
                                    />
                                    {medTouched.name && medErrors.name && <Text style={styles.errorText}>{medErrors.name}</Text>}
                                    <Text style={styles.inputLabel}>Quantity</Text>
                                    <TextInput
                                      style={styles.inputBox}
                                      placeholder="Enter quantity"
                                      keyboardType="numeric"
                                      value={medValues.qty.toString()}
                                      onChangeText={text => medChange('qty')(text.replace(/[^0-9]/g, ''))}
                                      onBlur={medBlur('qty')}
                                      placeholderTextColor="#BFC3C9"
                                    />
                                    {medTouched.qty && medErrors.qty && <Text style={styles.errorText}>{medErrors.qty}</Text>}
                                    <Text style={styles.inputLabel}>MRP</Text>
                                    <TextInput
                                      style={styles.inputBox}
                                      placeholder="Enter MRP"
                                      keyboardType="decimal-pad"
                                      value={medValues.price.toString()}
                                      onChangeText={text => medChange('price')(text.replace(/[^0-9.]/g, ''))}
                                      onBlur={medBlur('price')}
                                      placeholderTextColor="#BFC3C9"
                                    />
                                    {medTouched.price && medErrors.price && <Text style={styles.errorText}>{medErrors.price}</Text>}
                                    <View style={styles.submitBtnRow}>
                                      <TouchableOpacity style={styles.submitBtn} onPress={() => medSubmit()}>
                                        <Text style={styles.submitBtnText}>{editMedIdx !== null ? 'Update' : 'Add'}</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowMedModal(false)}>
                                        <Text style={styles.cancelBtnText}>Cancel</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </>
                                )}
                              </Formik>
                            </View>
                          </View>
                        </Modal>
                      </>
                    )}
                  />
                  
                  {/* Order Summary */}
                  <Text style={styles.sectionTitle}>Order Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Subtotal</Text>
                    <Text style={styles.summaryValue}>₹{values.medications.reduce((sum: number, med: any) => sum + med.qty * parseFloat(med.price), 0).toFixed(2)}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount %</Text>
                    <TextInput
                      style={[styles.inputBox, { width: 60 * scale, textAlign: 'right' }]}
                      placeholder="%"
                      keyboardType="numeric"
                      value={values.discountPercent.toString()}
                      onChangeText={text => setFieldValue('discountPercent', parseFloat(text) || 0)}
                      placeholderTextColor="#BFC3C9"
                    />
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount Amount</Text>
                    <Text style={styles.summaryValue}>₹{(values.medications.reduce((sum: number, med: any) => sum + med.qty * parseFloat(med.price), 0) * (values.discountPercent || 0) / 100).toFixed(2)}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalValue}>₹{(values.medications.reduce((sum: number, med: any) => sum + med.qty * parseFloat(med.price), 0) - (values.medications.reduce((sum: number, med: any) => sum + med.qty * parseFloat(med.price), 0) * (values.discountPercent || 0) / 100)).toFixed(2)}</Text>
                  </View>
                  
                  {/* Debug: Show validation errors */}
                  {Object.keys(errors).length > 0 && (
                    <View style={{ backgroundColor: '#ffebee', padding: 10, borderRadius: 8, marginBottom: 10 }}>
                      <Text style={{ color: '#c62828', fontWeight: 'bold' }}>Validation Errors:</Text>
                      {Object.entries(errors).map(([key, value]) => (
                        <Text key={key} style={{ color: '#c62828' }}>{key}: {String(value)}</Text>
                      ))}
                    </View>
                  )}
                  
                  {/* Submit Button */}
                  <View style={styles.submitBtnRow}>
                    <TouchableOpacity style={styles.submitBtn} onPress={() => {
                      console.log('Submit button pressed');
                      console.log('Form values:', values);
                      console.log('Form errors:', errors);
                      
                      // Filter out empty medications before submission
                      const validMedications = values.medications.filter(med => med.name && med.name.trim() !== '');
                      if (validMedications.length === 0) {
                        console.log('No valid medications found');
                        Alert.alert('Error', 'Please add at least one medication');
                        return;
                      }
                      
                      // Create a new values object with only valid medications
                      const submitValues = {
                        ...values,
                        medications: validMedications
                      };
                      
                      console.log('Submitting with valid medications:', submitValues);
                      handleSubmit();
                    }}>
                      <Text style={styles.submitBtnText}>Submit Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2EC4D6',
    paddingTop: 32 * scale,
    paddingBottom: 16 * scale,
    paddingHorizontal: 16 * scale,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  backBtn: {
    position: 'absolute',
    left: 16 * scale,
    zIndex: 2,
    padding: 4 * scale,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 22 * scale,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'WorkSans',
    zIndex: 1,
  },
  body: {
    paddingHorizontal: 16 * scale,
    paddingTop: 20 * scale,
    paddingBottom: 8 * scale,
  },
  inputLabel: {
    fontSize: 14 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    marginBottom: 6 * scale,
    fontFamily: 'WorkSans',
  },
  inputBox: {
    borderRadius: 14 * scale,
    backgroundColor: '#F2F6FA',
    paddingHorizontal: 16 * scale,
    paddingVertical: 14 * scale,
    fontSize: 15 * scale,
    color: '#0A174E',
    fontFamily: 'WorkSans',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    marginBottom: 18 * scale,
    shadowColor: '#BFC3C9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 24 * scale,
    top: 18 * scale,
  },
  dropdownList: {
    backgroundColor: '#F2F6FA',
    borderRadius: 14 * scale,
    marginTop: -10 * scale,
    marginBottom: 10 * scale,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    shadowColor: '#BFC3C9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 12 * scale,
    paddingHorizontal: 16 * scale,
    fontFamily: 'WorkSans',
  },
  errorText: {
    color: '#FF2A2A',
    fontSize: 12 * scale,
    marginTop: -10 * scale,
    marginBottom: 10 * scale,
    fontFamily: 'WorkSans',
  },
  sectionTitle: {
    fontSize: 17 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    marginTop: 18 * scale,
    marginBottom: 10 * scale,
    fontFamily: 'WorkSans',
  },
  medHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5 * scale,
    backgroundColor: 'transparent',
    borderRadius: 8 * scale,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  medHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    gap: 0,
  },
  medHeader: {
    fontSize: 13 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
    textAlign: 'left',
    marginRight: 18 * scale,
  },
  medHeaderRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14 * scale,
    minHeight: 44 * scale,
    justifyContent: 'space-between',
  },
  medRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.5,
    gap: 0,
  },
  medNameDisplay: {
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
    fontSize: 15 * scale,
    paddingHorizontal: 4 * scale,
    textAlign: 'left',
    minWidth: 0,
    maxWidth: 80 * scale,
    overflow: 'hidden',
  },
  medQtyDisplay: {
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
    fontSize: 15 * scale,
    textAlign: 'left',
    minWidth: 0,
    maxWidth: 40 * scale,
    marginLeft: 12 * scale,
  },
  medMrpDisplay: {
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
    fontSize: 15 * scale,
    textAlign: 'left',
    minWidth: 0,
    maxWidth: 60 * scale,
    marginLeft: 12 * scale,
  },
  medRowRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  medTotalBlock: {
    backgroundColor: '#F2F6FA',
    borderRadius: 16 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18 * scale,
    paddingVertical: 8 * scale,
    minWidth: 0,
    maxWidth: 120 * scale,
  },
  medTotalText: {
    color: '#0A174E',
    fontFamily: 'WorkSans',
    fontSize: 15 * scale,
    textAlign: 'center',
    minWidth: 0,
  },
  medTotalBold: {
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
    fontSize: 15 * scale,
  },
  addMedBtn: {
    backgroundColor: '#2EC4D6',
    borderRadius: 20 * scale,
    paddingVertical: 10 * scale,
    paddingHorizontal: 24 * scale,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4 * scale,
    marginBottom: 10 * scale,
    shadowColor: '#2EC4D6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  addMedBtnText: {
    color: '#fff',
    fontSize: 15 * scale,
    fontWeight: 'bold',
    fontFamily: 'WorkSans',
  },
  medModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20 * scale,
    padding: 24 * scale,
    width: '90%',
    maxWidth: 400 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8 * scale,
    paddingVertical: 0,
    backgroundColor: 'transparent',
  },
  summaryLabel: {
    fontSize: 15 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
  },
  summaryValue: {
    fontSize: 15 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
  },
  divider: {
    height: 2 * scale,
    backgroundColor: '#BFC3C9',
    marginVertical: 12 * scale,
    borderRadius: 2 * scale,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18 * scale,
  },
  totalLabel: {
    fontSize: 17 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
  },
  totalValue: {
    fontSize: 17 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    fontFamily: 'WorkSans',
  },
  submitBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10 * scale,
    marginBottom: 10 * scale,
    gap: 12 * scale,
  },
  submitBtn: {
    backgroundColor: '#2EC4D6',
    borderRadius: 20 * scale,
    paddingVertical: 10 * scale,
    paddingHorizontal: 28 * scale,
    alignItems: 'center',
    minWidth: 120 * scale,
    shadowColor: '#2EC4D6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 15 * scale,
    fontWeight: 'bold',
    fontFamily: 'WorkSans',
    letterSpacing: 0.5,
  },
  cancelBtn: {
    backgroundColor: '#F2F6FA',
    borderRadius: 20 * scale,
    paddingVertical: 10 * scale,
    paddingHorizontal: 28 * scale,
    alignItems: 'center',
    minWidth: 100 * scale,
    borderWidth: 1,
    borderColor: '#BFC3C9',
  },
  cancelBtnText: {
    color: '#0A174E',
    fontSize: 15 * scale,
    fontWeight: 'bold',
    fontFamily: 'WorkSans',
    letterSpacing: 0.5,
  },
  dateIcon: {
    position: 'absolute',
    right: 24 * scale,
    top: 18 * scale,
  },
});