import GrowX_D from "@/assets/svg/DarkMode/GrowX_DarkMode";
import Logo from "@/assets/svg/Logo";
import GrowX_W from "@/assets/svg/WhiteScreen_logo/GrowX_white";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { registrationApiService } from "../../src/services/registrationApi";
import Step1 from "../components/steps/Step1";
import Step2 from "../components/steps/Step2";
import Step3 from "../components/steps/Step3";
import StepNavigation from "../components/steps/StepNavigation";
import SuccessModal from "../components/SuccessModal";
import Stepper from "../UI/Stepper";

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
  licenseNo: Yup.string().required("License Number is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? darkTheme : lightTheme;

  const renderCurrentStep = (formik: any) => {
    switch (currentStep) {
      case 1:
        return <Step1 formik={formik} theme={theme} />;
      case 2:
        return <Step2 formik={formik} theme={theme} />;
      case 3:
        return <Step3 formik={formik} theme={theme} />;
      default:
        return <Step1 formik={formik} theme={theme} />;
    }
  };

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
        <ScrollView 
          style={[styles.container, { backgroundColor: theme.backgroundColor }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
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
            onSubmit={async (values) => {
              console.log("✅ SignUp Values:", values);
              setIsSubmitting(true);
              
              try {
                const response = await registrationApiService.registerTenant({
                  businessName: values.businessName,
                  ownerName: values.ownerName,
                  mobile: values.mobile,
                  email: values.email,
                  licenseNo: values.licenseNo,
                  password: values.password,
                });
                
                if (response.success && response.data) {
                  console.log("✅ Registration successful:", response.data);
                  setRegistrationData(response.data);
                  setShowSuccessModal(true);
                } else {
                  console.log("❌ Registration failed:", response.error);
                  Alert.alert("Registration Failed", response.error || "Something went wrong");
                }
              } catch (error) {
                console.error("❌ Registration error:", error);
                Alert.alert("Error", "Network error. Please try again.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {(formik) => (
              <View style={styles.form}>
                {/* Render Current Step */}
                {renderCurrentStep(formik)}

                {/* Navigation Buttons */}
                <StepNavigation
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                  onSubmit={formik.handleSubmit}
                  theme={theme}
                  formik={formik}
                />
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
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      {registrationData && (
        <SuccessModal
          visible={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          onProceedToLogin={() => {
            setShowSuccessModal(false);
            // Navigate to login page with pre-filled credentials
            router.push({
              pathname: "/(auth)/LoginPage",
              params: {
                tenantCode: registrationData.tenantCode.toString(),
                userId: registrationData.ownerUserId.toString(),
                password: registrationData.password,
              },
            });
          }}
          data={registrationData}
        />
      )}
    </SafeAreaView>
  );
};

export default SignUpPage;

// 🔹 Styles
const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20 * scale,
    paddingBottom: 20 * scale,
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
  form: { 
    width: "100%",
    flex: 1,
  },
  footer: {
    alignItems: "center",
    marginBottom: 15 * scale,
  },
});