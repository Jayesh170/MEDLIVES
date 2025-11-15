import Back_icon from "@/assets/svg/Back_icon";
import Back_icon_White from "@/assets/svg/Back_icon_white";
import GrowX_D from "@/assets/svg/DarkMode/GrowX_DarkMode";
import Logo from "@/assets/svg/Logo";
import GrowX_W from "@/assets/svg/WhiteScreen_logo/GrowX_white";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

const { width } = Dimensions.get("window");
const scale = width / 320;

// ✅ Themes
const lightTheme = {
  backgroundColor: "#FFFFFF",
  titleColor: "#37b9c5",
  subTextColor: "#283638",
  devTextColor: "#4A4A4A",
  byTextColor: "#4A4A4A",
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
  devTextColor: "#FFFFFF",
  byTextColor: "#FFFFFF",
  inputBg: "#2C2C4A",
  inputBorder: "#37b9c5",
  inputText: "#fff",
  placeholder: "#aaa",
  buttonBg: "#37b9c5",
  buttonText: "#fff",
};

// ✅ Validation Schema
const LoginSchema = Yup.object().shape({
  tenantCode: Yup.string()
    .required("Tenant Code is required")
    .matches(/^[0-9]{3}$/, "Tenant Code must be exactly 3 digits"),
  userId: Yup.string()
    .required("User ID is required")
    .matches(/^[0-9]{6}$/, "User ID must be exactly 6 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [initialValues, setInitialValues] = useState({
    tenantCode: "",
    userId: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;
  const params = useLocalSearchParams();
  const router = useRouter();

  // Set initial values from registration params
  useEffect(() => {
    if (params.tenantCode && params.userId && params.password) {
      setInitialValues({
        tenantCode: params.tenantCode as string,
        userId: params.userId as string,
        password: params.password as string,
      });
    }
  }, [params.tenantCode, params.userId, params.password]);

  // Login validation function
  const handleLogin = (values: { tenantCode: string; userId: string; password: string }) => {
    setLoginError("");
    
    // Check if credentials match the ones from registration
    if (
      params.tenantCode &&
      params.userId &&
      params.password &&
      values.tenantCode === params.tenantCode &&
      values.userId === params.userId &&
      values.password === params.password
    ) {
      // Successful login - navigate to HomeScreen
      router.replace("/");
    } else {
      // Invalid credentials
      setLoginError("Invalid credentials. Please check your Tenant Code, User ID, and Password.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar
        barStyle={scheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.backgroundColor}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
          {/* Top Section */}
          <View style={styles.topContainer}>
            {/* Back Button (Optional) */}
            <TouchableOpacity style={styles.backButton}>
              {scheme === "dark" ? (
                <Back_icon_White width={25 * scale} height={25 * scale} />
              ) : (
                <Back_icon width={25 * scale} height={25 * scale} />
              )}
            </TouchableOpacity>

            <Logo width={120 * scale} height={120 * scale} />
            <Text style={[styles.title, { color: theme.titleColor }]}>MedDel</Text>
            <Text style={[styles.subtitle, { color: theme.titleColor }]}>
              Smart Order & Delivery{"\n"}Management for Pharmacies
            </Text>
          </View>

          {/* Form */}
          <Formik
            initialValues={initialValues}
            validationSchema={LoginSchema}
            enableReinitialize={true}
            onSubmit={handleLogin}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                {/* Tenant Code */}
                <Text style={[styles.label, { color: theme.subTextColor }]}>
                  Tenant Code
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: theme.inputText }]}
                    placeholder="Tenant Code"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="number-pad"
                    onChangeText={handleChange("tenantCode")}
                    onBlur={handleBlur("tenantCode")}
                    value={values.tenantCode}
                  />
                </View>
                {errors.tenantCode && touched.tenantCode && (
                  <Text style={styles.error}>{errors.tenantCode}</Text>
                )}

                {/* User ID */}
                <Text style={[styles.label, { color: theme.subTextColor }]}>
                  User ID
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: theme.inputText }]}
                    placeholder="User ID"
                    placeholderTextColor={theme.placeholder}
                    keyboardType="number-pad"
                    onChangeText={handleChange("userId")}
                    onBlur={handleBlur("userId")}
                    value={values.userId}
                  />
                </View>
                {errors.userId && touched.userId && (
                  <Text style={styles.error}>{errors.userId}</Text>
                )}

                {/* Password */}
                <Text style={[styles.label, { color: theme.subTextColor }]}>
                  Password
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    { backgroundColor: theme.inputBg, borderColor: theme.inputBorder },
                  ]}
                >
                  <TextInput
                    style={[styles.textInput, { color: theme.inputText }]}
                    placeholder="**********"
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
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                {/* Login Error */}
                {loginError ? (
                  <Text style={styles.error}>{loginError}</Text>
                ) : null}

                {/* Forgot Password */}
                <TouchableOpacity>
                  <Text style={[styles.forgotPassword, { color: theme.titleColor }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={[styles.loginButton, { backgroundColor: theme.buttonBg }]}
                  onPress={handleSubmit as any}
                >
                  <Text style={[styles.loginText, { color: theme.buttonText }]}>
                    Log In
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.byTextColor }]}>
              Designed And Developed{"\n"}By
            </Text>
            <View style={styles.growxContainer}>
              {scheme === "dark" ? (
                <GrowX_D width={120 * scale} height={90 * scale} />
              ) : (
                <GrowX_W width={120 * scale} height={90 * scale} />
              )}
            </View>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;

// 🔹 Styles
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20 * scale,
  },
  topContainer: {
    alignItems: "center",
    marginTop: 10 * scale,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top:   2 * scale,
  },
  title: {
    fontFamily: "ManropeBold",
    fontSize: 26 * scale,
    fontWeight: "bold",
    marginTop: 4 * scale,
  },
  subtitle: {
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
    fontSize: 12 * scale,
    marginTop: 3 * scale,
  },
  form: {
    width: "100%",
  },
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
    marginBottom: 5 * scale,
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
    marginBottom: 8 * scale,
  },
  forgotPassword: {
    fontFamily: "ManropeRegular",
    textAlign: "right",
    fontSize: 11 * scale,
    marginBottom: 10 * scale,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 10 * scale,
    borderRadius: 25 * scale,
    alignItems: "center",
    marginTop: 8 * scale,
  },
  loginText: {
    fontSize: 15 * scale,
    fontWeight: "bold",
    fontFamily: "ManropeSemiBold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 15 * scale,
    marginTop: 40 * scale,
  },
  footerText: {
    fontFamily: "ManropeSemiBold",
    fontSize: 12 * scale,
    textAlign: "center",
    marginBottom: 4 * scale,
  },
  growxContainer: {
    alignItems: "center",
  },
});
