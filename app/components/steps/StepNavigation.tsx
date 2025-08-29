import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320;

interface StepNavigationProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onSubmit: () => void;
  theme: any;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  setCurrentStep,
  onSubmit,
  theme,
}) => {
  return (
    <View style={styles.navigation}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: "#ccc" }]}
          onPress={() => setCurrentStep(currentStep - 1)}
        >
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
      )}
      {currentStep < 3 ? (
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: theme.buttonBg }]}
          onPress={() => setCurrentStep(currentStep + 1)}
        >
          <Text style={[styles.navText, { color: theme.buttonText }]}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: theme.buttonBg }]}
          onPress={onSubmit}
        >
          <Text style={[styles.navText, { color: theme.buttonText }]}>Submit</Text>
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
