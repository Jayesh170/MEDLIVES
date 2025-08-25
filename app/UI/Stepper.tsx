import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const scale = width / 320; // Base scaling factor

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, label: "Business Info" },
    { id: 2, label: "Contact & License" },
    { id: 3, label: "Password Setup" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stepContainer}>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Circle & Label */}
              <View style={styles.stepWrapper}>
                <TouchableOpacity
                  style={[
                    styles.circle,
                    isActive && styles.activeCircle,
                    isCompleted && styles.activeCircle,
                  ]}
                  onPress={() => setCurrentStep(step.id)}
                >
                  <Text
                    style={[
                      styles.stepText,
                      (isActive || isCompleted) && styles.activeStepText,
                    ]}
                  >
                    {step.id < 10 ? `0${step.id}` : step.id}
                  </Text>
                </TouchableOpacity>

                <Text
                  numberOfLines={2}
                  style={[
                    styles.label,
                    isActive ? styles.activeLabel : styles.inactiveLabel,
                  ]}
                >
                  {step.label}
                </Text>
              </View>

              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.activeLine,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20 * scale,
    alignItems: "center",
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10 * scale,
  },
  stepWrapper: {
    alignItems: "center",
  },
  circle: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: (40 * scale) / 2,
    borderWidth: 2,
    borderColor: "#3bbbc3",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  activeCircle: {
    backgroundColor: "#3bbbc3",
    borderColor: "#3bbbc3",
  },
  stepText: {
    fontSize: 13 * scale,
    fontWeight: "600",
    color: "#3bbbc3",
  },
  activeStepText: {
    color: "#fff",
  },
  label: {
    fontSize: 11 * scale,
    textAlign: "center",
    marginTop: 6 * scale,
    paddingHorizontal: 4 * scale,
    flexWrap: "wrap",
  },
  activeLabel: {
    color: "#3bbbc3",
    fontWeight: "600",
  },
  inactiveLabel: {
    color: "#777",
  },
  line: {
    flex: 1,
    height: 2 * scale,
    backgroundColor: "#820000ff",
    marginHorizontal: 5 * scale,
  },
  activeLine: {
    backgroundColor: "#3bbbc3",
  },
});

export default Stepper;
