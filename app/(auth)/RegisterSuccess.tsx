import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Back_icon from '../../assets/svg/Back_icon';
import SucessLogo from '../../assets/svg/SucessLogo';

const { width } = Dimensions.get('window');
const scale = width / 320;

const RegisterSuccess = () => {
  const { name, phone } = useLocalSearchParams();
  return (
    <View style={styles.outerContainer}>
      <View style={styles.UpperContainer}>
        <View style={styles.BackIConImg}>
          <TouchableOpacity
            onPress={() => {
              router.push('/(auth)/Register');
            }}
          >
            <Back_icon size={35 * scale} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <View style={styles.imgContainer}>
          <SucessLogo size={250 * scale} />
        </View>
        <View style={styles.txtContainer}>
          <Text style={styles.SuccesTxt}>REGISTERED SUCCESSFULLY</Text>
          <Text style={styles.detailTxt}>{name ? String(name).toUpperCase() : ''}</Text>
          <Text style={styles.detailTxt}>{phone ? String(phone) : ''}</Text>
        </View>
        <View style={styles.succesOuter}>
          <TouchableOpacity
            onPress={() => {
              router.push('/(auth)/First');
            }}
          >
            <View>3
              <Text style={styles.buttonText}>CONTINUE</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  UpperContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  BackIConImg: {
    padding: 10 * scale,
  },
  innerContainer: {
    paddingTop: 35 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    marginLeft: 10 * scale,
  },
  SuccesTxt: {
    color: '#00000',
    fontSize: 22 * scale,
    fontWeight: 'bold',
    marginTop: 10 * scale,
  },
  detailTxt: {
    color: '#0A174E',
    fontSize: 16 * scale,
    fontWeight: '600',
    marginTop: 4 * scale,
    alignSelf: 'center',
  },
  succesOuter: {
    marginTop: 80 * scale,
    height: 40 * scale,
    width: 290 * scale,
    backgroundColor: '#37b9c5',
    justifyContent: 'center',
    alignItems: 'center',
    borderBlockColor: '#37b9c5',
    borderRadius: 50 * scale,
    borderWidth: 0.5 * scale,
  },
  buttonText: {
    fontSize: 15 * scale,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  txtContainer: {
    marginTop: 25 * scale,
    alignItems: 'center',
  },
}); 