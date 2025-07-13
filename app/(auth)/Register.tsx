import GoogleIcon from '@/assets/svg/GoogleIcon';
import Register_logo from '@/assets/svg/Register_logo';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 320;

const Register = () => {
  const timerRef = useRef<number | null>(null);
  // useEffect(() => {
  //   timerRef.current = setTimeout(() => {
  //     router.push('/(auth)/LoginSuccess');
  //   }, 3000);
  // }, []);
  return (
    <View style={styles.container}>
        <View style={styles.InnerContainer}>
            <View style={styles.imgContainer}>
            <Register_logo size={250 * scale}/>
            </View>
            <View >
              <Text style={styles.txtContainer}>REGISTER</Text>
            </View>
        </View>
        <View style={styles.OuterContainer}>
          <TouchableOpacity 
          onPress={() => {
            router.push('/(auth)/PhoneRegister')
          }}
          >
              <View style={styles.phoneOuter}>
                <Text style={styles.phoneTxt}>
                  PHONE NO
                </Text>
              </View>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={()=>{
                router.push('/(auth)/EmailRegister')
              }}
              >
              <View style={styles.emailOuter}>
              <View style={styles.GoogleLogo}>
              <GoogleIcon size={ 30 * scale}/>
              </View>
              <Text style={styles.emailTxt}>
                EMAIL ID
              </Text>
            </View>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={()=>{
              router.push('/(auth)/LoginPage')
            }}
            >
              <Text style ={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default Register;

const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#ffffff'
    },
    InnerContainer:{
      paddingTop: 90 * scale,
      justifyContent : 'center',
      alignItems: 'center'
    },
    imgContainer :{
    },
    txtContainer :{
      fontSize : 25 * scale,
      fontWeight : 'bold',
      padding : 10 * scale
    },
    OuterContainer:{
      paddingTop: 70 * scale,
      justifyContent: 'center',
      alignItems : 'center'
    },
    emailOuter:{
      flexDirection: 'row',
      marginTop: 10 * scale,
      height : 40 * scale,
      width : 290 * scale,
      backgroundColor: '#FFFFF',
      justifyContent: 'center',
      alignItems : 'center',
      borderRadius : 50 * scale,
      borderWidth: 0.5 * scale
    },
    emailTxt:{
      fontSize : 15 * scale,
      color : '#00000'
    },
    phoneOuter : {
      height : 40 * scale,
      width : 290 * scale,
      backgroundColor: '#37b9c5',
      justifyContent: 'center',
      alignItems : 'center',
      borderRadius : 40 * scale
    },
    phoneTxt :{
      color : '#FFFF',
      fontSize : 15 * scale ,
    },
    GoogleLogo :{
      right: 10 * scale
    },
    loginText:{
      color: '#37B9C5',
      marginTop : 20 * scale,
      fontSize: 17 * scale,
    }
}); 