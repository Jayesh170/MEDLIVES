import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import Logo from '../../assets/svg/Logo'; // Your MedDel cross heart logo

const { width, height } = Dimensions.get('window');
const scale = width / 320;

const lightTheme = {
  backgroundColor: '#FFFFFF',
  titleColor: '#37b9c5',
  subTextColor: '#283638',
  signupButtonColor: '#1f393dff',
  signupbutonText: "#FFF"
};

const darkTheme = {
  backgroundColor: '#1F1F39',
  titleColor: '#37b9c5',
  subTextColor: '#37b9c5',
  signupButtonColor: '#FFF',
  signupbutonText : '#1F1F39'
};

const Register = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* App Logo */}
        <View style={styles.imageContainer}>
          <Logo size={180 * scale} />
        </View>

        {/* App Name and Description */}
        <View style={styles.textContainer}>
          <Text style={[styles.titleText, { color: theme.titleColor }]}>MedDel</Text>
          <Text style={[styles.subText, { color: theme.subTextColor }]}>
            Smart Order & Delivery{'\n'}Management for Pharmacies
          </Text>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/LoginPage')}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.signupButton, { backgroundColor: theme.signupButtonColor }]}
          onPress={() => router.push('/(auth)/Register')}
        >
          <Text style={[styles.signupButtonText, {color : theme.signupbutonText}]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingTop: height * 0.15,
    paddingBottom: height * 0.05,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.05,
  },
  imageContainer: {
    marginBottom: 5 * scale,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  titleText: {
    fontSize: 32 * scale,
    fontWeight: 'bold',
    marginBottom: 8 * scale,
    fontFamily: 'ManropeSemiBold',
  },
  subText: {
    fontSize: 12 * scale,
    textAlign: 'center',
    lineHeight: 20 * scale,
    fontWeight: '400',
    fontFamily: 'ManropeBold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#37b9c5',
    paddingVertical: 10 * scale,
    borderRadius: 30 * scale,
    width: '80%',
    marginBottom: 12 * scale,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'ManropeSemiBold'
  },
  signupButton: {
    paddingVertical: 10 * scale,
    borderRadius: 30 * scale,
    width: '80%',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16 * scale,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'ManropeSemiBold'
  },
});
