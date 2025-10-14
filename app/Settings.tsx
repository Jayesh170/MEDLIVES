import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
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

const Settings = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const generalSettings = [
    {
      id: 'theme',
      title: 'Dark Mode',
      subtitle: 'Switch to dark theme',
      icon: 'moon-outline',
      showSwitch: true,
      switchValue: darkMode,
      onSwitchChange: setDarkMode,
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'English (US)',
      icon: 'language-outline',
      showArrow: true,
    },
    {
      id: 'currency',
      title: 'Currency',
      subtitle: 'Indian Rupee (₹)',
      icon: 'card-outline',
      showArrow: true,
    },
    {
      id: 'timezone',
      title: 'Timezone',
      subtitle: 'Asia/Kolkata',
      icon: 'time-outline',
      showArrow: true,
    },
  ];

  const appSettings = [
    {
      id: 'autoSync',
      title: 'Auto Sync',
      subtitle: 'Automatically sync data',
      icon: 'sync-outline',
      showSwitch: true,
      switchValue: autoSync,
      onSwitchChange: setAutoSync,
    },
    {
      id: 'location',
      title: 'Location Services',
      subtitle: 'Use location for delivery tracking',
      icon: 'location-outline',
      showSwitch: true,
      switchValue: locationServices,
      onSwitchChange: setLocationServices,
    },
    {
      id: 'cache',
      title: 'Clear Cache',
      subtitle: 'Clear app cache and temporary files',
      icon: 'trash-outline',
      showArrow: true,
    },
    {
      id: 'storage',
      title: 'Storage Usage',
      subtitle: 'View storage usage details',
      icon: 'hardware-chip-outline',
      showArrow: true,
    },
  ];

  const notificationSettings = [
    {
      id: 'push',
      title: 'Push Notifications',
      subtitle: 'Receive push notifications',
      icon: 'notifications-outline',
      showSwitch: true,
      switchValue: pushNotifications,
      onSwitchChange: setPushNotifications,
    },
    {
      id: 'sound',
      title: 'Notification Sound',
      subtitle: 'Play sound for notifications',
      icon: 'volume-high-outline',
      showSwitch: true,
      switchValue: soundEnabled,
      onSwitchChange: setSoundEnabled,
    },
    {
      id: 'vibration',
      title: 'Vibration',
      subtitle: 'Vibrate for notifications',
      icon: 'phone-portrait-outline',
      showSwitch: true,
      switchValue: vibrationEnabled,
      onSwitchChange: setVibrationEnabled,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      subtitle: 'Receive email notifications',
      icon: 'mail-outline',
      showArrow: true,
    },
  ];

  const handleOptionPress = (id: string) => {
    switch (id) {
      case 'language':
        // Handle language selection
        break;
      case 'currency':
        // Handle currency selection
        break;
      case 'timezone':
        // Handle timezone selection
        break;
      case 'cache':
        // Handle cache clearing
        break;
      case 'storage':
        // Handle storage usage
        break;
      case 'email':
        // Handle email notifications
        break;
    }
  };

  const renderOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={styles.optionItem}
      onPress={() => handleOptionPress(option.id)}
    >
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Ionicons
            name={option.icon as any}
            size={20 * scale}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>{option.title}</Text>
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
            color={COLORS.muted}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="refresh" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>General</Text>
          <Text style={styles.sectionSubtitle}>Basic app preferences</Text>
          {generalSettings.map(renderOption)}
        </View>

        {/* App Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <Text style={styles.sectionSubtitle}>Application behavior and data</Text>
          {appSettings.map(renderOption)}
        </View>

        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.sectionSubtitle}>Notification preferences</Text>
          {notificationSettings.map(renderOption)}
        </View>

        {/* App Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24 * scale} color={COLORS.info} />
            <Text style={styles.infoTitle}>App Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.01.15</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated</Text>
            <Text style={styles.infoValue}>January 15, 2024</Text>
          </View>
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
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
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
  infoCard: {
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
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  infoTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  infoLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  infoValue: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
});

export default Settings;
