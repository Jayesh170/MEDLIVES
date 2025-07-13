import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Back_icon from '../../assets/svg/Back_icon';

const { width } = Dimensions.get('window');
const scale = width / 320;
const RESEND_OTP_TIME = 60; // seconds

const OtpVerification = () => {
  const { phone, name } = useLocalSearchParams();
  // Ensure phone is a string and add +91 if not present
  let displayPhone = String(phone || '');
  if (!displayPhone.startsWith('+')) {
    displayPhone = '+91 ' + displayPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(RESEND_OTP_TIME);
  const [isResendActive, setIsResendActive] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);

  React.useEffect(() => {
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
      setIsResendActive(false);
    } else {
      setIsResendActive(true);
    }
    return () => {
      if (interval) clearInterval(interval);
      return undefined;
    };
  }, [timer]);

  const handleOtpChange = (value: string, idx: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    setError(''); // Clear error on edit
    if (value && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (!value && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(RESEND_OTP_TIME);
    setOtp(['', '', '', '']);
    setError(''); // Clear error on resend
    inputRefs.current[0]?.focus();
    // Optionally trigger resend OTP logic here
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '1234') { // Replace '1234' with your OTP logic
      setError('');
      if (name) {
        router.push({ pathname: '/(auth)/RegisterSuccess', params: { name: name || '', phone: phone || '' } });
      } else {
        router.push('/(auth)/LoginSuccess');
      }
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  // Format timer as m:ss
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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
        {/* Title */}
        <Text style={styles.title}>OTP</Text>
        {/* OTP sent message */}
        <Text style={styles.otpSentMsg}>OTP successfully sent to</Text>
        <Text style={styles.otpSentPhone}>{displayPhone}</Text>

        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((value: string, idx: number) => (
            <TextInput
              key={idx}
              ref={ref => { inputRefs.current[idx] = ref; }}
              style={[styles.otpInput, value ? styles.otpInputFilled : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={text => handleOtpChange(text, idx)}
              returnKeyType="next"
              autoFocus={idx === 0}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !value && idx > 0) {
                  inputRefs.current[idx - 1]?.focus();
                }
              }}
            />
          ))}
        </View>
        {/* Error Message */}
        {error ? (
          <Text style={{ color: 'red', marginBottom: 8 * scale, alignSelf: 'center' }}>{error}</Text>
        ) : null}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>

        {/* Resend Timer and Link */}
        <Text style={styles.resendTimer}>
          {isResendActive ? '' : `Resend OTP in  ${formatTimer(timer)}`}
        </Text>
        {isResendActive && (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>RESEND</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default OtpVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24 * scale,
    paddingTop: 48 * scale,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 8 * scale,
    top: 48 * scale,
    zIndex: 10,
    padding: 8 * scale,
  },
  title: {
    fontSize: 24 * scale,
    fontWeight: 'bold',
    color: '#0A174E',
    marginBottom: 8 * scale,
    marginTop: 0,
    alignSelf: 'center',
  },
  subtitle: {
    color: '#BFC3C9',
    fontSize: 14 * scale,
    marginBottom: 2 * scale,
    alignSelf: 'center',
  },
  phone: {
    color: '#BFC3C9',
    fontSize: 16 * scale,
    marginBottom: 24 * scale,
    alignSelf: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32 * scale,
    marginTop: 8 * scale,
  },
  otpInput: {
    width: 48 * scale,
    height: 48 * scale,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 8 * scale,
    marginHorizontal: 8 * scale,
    fontSize: 24 * scale,
    color: '#222',
    textAlign: 'center',
    backgroundColor: '#F9F9F9',
  },
  otpInputFilled: {
    borderColor: '#2EC4D6',
  },
  submitButton: {
    backgroundColor: '#2EC4D6',
    borderRadius: 24 * scale,
    height: 48 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8 * scale,
    marginBottom: 8 * scale,
    width: '100%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16 * scale,
    letterSpacing: 1,
  },
  resendTimer: {
    color: '#BFC3C9',
    fontSize: 14 * scale,
    marginTop: 8 * scale,
    marginBottom: 0,
    alignSelf: 'center',
  },
  resendLink: {
    color: '#F9A825',
    fontSize: 14 * scale,
    fontWeight: 'bold',
    marginTop: 8 * scale,
    alignSelf: 'center',
  },
  otpSentMsg: {
    alignSelf: 'center',
    color: '#BFC3C9',
    fontSize: 14 * scale,
    marginTop: 8 * scale,
  },
  otpSentPhone: {
    alignSelf: 'center',
    color: '#BFC3C9',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    marginBottom: 24 * scale,
  },
}); 