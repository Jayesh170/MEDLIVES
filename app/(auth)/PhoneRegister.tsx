import { router } from 'expo-router';
import { Formik } from 'formik';
import React from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import Back_icon from '../../assets/svg/Back_icon';

const { width } = Dimensions.get('window');
const scale = width / 320;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
});

const PhoneRegister = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Back_icon size={24 * scale} />
        </TouchableOpacity>
        {/* Title */}
        <Text style={styles.title}>REGISTER YOURSELF</Text>
        <Formik
          initialValues={{ name: '', phone: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            router.push({ pathname: '/(auth)/OtpVerification', params: { phone: values.phone, name: values.name } });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              {/* Name Input */}
              <Text style={styles.inputLabel}>NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="NAME"
                placeholderTextColor="#BFC3C9"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              <View style={styles.underline} />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              {/* Phone Input */}
              <Text style={styles.inputLabel}>PHONE NO</Text>
              <TextInput
                style={styles.input}
                placeholder="PHONE NO"
                placeholderTextColor="#BFC3C9"
                keyboardType="phone-pad"
                value={values.phone}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                maxLength={10}
              />
              <View style={styles.underline} />
              {touched.phone && errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
              {/* Get OTP Button */}
              <TouchableOpacity style={styles.getOtpButton} onPress={handleSubmit as any}>
                <Text style={styles.getOtpButtonText}>GET OTP</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PhoneRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24 * scale,
    paddingTop: 48 * scale,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 8 * scale,
    top: 48 * scale,
    zIndex: 10,
    padding: 8 * scale,
  },
  title: {
    alignSelf: 'center',
    fontSize: 24 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    marginBottom: 40 * scale,
    marginTop: 0,
  },
  inputLabel: {
    color: '#BFC3C9',
    fontSize: 12 * scale,
    marginBottom: 0,
    marginTop: 8 * scale,
    marginLeft: 2 * scale,
  },
  input: {
    fontSize: 16 * scale,
    color: '#222',
    paddingVertical: 8 * scale,
    backgroundColor: 'transparent',
  },
  underline: {
    height: 2,
    backgroundColor: '#2EC4D6',
    marginBottom: 8 * scale,
    marginTop: -2 * scale,
  },
  getOtpButton: {
    backgroundColor: '#2EC4D6',
    borderRadius: 24 * scale,
    height: 48 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32 * scale,
  },
  getOtpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16 * scale,
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12 * scale,
    marginBottom: 4 * scale,
    marginLeft: 2 * scale,
  },
}); 