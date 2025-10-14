import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch, Alert, TextInput, Modal } from 'react-native';
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
  info: '#3B82F6',
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

const SecurityData = () => {
  const router = useRouter();
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const securityOptions = [
    {
      id: 'password',
      title: 'Change Password',
      subtitle: 'Update your account password',
      icon: 'lock-closed-outline',
      action: 'password',
      showArrow: true,
    },
    {
      id: 'twoStep',
      title: 'Two-Step Verification',
      subtitle: 'Add an extra layer of security',
      icon: 'shield-checkmark-outline',
      action: 'twoStep',
      showSwitch: true,
      switchValue: twoStepEnabled,
      onSwitchChange: setTwoStepEnabled,
    },
    {
      id: 'biometric',
      title: 'Biometric Authentication',
      subtitle: 'Use fingerprint or face ID',
      icon: 'finger-print-outline',
      action: 'biometric',
      showSwitch: true,
      switchValue: biometricEnabled,
      onSwitchChange: setBiometricEnabled,
    },
    {
      id: 'session',
      title: 'Active Sessions',
      subtitle: 'Manage your active sessions',
      icon: 'phone-portrait-outline',
      action: 'session',
      showArrow: true,
    },
  ];

  const dataOptions = [
    {
      id: 'backup',
      title: 'Data Backup',
      subtitle: 'Backup your data to cloud',
      icon: 'cloud-upload-outline',
      action: 'backup',
      showArrow: true,
    },
    {
      id: 'restore',
      title: 'Data Restore',
      subtitle: 'Restore data from backup',
      icon: 'cloud-download-outline',
      action: 'restore',
      showArrow: true,
    },
    {
      id: 'autoBackup',
      title: 'Automatic Backup',
      subtitle: 'Enable automatic daily backup',
      icon: 'refresh-outline',
      action: 'autoBackup',
      showSwitch: true,
      switchValue: autoBackup,
      onSwitchChange: setAutoBackup,
    },
    {
      id: 'export',
      title: 'Export Data',
      subtitle: 'Export your data in various formats',
      icon: 'download-outline',
      action: 'export',
      showArrow: true,
    },
  ];

  const privacyOptions = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'document-text-outline',
      action: 'privacy',
      showArrow: true,
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-outline',
      action: 'terms',
      showArrow: true,
    },
    {
      id: 'dataUsage',
      title: 'Data Usage',
      subtitle: 'How we use your data',
      icon: 'analytics-outline',
      action: 'dataUsage',
      showArrow: true,
    },
    {
      id: 'delete',
      title: 'Delete Account',
      subtitle: 'Permanently delete your account',
      icon: 'trash-outline',
      action: 'delete',
      showArrow: true,
      isDestructive: true,
    },
  ];

  const handleOptionPress = (action: string) => {
    switch (action) {
      case 'password':
        setShowPasswordModal(true);
        break;
      case 'twoStep':
        // Toggle handled by switch
        break;
      case 'biometric':
        // Toggle handled by switch
        break;
      case 'session':
        Alert.alert('Active Sessions', 'You have 2 active sessions:\n• iPhone (Current)\n• iPad');
        break;
      case 'backup':
        setShowBackupModal(true);
        break;
      case 'restore':
        Alert.alert('Data Restore', 'Select a backup to restore from:\n• Backup from Jan 15, 2024\n• Backup from Jan 10, 2024');
        break;
      case 'autoBackup':
        // Toggle handled by switch
        break;
      case 'export':
        Alert.alert('Export Data', 'Choose export format:\n• CSV\n• JSON\n• PDF');
        break;
      case 'privacy':
        Alert.alert('Privacy Policy', 'Opening privacy policy...');
        break;
      case 'terms':
        Alert.alert('Terms of Service', 'Opening terms of service...');
        break;
      case 'dataUsage':
        Alert.alert('Data Usage', 'Opening data usage information...');
        break;
      case 'delete':
        Alert.alert(
          'Delete Account',
          'This action cannot be undone. All your data will be permanently deleted.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') }
          ]
        );
        break;
    }
  };

  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }
    
    Alert.alert('Success', 'Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordModal(false);
  };

  const handleBackup = () => {
    Alert.alert('Backup Started', 'Your data is being backed up to the cloud...');
    setShowBackupModal(false);
  };

  const renderOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionItem, option.isDestructive && styles.destructiveOption]}
      onPress={() => handleOptionPress(option.action)}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.optionIcon, option.isDestructive && styles.destructiveIcon]}>
          <Ionicons
            name={option.icon as any}
            size={20 * scale}
            color={option.isDestructive ? COLORS.danger : COLORS.primary}
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={[styles.optionTitle, option.isDestructive && styles.destructiveText]}>
            {option.title}
          </Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
      </View>
      <View style={styles.optionRight}>
        {option.showSwitch && (
          <Switch
            value={option.switchValue}
            onValueChange={option.onSwitchChange}
            trackColor={{ false: COLORS.muted + '40', true: COLORS.primary + '40' }}
            thumbColor={option.switchValue ? COLORS.primary : COLORS.muted}
          />
        )}
        {option.showArrow && (
          <Ionicons
            name="chevron-forward"
            size={16 * scale}
            color={option.isDestructive ? COLORS.danger : COLORS.muted}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPasswordModal = () => (
    <Modal
      visible={showPasswordModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                secureTextEntry
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                secureTextEntry
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                placeholderTextColor="#BFC3C9"
              />
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowPasswordModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderBackupModal = () => (
    <Modal
      visible={showBackupModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowBackupModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Data Backup</Text>
            <TouchableOpacity onPress={() => setShowBackupModal(false)}>
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.backupInfo}>
              <Ionicons name="cloud-upload" size={48 * scale} color={COLORS.primary} />
              <Text style={styles.backupTitle}>Backup Your Data</Text>
              <Text style={styles.backupSubtitle}>
                Your data will be securely backed up to the cloud. This includes:
              </Text>
              <View style={styles.backupFeatures}>
                <Text style={styles.backupFeature}>• Customer information</Text>
                <Text style={styles.backupFeature}>• Order history</Text>
                <Text style={styles.backupFeature}>• Settings and preferences</Text>
                <Text style={styles.backupFeature}>• Delivery boy information</Text>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowBackupModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleBackup}>
              <Text style={styles.saveButtonText}>Start Backup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Data</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="shield-checkmark" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Security Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Security Settings</Text>
          <Text style={styles.sectionSubtitle}>Manage your account security</Text>
          {securityOptions.map(renderOption)}
        </View>

        {/* Data Management Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Text style={styles.sectionSubtitle}>Backup and restore your data</Text>
          {dataOptions.map(renderOption)}
        </View>

        {/* Privacy Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Privacy & Legal</Text>
          <Text style={styles.sectionSubtitle}>Privacy settings and legal information</Text>
          {privacyOptions.map(renderOption)}
        </View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={24 * scale} color={COLORS.warning} />
            <Text style={styles.tipsTitle}>Security Tips</Text>
          </View>
          <View style={styles.tipsList}>
            <Text style={styles.tipItem}>• Use a strong, unique password</Text>
            <Text style={styles.tipItem}>• Enable two-step verification</Text>
            <Text style={styles.tipItem}>• Regularly backup your data</Text>
            <Text style={styles.tipItem}>• Keep your app updated</Text>
            <Text style={styles.tipItem}>• Don't share your login credentials</Text>
          </View>
        </View>
      </ScrollView>

      {renderPasswordModal()}
      {renderBackupModal()}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionBtn: {
    marginLeft: 12 * scale,
    padding: 8 * scale,
    backgroundColor: COLORS.primaryAlt,
    borderRadius: 20 * scale,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16 * scale,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 20 * scale,
    marginTop: 16 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  sectionSubtitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 16 * scale,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  destructiveOption: {
    borderBottomColor: COLORS.danger + '20',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  destructiveIcon: {
    backgroundColor: COLORS.danger + '20',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  destructiveText: {
    color: COLORS.danger,
  },
  optionSubtitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 20 * scale,
    marginTop: 16 * scale,
    marginBottom: 80 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  tipsTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  tipsList: {
    marginLeft: 8 * scale,
  },
  tipItem: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20 * scale,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  modalBody: {
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
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
  backupInfo: {
    alignItems: 'center',
    paddingVertical: 20 * scale,
  },
  backupTitle: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 16 * scale,
    marginBottom: 8 * scale,
  },
  backupSubtitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
    marginBottom: 16 * scale,
    lineHeight: 20 * scale,
  },
  backupFeatures: {
    alignSelf: 'stretch',
  },
  backupFeature: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20 * scale,
    paddingVertical: 16 * scale,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.muted + '20',
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginRight: 8 * scale,
  },
  cancelButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.muted,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginLeft: 8 * scale,
  },
  saveButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
});

export default SecurityData;
