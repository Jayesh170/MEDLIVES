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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const { width } = Dimensions.get("window");
const scale = width / 320;

// ✅ Yup validation schema
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

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* Top Section */}
          <View style={styles.topContainer}>
            <Logo width={100 * scale} height={100 * scale} />
            <Text style={styles.title}>MedDel</Text>
            <Text style={styles.subtitle}>
              Smart Order & Delivery{"\n"}Management for Pharmacies
            </Text>
          </View>

          {/* Middle Form */}
          <Formik
            initialValues={{ tenantCode: "", userId: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values) => {
              console.log("✅ Login Values:", values);
              // API call / navigation here
            }}
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
                <Text style={styles.label}>Tenant Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="126"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  maxLength={3}
                  onChangeText={handleChange("tenantCode")}
                  onBlur={handleBlur("tenantCode")}
                  value={values.tenantCode}
                />
                {errors.tenantCode && touched.tenantCode && (
                  <Text style={styles.error}>{errors.tenantCode}</Text>
                )}

                {/* User ID */}
                <Text style={styles.label}>User Id</Text>
                <TextInput
                  style={styles.input}
                  placeholder="126001"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  maxLength={6}
                  onChangeText={handleChange("userId")}
                  onBlur={handleBlur("userId")}
                  value={values.userId}
                />
                {errors.userId && touched.userId && (
                  <Text style={styles.error}>{errors.userId}</Text>
                )}

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginBottom: 0 }]}
                    placeholder="**********"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!passwordVisible}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Ionicons
                      name={
                        passwordVisible ? "eye-off-outline" : "eye-outline"
                      }
                      size={20 * scale}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}

                {/* Forgot Password */}
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleSubmit as any}
                >
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Designed And Developed{"\n"}By</Text>
            <GrowX_W width={120 * scale} height={40 * scale} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-between", // top, form, footer
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
  },
  topContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontFamily: "ManropeBold",
    fontSize: 28,
    fontWeight: "bold",
    color: "#37b9c5",
    marginTop: 6,
  },
  subtitle: {
    fontFamily: "ManropeSemiBold",
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  form: {
    width: "100%",
    marginTop: 10,
  },
  label: {
    fontFamily: "ManropeSemiBold",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#37b9c5", // teal
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    backgroundColor: "#e8faff",
    fontSize: 14,
    fontFamily: "ManropeSemiBold",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#37b9c5",
    borderRadius: 20,
    marginBottom: 6,
    backgroundColor: "#e8faff",
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 4,
  },
  forgotPassword: {
    fontFamily: "ManropeRegular",
    textAlign: "right",
    color: "#37b9c5",
    fontSize: 12,
    marginBottom: 15,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#37b9c5",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "ManropeSemiBold",
  },
  footer: {
    alignItems: "center",
    marginBottom: 15,
  },
  footerText: {
    fontFamily: "ManropeSemiBold",
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    marginBottom: 6,
  },
});
