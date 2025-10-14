import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Linking, Alert } from 'react-native';
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

const HelpSupport = () => {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportOptions = [
    {
      id: 'chat',
      title: 'Live Chat Support',
      subtitle: 'Chat with our support team',
      icon: 'chatbubble-outline',
      action: 'chat',
    },
    {
      id: 'email',
      title: 'Email Support',
      subtitle: 'support@medlives.com',
      icon: 'mail-outline',
      action: 'email',
    },
    {
      id: 'phone',
      title: 'Phone Support',
      subtitle: '+91 9876543210',
      icon: 'call-outline',
      action: 'phone',
    },
    {
      id: 'ticket',
      title: 'Submit Ticket',
      subtitle: 'Create a support ticket',
      icon: 'ticket-outline',
      action: 'ticket',
    },
  ];

  const faqData = [
    {
      id: '1',
      question: 'How do I add a new customer?',
      answer: 'To add a new customer, go to the Customers tab and tap the + button. Fill in the customer details including name, phone number, and address. You can also add customers while creating a new order.',
    },
    {
      id: '2',
      question: 'How do I track delivery status?',
      answer: 'You can track delivery status in the Delivery Management section. Assign delivery boys to orders and monitor their real-time status. The system will automatically update delivery status as orders progress.',
    },
    {
      id: '3',
      question: 'How do I manage my subscription?',
      answer: 'Go to Profile > Account & Subscription to view your current plan, billing information, and upgrade options. You can change your plan, update payment methods, and view billing history.',
    },
    {
      id: '4',
      question: 'How do I backup my data?',
      answer: 'Navigate to Profile > Security & Data > Data Backup to backup your data to the cloud. You can also enable automatic daily backups in the settings.',
    },
    {
      id: '5',
      question: 'How do I add delivery boys?',
      answer: 'Go to Profile > Delivery User & Management to add new delivery boys. You can assign roles (Admin, Manager, Delivery Boy) and track their performance.',
    },
    {
      id: '6',
      question: 'How do I change my password?',
      answer: 'Go to Profile > Security & Data > Change Password. Enter your current password and set a new secure password. We recommend using a strong password with at least 8 characters.',
    },
  ];

  const quickActions = [
    {
      id: 'guide',
      title: 'User Guide',
      subtitle: 'Complete app usage guide',
      icon: 'book-outline',
      action: 'guide',
    },
    {
      id: 'tutorial',
      title: 'Video Tutorials',
      subtitle: 'Watch step-by-step tutorials',
      icon: 'play-circle-outline',
      action: 'tutorial',
    },
    {
      id: 'community',
      title: 'Community Forum',
      subtitle: 'Connect with other users',
      icon: 'people-outline',
      action: 'community',
    },
    {
      id: 'feedback',
      title: 'Send Feedback',
      subtitle: 'Help us improve the app',
      icon: 'thumbs-up-outline',
      action: 'feedback',
    },
  ];

  const handleSupportAction = (action: string) => {
    switch (action) {
      case 'chat':
        Alert.alert('Live Chat', 'Connecting you to our support team...');
        break;
      case 'email':
        Linking.openURL('mailto:support@medlives.com?subject=Support Request');
        break;
      case 'phone':
        Linking.openURL('tel:+919876543210');
        break;
      case 'ticket':
        Alert.alert('Submit Ticket', 'Opening ticket submission form...');
        break;
      case 'guide':
        Alert.alert('User Guide', 'Opening user guide...');
        break;
      case 'tutorial':
        Alert.alert('Video Tutorials', 'Opening video tutorials...');
        break;
      case 'community':
        Alert.alert('Community Forum', 'Opening community forum...');
        break;
      case 'feedback':
        Alert.alert('Send Feedback', 'Opening feedback form...');
        break;
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderSupportOption = (option: any) => (
    <TouchableOpacity
      key={option.id}
      style={styles.supportOption}
      onPress={() => handleSupportAction(option.action)}
    >
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Ionicons
            name={option.icon as any}
            size={24 * scale}
            color={COLORS.primary}
          />
        </View>
        <View style={styles.optionInfo}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.muted} />
    </TouchableOpacity>
  );

  const renderFaqItem = (faq: any) => (
    <View key={faq.id} style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={() => toggleFaq(faq.id)}
      >
        <Text style={styles.faqQuestionText}>{faq.question}</Text>
        <Ionicons
          name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
          size={20 * scale}
          color={COLORS.primary}
        />
      </TouchableOpacity>
      {expandedFaq === faq.id && (
        <View style={styles.faqAnswer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );

  const renderQuickAction = (action: any) => (
    <TouchableOpacity
      key={action.id}
      style={styles.quickAction}
      onPress={() => handleSupportAction(action.action)}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons
          name={action.icon as any}
          size={24 * scale}
          color={COLORS.primary}
        />
      </View>
      <View style={styles.quickActionInfo}>
        <Text style={styles.quickActionTitle}>{action.title}</Text>
        <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="search" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Support Options */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <Text style={styles.sectionSubtitle}>Choose how you want to contact us</Text>
          {supportOptions.map(renderSupportOption)}
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Helpful resources and guides</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <Text style={styles.sectionSubtitle}>Find answers to common questions</Text>
          {faqData.map(renderFaqItem)}
        </View>

        {/* Contact Information */}
        <View style={styles.contactCard}>
          <View style={styles.contactHeader}>
            <Ionicons name="information-circle" size={24 * scale} color={COLORS.info} />
            <Text style={styles.contactTitle}>Contact Information</Text>
          </View>
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={16 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>support@medlives.com</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={16 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>+91 9876543210</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="time" size={16 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>Mon-Fri: 9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="location" size={16 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>Mumbai, Maharashtra, India</Text>
            </View>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionCard}>
          <Text style={styles.versionText}>App Version: 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 MedLives. All rights reserved.</Text>
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
  supportOption: {
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
    width: 48 * scale,
    height: 48 * scale,
    borderRadius: 24 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16 * scale,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: COLORS.chipBg,
    borderRadius: 12 * scale,
    padding: 16 * scale,
    marginBottom: 12 * scale,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48 * scale,
    height: 48 * scale,
    borderRadius: 24 * scale,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * scale,
  },
  quickActionInfo: {
    alignItems: 'center',
  },
  quickActionTitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 4 * scale,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16 * scale,
  },
  faqQuestionText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    flex: 1,
    marginRight: 12 * scale,
  },
  faqAnswer: {
    paddingBottom: 16 * scale,
  },
  faqAnswerText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    lineHeight: 20 * scale,
  },
  contactCard: {
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
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  contactTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  contactInfo: {
    marginLeft: 8 * scale,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  contactText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  versionCard: {
    alignItems: 'center',
    marginTop: 16 * scale,
    marginBottom: 80 * scale,
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

export default HelpSupport;
