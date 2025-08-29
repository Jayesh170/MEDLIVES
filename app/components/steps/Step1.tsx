import { FormikProps } from "formik";
import React from "react";
import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface Step1Props {
  formik: FormikProps<any>;
  theme: any;
}

const Step1: React.FC<Step1Props> = ({ formik, theme }) => {
  const { handleChange, handleBlur, values, errors, touched } = formik;

  return (
    <View style={styles.container}>
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
      {errors.businessName && touched.businessName && (
        <Text style={styles.error}>{String(errors.businessName)}</Text>
      )}

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
      {errors.ownerName && touched.ownerName && (
        <Text style={styles.error}>{String(errors.ownerName)}</Text>
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

export default Step1;
