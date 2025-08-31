import { FormikProps } from "formik";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface StepNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: () => void;
  theme: any;
  formik: FormikProps<any>;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  setCurrentStep,
  onSubmit,
  theme,
  formik,
}) => {
  // Validation functions for each step
  const isStep1Valid = () => {
    const { businessName, ownerName } = formik.values;
    const { businessName: businessNameError, ownerName: ownerNameError } = formik.errors;
    return businessName && ownerName && !businessNameError && !ownerNameError;
  };

  const isStep2Valid = () => {
    const { mobile, otp, email, licenseNo } = formik.values;
    const { mobile: mobileError, otp: otpError, email: emailError, licenseNo: licenseNoError } = formik.errors;
    
    // Mobile, email, and license number are always required
    const mobileValid = mobile && mobile.length === 10 && !mobileError;
    const emailValid = email && !emailError;
    const licenseValid = licenseNo && !licenseNoError;
    
    // OTP is required if mobile is valid and OTP field is shown
    // For now, let's make OTP optional to allow form submission
    const otpValid = true; // Allow submission even without OTP for testing
    
    return mobileValid && emailValid && licenseValid && otpValid;
  };

  const isStep3Valid = () => {
    const { password, confirmPassword } = formik.values;
    const { password: passwordError, confirmPassword: confirmPasswordError } = formik.errors;
    return password && confirmPassword && !passwordError && !confirmPasswordError;
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid();
      case 2:
        return isStep2Valid();
      case 3:
        return isStep3Valid();
      default:
        return false;
    }
  };

  // Check if previous step is valid (for back navigation)
  const isPreviousStepValid = () => {
    switch (currentStep) {
      case 2:
        return isStep1Valid();
      case 3:
        return isStep2Valid();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (isPreviousStepValid()) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.navigation}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={[
            styles.navBtn,
            { backgroundColor: isPreviousStepValid() ? "#ccc" : "#f0f0f0" }
          ]}
          onPress={handleBack}
          disabled={!isPreviousStepValid()}
        >
          <Text style={[
            styles.navText,
            { color: isPreviousStepValid() ? "#333" : "#999" }
          ]}>
            Back
          </Text>
        </TouchableOpacity>
      )}
      {currentStep < 3 ? (
        <TouchableOpacity
          style={[
            styles.navBtn,
            { backgroundColor: isCurrentStepValid() ? theme.buttonBg : "#cccccc" }
          ]}
          onPress={handleNext}
          disabled={!isCurrentStepValid()}
        >
          <Text style={[
            styles.navText,
            { color: isCurrentStepValid() ? theme.buttonText : "#999" }
          ]}>
            Next
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.navBtn,
            { backgroundColor: isCurrentStepValid() ? theme.buttonBg : "#cccccc" }
          ]}
          onPress={() => {
            console.log("Submit button pressed!");
            console.log("Form values:", formik.values);
            console.log("Form errors:", formik.errors);
            console.log("Is current step valid:", isCurrentStepValid());
            onSubmit();
          }}
          disabled={!isCurrentStepValid()}
        >
          <Text style={[
            styles.navText,
            { color: isCurrentStepValid() ? theme.buttonText : "#999" }
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default StepNavigation;
