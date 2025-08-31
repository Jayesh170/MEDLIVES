import { FormikProps } from "formik";
import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { otpApiService } from "../../../src/services/otpApi";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface Step2Props {
  formik: FormikProps<any>;
  theme: any;
}

const Step2: React.FC<Step2Props> = ({ formik, theme }) => {
  const { handleChange, handleBlur, values, errors, touched } = formik;
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleGetOtp = async () => {
    if (values.mobile && values.mobile.length === 10) {
      try {
        console.log("Sending OTP request for mobile:", values.mobile);
        
        const response = await otpApiService.sendOtp(values.mobile);
        
        if (response.success) {
          setShowOtpField(true);
          setIsOtpVerified(false);
          console.log("=== OTP SENT SUCCESSFULLY ===");
          console.log("Mobile Number:", values.mobile);
          console.log("OTP Code:", response.data?.otp || "Not provided");
          console.log("Response:", response.data);
          console.log("=====================");
          Alert.alert("OTP Generated", `OTP: ${response.data?.otp || "Not provided"}\n\nThis OTP was generated for testing purposes.`);
        } else {
          console.log("Failed to send OTP:", response.error);
          Alert.alert("Error", response.error || "Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        Alert.alert("Error", "Network error. Please check your connection and try again.");
      }
    } else {
      console.log("Invalid mobile number. Please enter a 10-digit number.");
      Alert.alert("Invalid Number", "Please enter a valid 10-digit mobile number.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!values.otp || values.otp.length < 4) {
      Alert.alert("Invalid OTP", "Please enter a valid OTP code.");
      return;
    }

    setIsVerifying(true);
    
    try {
      console.log("Verifying OTP:", values.otp, "for mobile:", values.mobile);
      
      const response = await otpApiService.verifyOtp(values.mobile, values.otp);
      
      if (response.success) {
        setIsOtpVerified(true);
        console.log("=== OTP VERIFIED SUCCESSFULLY ===");
        console.log("Mobile Number:", values.mobile);
        console.log("OTP Code:", values.otp);
        console.log("Response:", response.data);
        console.log("=====================");
        Alert.alert("Success", "OTP verified successfully!");
      } else {
        console.log("Failed to verify OTP:", response.error);
        Alert.alert("Error", response.error || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Network error. Please check your connection and try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.subTextColor }]}>Phone no</Text>
      
      {/* Mobile Number with Get OTP Button */}
      <View style={[styles.combinedContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
        <TextInput
          style={[styles.combinedInput, { color: theme.inputText }]}
          placeholder="Enter mobile number"
          placeholderTextColor={theme.placeholder}
          keyboardType="number-pad"
          onChangeText={handleChange("mobile")}
          onBlur={handleBlur("mobile")}
          value={values.mobile}
        />
        <TouchableOpacity
          style={[styles.getOtpButton, { backgroundColor: theme.buttonBg }]}
          onPress={handleGetOtp}
          disabled={!values.mobile || values.mobile.length !== 10}
        >
          <Text style={[styles.getOtpText, { color: theme.buttonText }]}>Get OTP</Text>
        </TouchableOpacity>
      </View>
      {errors.mobile && touched.mobile && (
        <Text style={styles.error}>{String(errors.mobile)}</Text>
      )}

      {/* OTP Field - Only show after Get OTP is clicked */}
      {showOtpField && (
        <>
          <Text style={[styles.label, { color: theme.subTextColor }]}>OTP</Text>
          <View style={[styles.combinedContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
            <TextInput
              style={[styles.combinedInput, { color: theme.inputText }]}
              placeholder="Enter OTP"
              placeholderTextColor={theme.placeholder}
              keyboardType="number-pad"
              onChangeText={handleChange("otp")}
              onBlur={handleBlur("otp")}
              value={values.otp}
            />
            <TouchableOpacity
              style={[
                styles.getOtpButton, 
                { 
                  backgroundColor: isOtpVerified ? '#4CAF50' : theme.buttonBg,
                  opacity: isVerifying ? 0.6 : 1
                }
              ]}
              onPress={handleVerifyOtp}
              disabled={!values.otp || values.otp.length < 4 || isVerifying || isOtpVerified}
            >
              <Text style={[styles.getOtpText, { color: theme.buttonText }]}>
                {isVerifying ? 'Verifying...' : isOtpVerified ? '✓ Verified' : 'Verify OTP'}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.otp && touched.otp && (
            <Text style={styles.error}>{String(errors.otp)}</Text>
          )}
          {isOtpVerified && (
            <Text style={[styles.success, { color: '#4CAF50' }]}>✓ OTP verified successfully!</Text>
          )}
        </>
      )}

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
      {errors.email && touched.email && (
        <Text style={styles.error}>{String(errors.email)}</Text>
      )}

      <Text style={[styles.label, { color: theme.subTextColor }]}>License Number</Text>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
        <TextInput
          style={[styles.textInput, { color: theme.inputText }]}
          placeholder="Enter License Number"
          placeholderTextColor={theme.placeholder}
          onChangeText={handleChange("licenseNo")}
          onBlur={handleBlur("licenseNo")}
          value={values.licenseNo}
        />
      </View>
      {errors.licenseNo && touched.licenseNo && (
        <Text style={styles.error}>{String(errors.licenseNo)}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 12 * scale,
    fontFamily: "ManropeSemiBold",
    marginBottom: 4 * scale,
  },
  combinedContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.3 * scale,
    borderRadius: 18 * scale,
    marginBottom: 6 * scale,
    overflow: "hidden",
  },
  combinedInput: {
    flex: 1,
    paddingVertical: 8 * scale,
    paddingHorizontal: 12 * scale,
    fontSize: 13 * scale,
    fontFamily: "ManropeSemiBold",
  },
  getOtpButton: {
    paddingVertical: 8 * scale,
    paddingHorizontal: 16 * scale,
    alignItems: "center",
    justifyContent: "center",
  },
  getOtpText: {
    fontSize: 12 * scale,
    fontFamily: "ManropeSemiBold",
    fontWeight: "600",
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
  success: {
    fontSize: 10 * scale,
    marginBottom: 6 * scale,
    fontFamily: "ManropeSemiBold",
  },
});

export default Step2;
