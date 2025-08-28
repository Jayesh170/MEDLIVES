import GrowX_D from "@/assets/svg/DarkMode/GrowX_DarkMode";
import Logo from "@/assets/svg/Logo";
import GrowX_W from "@/assets/svg/WhiteScreen_logo/GrowX_white";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import Stepper from "../UI/Stepper"; // ✅ use your Stepper component

const { width } = Dimensions.get("window");
const scale = width / 320;

// ✅ Themes
const lightTheme = {
  backgroundColor: "#FFFFFF",
  titleColor: "#37b9c5",
  subTextColor: "#283638",
  inputBg: "#e8faff",
  inputBorder: "#37b9c5",
  inputText: "#000",
  placeholder: "#aaa",
  buttonBg: "#37b9c5",
  buttonText: "#fff",
};

const darkTheme = {
  backgroundColor: "#1F1F39",
  titleColor: "#37b9c5",
  subTextColor: "#fff",
  inputBg: "#2C2C4A",
  inputBorder: "#37b9c5",
  inputText: "#fff",
  placeholder: "#aaa",
  buttonBg: "#37b9c5",
  buttonText: "#fff",
};

// ✅ Validation Schema
const SignUpSchema = Yup.object().shape({
  businessName: Yup.string().required("Business Name is required"),
  ownerName: Yup.string().required("Owner Name is required"),
  mobile: Yup.string()
    .required("Mobile Number is required")
    .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
  otp: Yup.string().required("OTP is required").matches(/^[0-9]{6}$/, "OTP must be 6 digits"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  licenseNo: Yup.string().required("License No. is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUpPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // ✅ Correct state
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          
          {/* Header */}
          <View style={styles.topContainer}>
            <Logo width={120 * scale} height={120 * scale} />
            <Text style={[styles.title, { color: theme.titleColor }]}>MedDel</Text>
            <Text style={[styles.subtitle, { color: theme.titleColor }]}>
              Smart Order & Delivery{"\n"}Management for Pharmacies
            </Text>
          </View>

          {/* Stepper Progress Bar */}
          <Stepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

          {/* Formik Wrapper */}
          <Formik
            initialValues={{
              businessName: "",
              ownerName: "",
              mobile: "",
              otp: "",
              email: "",
              licenseNo: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={(values) => {
              console.log("✅ SignUp Values:", values);
              alert("Sign Up Successful!");
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
                
                {/* Step 1 */}
                {currentStep === 1 && (
                  <>
                    <Text style={[styles.label, { color: theme.subTextColor }]}>Business Name</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="Enter Pharmacy Name"
                        placeholderTextColor={theme.placeholder}
                        onChangeText={handleChange("businessName")}
                        onBlur={handleBlur("businessName")}
                        value={values.businessName}
                      />
                    </View>
                    {errors.businessName && touched.businessName && <Text style={styles.error}>{errors.businessName}</Text>}

                    <Text style={[styles.label, { color: theme.subTextColor }]}>Owner Name</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="Enter Owner Name"
                        placeholderTextColor={theme.placeholder}
                        onChangeText={handleChange("ownerName")}
                        onBlur={handleBlur("ownerName")}
                        value={values.ownerName}
                      />
                    </View>
                    {errors.ownerName && touched.ownerName && <Text style={styles.error}>{errors.ownerName}</Text>}
                  </>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <>
                    <Text style={[styles.label, { color: theme.subTextColor }]}>Mobile Number</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="10-digit Mobile"
                        placeholderTextColor={theme.placeholder}
                        keyboardType="number-pad"
                        onChangeText={handleChange("mobile")}
                        onBlur={handleBlur("mobile")}
                        value={values.mobile}
                      />
                    </View>
                    {errors.mobile && touched.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

                    <Text style={[styles.label, { color: theme.subTextColor }]}>OTP</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="Enter OTP"
                        placeholderTextColor={theme.placeholder}
                        keyboardType="number-pad"
                        onChangeText={handleChange("otp")}
                        onBlur={handleBlur("otp")}
                        value={values.otp}
                      />
                    </View>
                    {errors.otp && touched.otp && <Text style={styles.error}>{errors.otp}</Text>}

                    <Text style={[styles.label, { color: theme.subTextColor }]}>Email</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="Enter Email"
                        placeholderTextColor={theme.placeholder}
                        keyboardType="email-address"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                      />
                    </View>
                    {errors.email && touched.email && <Text style={styles.error}>{errors.email}</Text>}

                    <Text style={[styles.label, { color: theme.subTextColor }]}>License No</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="Drug License Number"
                        placeholderTextColor={theme.placeholder}
                        onChangeText={handleChange("licenseNo")}
                        onBlur={handleBlur("licenseNo")}
                        value={values.licenseNo}
                      />
                    </View>
                    {errors.licenseNo && touched.licenseNo && <Text style={styles.error}>{errors.licenseNo}</Text>}
                  </>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <>
                    <Text style={[styles.label, { color: theme.subTextColor }]}>Password</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="********"
                        placeholderTextColor={theme.placeholder}
                        secureTextEntry={!passwordVisible}
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                      />
                      <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                        <Ionicons
                          name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                          size={18 * scale}
                          color={theme.subTextColor}
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.password && touched.password && <Text style={styles.error}>{errors.password}</Text>}

                    <Text style={[styles.label, { color: theme.subTextColor }]}>Confirm Password</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
                      <TextInput
                        style={[styles.textInput, { color: theme.inputText }]}
                        placeholder="********"
                        placeholderTextColor={theme.placeholder}
                        secureTextEntry
                        onChangeText={handleChange("confirmPassword")}
                        onBlur={handleBlur("confirmPassword")}
                        value={values.confirmPassword}
                      />
                    </View>
                    {errors.confirmPassword && touched.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}
                  </>
                )}

                {/* Navigation Buttons */}
                <View style={styles.navigation}>
                  {currentStep > 1 && (
                    <TouchableOpacity
                      style={[styles.navBtn, { backgroundColor: "#ccc" }]}
                      onPress={() => setCurrentStep((prev) => prev - 1)}
                    >
                      <Text style={styles.navText}>Back</Text>
                    </TouchableOpacity>
                  )}
                  {currentStep < 3 ? (
                    <TouchableOpacity
                      style={[styles.navBtn, { backgroundColor: theme.buttonBg }]}
                      onPress={() => setCurrentStep((prev) => prev + 1)}
                    >
                      <Text style={[styles.navText, { color: theme.buttonText }]}>Next</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.navBtn, { backgroundColor: theme.buttonBg }]}
                      onPress={handleSubmit}
                    >
                      <Text style={[styles.navText, { color: theme.buttonText }]}>Submit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </Formik>

          {/* Footer */}
          <View style={styles.footer}>
            {scheme === "dark" ? (
              <GrowX_D width={120 * scale} height={90 * scale} />
            ) : (
              <GrowX_W width={120 * scale} height={90 * scale} />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpPage;

// 🔹 Styles
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20 * scale,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 5 * scale,
    marginBottom: 5 * scale,
    width: "100%",
  },
  title: {
    fontFamily: "ManropeBold",
    fontSize: 22 * scale,
    fontWeight: "bold",
    marginTop: 2 * scale,
  },
  subtitle: {
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
    fontSize: 11 * scale,
    marginTop: 2 * scale,
  },
  form: { width: "100%" },
  label: {
    fontSize: 12 * scale,
    fontFamily: "ManropeSemiBold",
    marginBottom: 4 * scale,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.3 * scale,
    borderRadius: 18 * scale,
    paddingHorizontal: 12 * scale,
    marginBottom: 6 * scale,
  },
  textInput: {
    flex: 1,
    paddingVertical: 8 * scale,
    fontSize: 13 * scale,
    fontFamily: "ManropeSemiBold",
  },
  error: {
    color: "red",
    fontSize: 10 * scale,
    marginBottom: 6 * scale,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10 * scale,
  },
  navBtn: {
    flex: 1,
    paddingVertical: 10 * scale,
    borderRadius: 25 * scale,
    alignItems: "center",
    marginHorizontal: 5 * scale,
  },
  navText: {
    fontSize: 14 * scale,
    fontFamily: "ManropeSemiBold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 15 * scale,
  },
});