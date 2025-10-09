import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

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
};

const customers = [
  { name: 'JAYESH DANGI', address: 'F-101 SHANTINAGAR', contactNumber: '8888133849' },
  { name: 'RAVI PATEL', address: 'A-202 GREEN PARK', contactNumber: '9876543210' },
  { name: 'PRIYA SHARMA', address: 'B-303 SUNSHINE', contactNumber: '9123456780' },
];

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

interface CustomerInfoStepProps {
  values: any;
  setFieldValue: (field: string, value: any) => void;
  handleChange: (field: string) => (value: string) => void;
  handleBlur: (field: string) => () => void;
  errors: any;
  touched: any;
}

export default function CustomerInfoStep({
  values,
  setFieldValue,
  handleChange,
  handleBlur,
  errors,
  touched,
}: CustomerInfoStepProps) {
  const [customerSearch, setCustomerSearch] = useState('');
  const [societySearch, setSocietySearch] = useState('');
  const [wingSearch, setWingSearch] = useState('');
  const [flatSearch, setFlatSearch] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Find selected society and wing objects
  const selectedSociety = societies.find(s => s.name === values.society);
  const selectedWing = selectedSociety?.wings.find(w => w.name === values.wing);

  // Autocomplete options
  const societyOptions = [
    ...societies
      .filter(s =>
        societySearch.length === 0 ||
        s.name.toLowerCase().includes(societySearch.toLowerCase())
      )
      .map(s => s.name),
    'Others',
  ];

  const wingOptions = selectedSociety && values.society !== 'Others'
    ? selectedSociety.wings
        .filter(w =>
          wingSearch.length === 0 ||
          w.name.toLowerCase().includes(wingSearch.toLowerCase())
        )
        .map(w => w.name)
    : [];

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={32 * scale} color={COLORS.primary} />
        <Text style={styles.stepTitle}>Customer Information</Text>
        <Text style={styles.stepSubtitle}>Enter customer details for the order</Text>
      </View>

      {/* Customer Name Dropdown with Search */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Customer Name *</Text>
        <View style={styles.inputContainer}>
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
                  <View style={styles.dropdownItemContainer}>
                    <Text style={styles.dropdownItemName}>{c.name}</Text>
                    <Text style={styles.dropdownItemDetails}>{c.address} • {c.contactNumber}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {touched.customerName && errors.customerName && (
          <Text style={styles.errorText}>{errors.customerName}</Text>
        )}
      </View>

      {/* Society Dropdown */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Society *</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputBox}
            placeholder="Select society"
            value={values.society}
            onChangeText={text => {
              setFieldValue('society', text);
              setSocietySearch(text);
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
        {touched.society && errors.society && (
          <Text style={styles.errorText}>{errors.society}</Text>
        )}
      </View>

      {/* Wing Dropdown (if not Others) */}
      {values.society && values.society !== 'Others' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Wing *</Text>
          <View style={styles.inputContainer}>
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
          {touched.wing && errors.wing && (
            <Text style={styles.errorText}>{errors.wing}</Text>
          )}
        </View>
      )}

      {/* Flat No Dropdown/Input (if not Others) */}
      {values.society && values.society !== 'Others' && values.wing && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Flat No *</Text>
          <View style={styles.inputContainer}>
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
          {touched.flatNo && errors.flatNo && (
            <Text style={styles.errorText}>{errors.flatNo}</Text>
          )}
        </View>
      )}

      {/* Address Input (if Others) */}
      {values.society === 'Others' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Address *</Text>
          <TextInput
            style={[styles.inputBox, styles.textArea]}
            placeholder="Enter complete address"
            value={values.address}
            onChangeText={handleChange('address')}
            onBlur={handleBlur('address')}
            placeholderTextColor="#BFC3C9"
            multiline
            numberOfLines={3}
          />
          {touched.address && errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>
      )}

      {/* Contact Number */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Contact Number *</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter 10-digit mobile number"
          keyboardType="phone-pad"
          value={values.contactNumber}
          onChangeText={handleChange('contactNumber')}
          onBlur={handleBlur('contactNumber')}
          maxLength={10}
          placeholderTextColor="#BFC3C9"
        />
        {touched.contactNumber && errors.contactNumber && (
          <Text style={styles.errorText}>{errors.contactNumber}</Text>
        )}
      </View>

      {/* Order Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Order Date *</Text>
        <TouchableOpacity
          style={[styles.inputBox, styles.dateInput]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[
            styles.dateText,
            { color: values.orderDate ? COLORS.text : '#BFC3C9' }
          ]}>
            {values.orderDate ? format(values.orderDate, 'dd/MM/yyyy') : 'Select order date'}
          </Text>
          <Ionicons name="calendar" size={20 * scale} color={COLORS.primary} />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={values.orderDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFieldValue('orderDate', selectedDate);
              }
            }}
          />
        )}
        {touched.orderDate && errors.orderDate && (
          <Text style={styles.errorText}>{errors.orderDate}</Text>
        )}
      </View>
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
  inputGroup: {
    marginBottom: 20 * scale,
  },
  inputLabel: {
    fontSize: 14 * scale,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8 * scale,
    fontFamily: 'ManropeSemiBold',
  },
  inputContainer: {
    position: 'relative',
  },
  inputBox: {
    borderRadius: 12 * scale,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: 'ManropeRegular',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 80 * scale,
    textAlignVertical: 'top',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 15 * scale,
    fontFamily: 'ManropeRegular',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 16 * scale,
    top: 18 * scale,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12 * scale,
    marginTop: 4 * scale,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 200 * scale,
  },
  dropdownItem: {
    paddingVertical: 14 * scale,
    paddingHorizontal: 16 * scale,
    fontFamily: 'ManropeRegular',
    fontSize: 15 * scale,
    color: COLORS.text,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  dropdownItemContainer: {
    paddingVertical: 12 * scale,
    paddingHorizontal: 16 * scale,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  dropdownItemName: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 15 * scale,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  dropdownItemDetails: {
    fontFamily: 'ManropeRegular',
    fontSize: 12 * scale,
    color: COLORS.muted,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12 * scale,
    marginTop: 4 * scale,
    fontFamily: 'ManropeRegular',
  },
});
