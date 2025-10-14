import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  primaryAlt: '#37B9C5',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  border: '#eee',
  success: '#65B924',
  danger: '#FF2A2A',
  warning: '#F4A261',
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

const EditProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Dr. Omkar Medical',
    email: 'omkar@medical.com',
    phone: '+91 9876543210',
    address: '123 Medical Street, Health City',
    license: 'MED123456',
    experience: '15 years',
    specialization: 'General Medicine',
    qualification: 'MBBS, MD',
    clinicName: 'Omkar Medical Center',
    workingHours: '9:00 AM - 6:00 PM',
    emergencyContact: '+91 9876543211',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!formData.license.trim()) {
      newErrors.license = 'License number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  const renderInputField = (label: string, field: string, placeholder: string, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.inputBox, multiline && styles.textArea]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        placeholderTextColor="#BFC3C9"
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>OM</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16 * scale} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileTitle}>Profile Picture</Text>
          <Text style={styles.profileSubtitle}>Tap to change your profile picture</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          {renderInputField('Full Name', 'name', 'Enter your full name')}
          {renderInputField('Email Address', 'email', 'Enter your email', 'email-address')}
          {renderInputField('Phone Number', 'phone', 'Enter your phone number', 'phone-pad')}
          {renderInputField('Address', 'address', 'Enter your address', 'default', true)}
        </View>

        {/* Professional Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          {renderInputField('License Number', 'license', 'Enter your license number')}
          {renderInputField('Experience', 'experience', 'e.g., 15 years')}
          {renderInputField('Specialization', 'specialization', 'e.g., General Medicine')}
          {renderInputField('Qualification', 'qualification', 'e.g., MBBS, MD')}
        </View>

        {/* Business Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          {renderInputField('Clinic Name', 'clinicName', 'Enter your clinic name')}
          {renderInputField('Working Hours', 'workingHours', 'e.g., 9:00 AM - 6:00 PM')}
          {renderInputField('Emergency Contact', 'emergencyContact', 'Enter emergency contact number', 'phone-pad')}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16 * scale,
    paddingTop: 8 * scale,
    paddingBottom: 16 * scale,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
  },
  backBtn: {
    marginRight: 12 * scale,
    padding: 4 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: COLORS.primaryAlt,
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 20 * scale,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16 * scale,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24 * scale,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16 * scale,
  },
  avatar: {
    width: 100 * scale,
    height: 100 * scale,
    borderRadius: 50 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 32 * scale,
    fontFamily: FONTS.bold,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32 * scale,
    height: 32 * scale,
    borderRadius: 16 * scale,
    backgroundColor: COLORS.primaryAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  profileSubtitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 20 * scale,
    marginBottom: 16 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16 * scale,
  },
  inputGroup: {
    marginBottom: 16 * scale,
  },
  inputLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  inputBox: {
    borderRadius: 12 * scale,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    fontSize: 15 * scale,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 80 * scale,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    marginTop: 4 * scale,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24 * scale,
    paddingBottom: 80 * scale,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.muted + '20',
    paddingVertical: 16 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginRight: 8 * scale,
  },
  cancelBtnText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.muted,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 16 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginLeft: 8 * scale,
  },
  saveButtonText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
});

export default EditProfile;
