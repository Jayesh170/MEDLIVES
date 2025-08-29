import { FormikProps } from "formik";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface Step2Props {
  formik: FormikProps<any>;
  theme: any;
}

const Step2: React.FC<Step2Props> = ({ formik, theme }) => {
  const { handleChange, handleBlur, values, errors, touched } = formik;

  return (
    <View style={styles.container}>
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
      {errors.mobile && touched.mobile && (
        <Text style={styles.error}>{String(errors.mobile)}</Text>
      )}

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
      {errors.otp && touched.otp && (
        <Text style={styles.error}>{String(errors.otp)}</Text>
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
});

export default Step2;
