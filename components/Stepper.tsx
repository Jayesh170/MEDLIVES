import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = require('react-native').Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  primaryAlt: '#37B9C5',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  border: '#eee',
  success: '#65B924',
  inactive: '#BFC3C9',
};

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export default function Stepper({ 
  steps, 
  currentStep 
}: StepperProps) {
  return (
    <View style={styles.container}>
      {/* Background connector line */}
      <View style={styles.backgroundConnector} />
      
      {/* Progress connector line */}
      {currentStep > 0 && (
        <View style={[
          styles.progressConnector,
          { 
            width: currentStep >= steps.length - 1 ? '60%' : 
                   currentStep === 1 ? '30%' : 
                   currentStep === 2 ? '60%' : '0%'
          }
        ]} />
      )}
      
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          {/* Step Circle */}
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: index <= currentStep ? COLORS.primary : '#FFFFFF',
                borderColor: index <= currentStep ? COLORS.primary : COLORS.inactive,
                shadowColor: index <= currentStep ? COLORS.primary : 'transparent',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: index <= currentStep ? 0.25 : 0,
                shadowRadius: 6,
                elevation: index <= currentStep ? 6 : 2,
                transform: [{ scale: index === currentStep ? 1.1 : 1 }],
              }
            ]}
          >
            {index < currentStep ? (
              <Ionicons name="checkmark" size={20 * scale} color="#fff" />
            ) : (
              <Text style={[
                styles.stepNumber,
                { color: index <= currentStep ? '#fff' : COLORS.inactive }
              ]}>
                {index + 1}
              </Text>
            )}
          </View>

          {/* Step Label */}
          <Text style={[
            styles.stepLabel,
            { 
              color: index <= currentStep ? COLORS.primary : COLORS.muted,
              fontWeight: index === currentStep ? '700' : '600',
              fontSize: index === currentStep ? 15 * scale : 14 * scale,
            }
          ]}>
            {step}
          </Text>

          {/* Step Status Indicator */}
          {index === currentStep && (
            <View style={styles.currentStepIndicator} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 28 * scale,
    paddingHorizontal: 24 * scale,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 8 * scale,
    position: 'relative',
  },
  backgroundConnector: {
    position: 'absolute',
    top: 46 * scale, // Align with circle centers
    left: '20%',
    right: '20%',
    height: 4 * scale,
    backgroundColor: '#E2E8F0',
    borderRadius: 2 * scale,
    zIndex: 0,
  },
  progressConnector: {
    position: 'absolute',
    top: 46 * scale, // Align with circle centers
    left: '20%',
    height: 4 * scale,
    backgroundColor: COLORS.primary,
    borderRadius: 2 * scale,
    zIndex: 1,
    maxWidth: '60%', // Ensure it doesn't exceed the background connector
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    minHeight: 75 * scale,
    zIndex: 1,
  },
  stepCircle: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * scale,
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  stepNumber: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    fontFamily: 'ManropeBold',
  },
  stepLabel: {
    fontSize: 14 * scale,
    fontWeight: '600',
    fontFamily: 'ManropeSemiBold',
    textAlign: 'center',
    maxWidth: 100 * scale,
    lineHeight: 18 * scale,
  },
  currentStepIndicator: {
    width: 6 * scale,
    height: 6 * scale,
    borderRadius: 3 * scale,
    backgroundColor: COLORS.primary,
    marginTop: 4 * scale,
  },
  activeConnector: {
    position: 'absolute',
    top: 18 * scale, // Align with circle center
    left: '50%',
    right: '-50%',
    height: 3 * scale,
    backgroundColor: COLORS.primary,
    borderRadius: 2 * scale,
    zIndex: 1,
  },
  connector: {
    position: 'absolute',
    top: 18 * scale,
    left: '60%',
    width: '80%',
    height: 2 * scale,
    zIndex: -1,
  },
});
