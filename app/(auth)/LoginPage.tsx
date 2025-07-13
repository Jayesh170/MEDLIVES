import { router } from 'expo-router';
import React from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Back_icon from '../../assets/svg/Back_icon';
import UserID from '../../assets/svg/UserID';

const { width } = Dimensions.get('window');
const scale = width / 320;

const PhoneRegister = () => {
  const [phone, setPhone] = React.useState('');

  const handleLogin = () => {
    // Navigate to OTP verification page, passing the phone number
    router.push({ pathname: '/(auth)/OtpVerification', params: { phone } });
  };

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
        <Text style={styles.title}>LOGIN</Text>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <UserID size={24 * scale} />
          <TextInput
            style={styles.input}
            placeholder="PHONE"
            placeholderTextColor="#BFC3C9"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            maxLength={10}
          />
        </View>
        <View style={styles.underline} />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 24 * scale,
  },
  input: {
    flex: 1,
    marginLeft: 12 * scale,
    fontSize: 16 * scale,
    color: '#222',
    paddingVertical: 8 * scale,
    backgroundColor: 'transparent',
  },
  underline: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: -2 * scale,
    marginBottom: 32 * scale,
  },
  loginButton: {
    backgroundColor: '#2EC4D6',
    borderRadius: 24 * scale,
    height: 48 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16 * scale,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16 * scale,
    letterSpacing: 1,
  },
}); 