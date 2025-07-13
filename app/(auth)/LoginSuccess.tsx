import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Back_icon from '../../assets/svg/Back_icon';
import SucessLogo from '../../assets/svg/SucessLogo';

const { width } = Dimensions.get('window');
const scale = width / 320;
const LoginSuccess = () => {
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
          <Text style={styles.SuccesTxt}> LOGIN SUCCESSFULL</Text>
        </View>
        <View style={styles.succesOuter}>
          <TouchableOpacity
            onPress={() => {
              router.push('/(auth)/First');
            }}
          >
            <View>
              <Text style={styles.buttonText}>SUCCESSFULL</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginSuccess;

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
  },
  succesOuter: {
    marginTop: 120 * scale,
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
  },
}); 