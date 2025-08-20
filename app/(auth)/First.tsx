import GrowX_D from '@/assets/svg/DarkMode/GrowX_DarkMode';
import GrowX_W from '@/assets/svg/WhiteScreen_logo/GrowX_white';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Logo from '../../assets/svg/Logo'; // Your MedDel cross heart logo

const { width, height } = Dimensions.get('window');
const scale = width / 320;

const lightTheme = {
  backgroundColor: '#FFFFFF',
  titleColor: '#37b9c5',
  subTextColor: '#283638',
  devTextColor: '#4A4A4A',
  byTextColor: '#4A4A4A',
};

const darkTheme = {
  backgroundColor: '#1F1F39',
  titleColor: '#37b9c5', // keep teal color for branding
  subTextColor: '#37b9c5',
  devTextColor: '#FFFFFF',
  byTextColor: '#FFFFFF',
};

const First = () => {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      router.push('/(auth)/Register');
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

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
            Smart Order & Delivery{'\n'}Management for Pharmacies.
          </Text>
        </View>
      </View>

      {/* Footer - Designed and Developed By */}
      <View style={styles.footer}>
        <Text style={[styles.devText, { color: theme.devTextColor }]}>Designed & Developed</Text>
        <Text style={[styles.byText, { color: theme.byTextColor }]}>By</Text>
        <View style={styles.growxContainer}>
          {isDarkMode ? (
            <GrowX_D size={120 * scale} />
          ) : (
            <GrowX_W size={120 * scale} />
          )}
        </View>
      </View>
    </View>
  );
};

export default First;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: height * 0.15,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.05, // Slight adjustment to center better
  },
  imageContainer: {
    marginBottom: 5 * scale,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 0 * scale,
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
  footer: {
    alignItems: 'center',
    marginBottom: 30 * scale,
  },
  devText: {
    fontSize: 14 * scale,
    fontWeight: '600',
    marginTop: 112 * scale,
    fontFamily: 'ManropeSemiBold',
  },
  byText: {
    fontSize: 14 * scale,
    fontWeight: '600',
  },
  growxContainer: {
    alignItems: 'center',
  },
});
