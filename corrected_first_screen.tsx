import GrowX_W from '@/assets/svg/WhiteScreen_logo/GrowX_white';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Logo from '../../assets/svg/Logo'; // Your MedDel cross + heart logo
const { width, height } = Dimensions.get('window');
const scale = width / 320;

const First = () => {
  const timerRef = useRef<number | null>(null);
  // useEffect(() => {
  //   timerRef.current = setTimeout(() => {
  //     router.push('/(auth)/Register');
  //   }, 3000);
  // }, []);

  return (
    <View style={styles.container}>
      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* App Logo */}
        <View style={styles.imageContainer}>
          <Logo size={180 * scale} />
        </View>

        {/* App Name and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>MedDel</Text>
          <Text style={styles.subText}>
            Smart Order & Delivery{'\n'}Management for Pharmacies
          </Text>
        </View>
      </View>

      {/* Footer - Designed and Developed By */}
      <View style={styles.footer}>
        <Text style={styles.devText}>Designed And Developed</Text>
        <Text style={styles.byText}>By</Text>
        <View style={styles.growxContainer}>
          <GrowX_W size={120 * scale} />
          <Text style={styles.growxSub}>Tech & MARKETING</Text>
        </View>
      </View>
    </View>
  );
};

export default First;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.05, // Slight adjustment to center better
  },
  imageContainer: {
    marginBottom: 30 * scale,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 10 * scale,
  },
  titleText: {
    color: '#37B9C5',
    fontSize: 32 * scale,
    fontWeight: 'bold',
    marginBottom: 12 * scale,
    fontFamily: 'System', // Use system font for consistency
  },
  subText: {
    color: '#4A4A4A',
    fontSize: 14 * scale,
    textAlign: 'center',
    lineHeight: 20 * scale,
    fontWeight: '400',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  devText: {
    color: '#4A4A4A',
    fontSize: 14 * scale,
    fontWeight: '400',
    marginBottom: 2 * scale,
  },
  byText: {
    color: '#4A4A4A',
    fontSize: 14 * scale,
    fontWeight: '400',
    marginBottom: 15 * scale,
  },
  growxContainer: {
    alignItems: 'center',
  },
  growxSub: {
    fontSize: 12 * scale,
    color: '#4ECF73', // Green color for "Tech & MARKETING"
    fontWeight: '600',
    marginTop: 5 * scale,
    letterSpacing: 0.5,
  },
});