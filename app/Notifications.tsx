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

const Notifications = () => {
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [deliveryUpdates, setDeliveryUpdates] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const notificationSettings = [
    {
      id: 'push',
      title: 'Push Notifications',
      subtitle: 'Receive push notifications on your device',
      icon: 'notifications-outline',
      showSwitch: true,
      switchValue: pushNotifications,
      onSwitchChange: setPushNotifications,
    },
    {
      id: 'email',
      title: 'Email Notifications',
      subtitle: 'Receive notifications via email',
      icon: 'mail-outline',
      showSwitch: true,
      switchValue: emailNotifications,
      onSwitchChange: setEmailNotifications,
    },
    {
      id: 'sms',
      title: 'SMS Notifications',
      subtitle: 'Receive notifications via SMS',
      icon: 'chatbubble-outline',
      showSwitch: true,
      switchValue: smsNotifications,
      onSwitchChange: setSmsNotifications,
    },
  ];

  const notificationTypes = [
    {
      id: 'orders',
      title: 'Order Updates',
      subtitle: 'Notifications about order status changes',
      icon: 'bag-outline',
      showSwitch: true,
      switchValue: orderUpdates,
      onSwitchChange: setOrderUpdates,
    },
    {
      id: 'delivery',
      title: 'Delivery Updates',
      subtitle: 'Notifications about delivery status',
      icon: 'bicycle-outline',
      showSwitch: true,
      switchValue: deliveryUpdates,
      onSwitchChange: setDeliveryUpdates,
    },
    {
      id: 'payment',
      title: 'Payment Reminders',
      subtitle: 'Reminders for pending payments',
      icon: 'card-outline',
      showSwitch: true,
      switchValue: paymentReminders,
      onSwitchChange: setPaymentReminders,
    },
    {
      id: 'marketing',
      title: 'Marketing Emails',
      subtitle: 'Promotional offers and updates',
      icon: 'megaphone-outline',
      showSwitch: true,
      switchValue: marketingEmails,
      onSwitchChange: setMarketingEmails,
    },
    {
      id: 'reports',
      title: 'Weekly Reports',
      subtitle: 'Weekly business performance reports',
      icon: 'bar-chart-outline',
      showSwitch: true,
      switchValue: weeklyReports,
      onSwitchChange: setWeeklyReports,
    },
  ];

  const recentNotifications = [
    {
      id: '1',
      title: 'Order #12345 Delivered',
      message: 'Your order has been successfully delivered to John Doe',
      time: '2 hours ago',
      type: 'success',
      read: false,
    },
    {
      id: '2',
      title: 'Payment Received',
      message: 'Payment of ₹1,500 received for order #12344',
      time: '4 hours ago',
      type: 'info',
      read: true,
    },
    {
      id: '3',
      title: 'New Order Received',
      message: 'New order #12346 from Jane Smith',
      time: '6 hours ago',
      type: 'info',
      read: false,
    },
    {
      id: '4',
      title: 'Delivery Boy Assigned',
      message: 'Rajesh Kumar has been assigned to order #12345',
      time: '8 hours ago',
      type: 'warning',
      read: true,
    },
    {
      id: '5',
      title: 'Weekly Report Available',
      message: 'Your weekly business report is ready',
      time: '1 day ago',
      type: 'info',
      read: true,
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return COLORS.success;
      case 'info':
        return COLORS.info;
      case 'warning':
        return COLORS.warning;
      case 'error':
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };

  const renderOption = (option: any) => (
    <View key={option.id} style={styles.optionItem}>
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
      </View>
    </View>
  );

  const renderNotification = (notification: any) => (
    <TouchableOpacity key={notification.id} style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={[
          styles.notificationIcon,
          { backgroundColor: getNotificationColor(notification.type) + '20' }
        ]}>
          <Ionicons
            name={getNotificationIcon(notification.type) as any}
            size={20 * scale}
            color={getNotificationColor(notification.type)}
          />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={[
            styles.notificationTitle,
            !notification.read && styles.unreadNotification
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="checkmark-done" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Notification Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          <Text style={styles.sectionSubtitle}>Choose how you want to receive notifications</Text>
          {notificationSettings.map(renderOption)}
        </View>

        {/* Notification Types */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <Text style={styles.sectionSubtitle}>Select which types of notifications you want to receive</Text>
          {notificationTypes.map(renderOption)}
        </View>

        {/* Recent Notifications */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Notifications</Text>
            <TouchableOpacity style={styles.markAllBtn}>
              <Text style={styles.markAllBtnText}>Mark All Read</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Your recent notification history</Text>
          {recentNotifications.map(renderNotification)}
        </View>

        {/* Notification Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Ionicons name="analytics" size={24 * scale} color={COLORS.primary} />
            <Text style={styles.statsTitle}>Notification Statistics</Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Unread</Text>
            </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4 * scale,
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
  markAllBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * scale,
    paddingVertical: 6 * scale,
    borderRadius: 16 * scale,
  },
  markAllBtnText: {
    color: '#fff',
    fontSize: 12 * scale,
    fontFamily: FONTS.semi,
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40 * scale,
    height: 40 * scale,
    borderRadius: 20 * scale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  unreadNotification: {
    fontFamily: FONTS.bold,
  },
  notificationMessage: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 2 * scale,
  },
  notificationTime: {
    fontSize: 10 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  unreadDot: {
    width: 8 * scale,
    height: 8 * scale,
    borderRadius: 4 * scale,
    backgroundColor: COLORS.primary,
  },
  statsCard: {
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
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  statsTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4 * scale,
  },
  statLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
  },
});

export default Notifications;
