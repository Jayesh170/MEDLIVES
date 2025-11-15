import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  primaryAlt: '#37B9C5',
  text: '#0A174E',
  surface: '#FFFFFF',
  muted: '#888',
  border: '#eee',
  chipBg: '#e0f7fa',
  danger: '#FF2A2A',
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [userInfo] = useState({
    name: 'Dr. Omkar Medical',
    email: 'omkar@medical.com',
    phone: '+91 9876543210',
    address: '123 Medical Street, Health City',
    license: 'MED123456',
    experience: '15 years',
  });

  const menuItems = [
    {
      id: '1',
      title: 'Edit Profile',
      icon: 'person-outline',
      action: 'edit',
      route: '/EditProfile',
    },
    {
      id: '2',
      title: 'Account & Subscription',
      icon: 'card-outline',
      action: 'account',
      route: '/AccountSubscription',
    },
    {
      id: '3',
      title: 'Delivery User & Management',
      icon: 'people-outline',
      action: 'delivery',
      route: '/DeliveryManagement',
    },
    {
      id: '4',
      title: 'Security & Data',
      icon: 'shield-checkmark-outline',
      action: 'security',
      route: '/SecurityData',
    },
    {
      id: '5',
      title: 'Settings',
      icon: 'settings-outline',
      action: 'settings',
      route: '/Settings',
    },
    {
      id: '6',
      title: 'Notifications',
      icon: 'notifications-outline',
      action: 'notifications',
      route: '/Notifications',
    },
    {
      id: '7',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: 'help',
      route: '/HelpSupport',
    },
    {
      id: '8',
      title: 'About',
      icon: 'information-circle-outline',
      action: 'about',
      route: '/About',
    },
    {
      id: '9',
      title: 'Logout',
      icon: 'log-out-outline',
      action: 'logout',
      isDestructive: true,
    },
  ];

  const handleMenuAction = (action: string, route?: string) => {
    if (action === 'logout') {
      // Handle logout logic here
      console.log('Logout action');
      return;
    }
    
    if (route) {
      router.push(route);
    }
  };

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => handleMenuAction(item.action, item.route)}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          <Ionicons
            name={item.icon as any}
            size={20 * scale}
            color={item.isDestructive ? COLORS.danger : COLORS.primary}
          />
        </View>
        <Text
          style={[
            styles.menuItemText,
            { color: item.isDestructive ? COLORS.danger : COLORS.text },
          ]}
        >
          {item.title}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16 * scale}
        color={COLORS.muted}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 8 * scale) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="person" size={24 * scale} color="#fff" style={{ marginRight: 8 * scale }} />
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>
      </View>

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>OM</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16 * scale} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{userInfo.name}</Text>
          <Text style={styles.profileEmail}>{userInfo.email}</Text>
          <Text style={styles.profilePhone}>{userInfo.phone}</Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,234</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹2.5L</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Business Info */}
        <View style={styles.businessCard}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16 * scale} color={COLORS.muted} />
            <Text style={styles.infoText}>{userInfo.address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="document-text-outline" size={16 * scale} color={COLORS.muted} />
            <Text style={styles.infoText}>License: {userInfo.license}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16 * scale} color={COLORS.muted} />
            <Text style={styles.infoText}>Experience: {userInfo.experience}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuCard}>
          {menuItems.map(renderMenuItem)}
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 Omkar Medical</Text>
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16 * scale,
    paddingBottom: 8 * scale,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20 * scale,
    borderBottomRightRadius: 20 * scale,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18 * scale,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16 * scale,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20 * scale,
    padding: 20 * scale,
    marginTop: 16 * scale,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16 * scale,
  },
  avatar: {
    width: 80 * scale,
    height: 80 * scale,
    borderRadius: 40 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24 * scale,
    fontFamily: FONTS.bold,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24 * scale,
    height: 24 * scale,
    borderRadius: 12 * scale,
    backgroundColor: COLORS.primaryAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  profileEmail: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 2 * scale,
  },
  profilePhone: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
    marginTop: 16 * scale,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4 * scale,
  },
  statLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  statDivider: {
    width: 1 * scale,
    backgroundColor: COLORS.border,
    marginHorizontal: 8 * scale,
  },
  businessCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
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
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 12 * scale,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  infoText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 8 * scale,
    flex: 1,
  },
  menuCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    marginTop: 16 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16 * scale,
    paddingHorizontal: 16 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 32 * scale,
    height: 32 * scale,
    borderRadius: 16 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  menuItemText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    flex: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 24 * scale,
    marginBottom: 80 * scale + 20 * scale,
  },
  versionText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 4 * scale,
  },
  copyrightText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
});

export default ProfileScreen;
