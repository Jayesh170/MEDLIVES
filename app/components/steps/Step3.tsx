import { Ionicons } from "@expo/vector-icons";
import { FormikProps } from "formik";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface Step3Props {
  formik: FormikProps<any>;
  theme: any;
}

const Step3: React.FC<Step3Props> = ({ formik, theme }) => {
  const { handleChange, handleBlur, values, errors, touched } = formik;
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
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
      {errors.password && touched.password && (
        <Text style={styles.error}>{String(errors.password)}</Text>
      )}

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
      {errors.confirmPassword && touched.confirmPassword && (
        <Text style={styles.error}>{String(errors.confirmPassword)}</Text>
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

export default Step3;
