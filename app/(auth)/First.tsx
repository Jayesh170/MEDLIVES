import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Logo from '../../assets/svg/Logo';
const { width } = Dimensions.get('window');
const scale = width / 320;

const First = () => {
  const timerRef = useRef<number | null>(null);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      router.push('/(auth)/Register');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Logo size={160 * scale} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>OMKAR MEDICAL</Text>
      </View>
    </View>
  );
};

export default First;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    padding: 14 * scale,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 5 * scale,
  },
  titleText: {
    color: '#37B9C5',
    fontSize: 28 * scale,
    fontWeight: 'bold',
    marginBottom: 15 * scale,
  },
  skipButton: {
    backgroundColor: '#37B9C5',
    width: 150 * scale,
    height: 30 * scale,
    borderRadius: 15 * scale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipText: {
    color: '#FFFFFF',
    fontSize: 18 * scale,
    fontWeight: 'bold',
  },
}); 