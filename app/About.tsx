import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  chipBg: '#e0f7fa',
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

const About = () => {
  const router = useRouter();

  const appInfo = {
    name: 'MedLives',
    version: '1.0.0',
    build: '2024.01.15',
    releaseDate: 'January 15, 2024',
    developer: 'MedLives Team',
    website: 'https://medlives.com',
    email: 'info@medlives.com',
    phone: '+91 9876543210',
  };

  const features = [
    'Customer Management',
    'Order Processing',
    'Delivery Tracking',
    'Payment Management',
    'Analytics & Reports',
    'Multi-user Support',
    'Cloud Backup',
    'Real-time Notifications',
  ];

  const teamMembers = [
    {
      name: 'Dr. Omkar Medical',
      role: 'Founder & CEO',
      email: 'omkar@medlives.com',
    },
    {
      name: 'Tech Team',
      role: 'Development Team',
      email: 'tech@medlives.com',
    },
    {
      name: 'Support Team',
      role: 'Customer Support',
      email: 'support@medlives.com',
    },
  ];

  const socialLinks = [
    {
      name: 'Website',
      url: 'https://medlives.com',
      icon: 'globe-outline',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/medlives',
      icon: 'logo-linkedin',
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/medlives',
      icon: 'logo-twitter',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/medlives',
      icon: 'logo-facebook',
    },
  ];

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderFeature = (feature: string, index: number) => (
    <View key={index} style={styles.featureItem}>
      <Ionicons name="checkmark-circle" size={16 * scale} color={COLORS.success} />
      <Text style={styles.featureText}>{feature}</Text>
    </View>
  );

  const renderTeamMember = (member: any, index: number) => (
    <View key={index} style={styles.teamMember}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>{member.name.charAt(0)}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.name}</Text>
        <Text style={styles.memberRole}>{member.role}</Text>
        <TouchableOpacity onPress={() => handleEmailPress(member.email)}>
          <Text style={styles.memberEmail}>{member.email}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSocialLink = (link: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.socialLink}
      onPress={() => handleLinkPress(link.url)}
    >
      <Ionicons name={link.icon as any} size={24 * scale} color={COLORS.primary} />
      <Text style={styles.socialLinkText}>{link.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="share" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* App Logo and Info */}
        <View style={styles.appInfoCard}>
          <View style={styles.appLogo}>
            <Ionicons name="medical" size={48 * scale} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>{appInfo.name}</Text>
          <Text style={styles.appDescription}>
            A comprehensive medical order management system designed for healthcare professionals.
          </Text>
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version {appInfo.version}</Text>
            <Text style={styles.buildText}>Build {appInfo.build}</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.sectionSubtitle}>What makes MedLives special</Text>
          <View style={styles.featuresList}>
            {features.map(renderFeature)}
          </View>
        </View>

        {/* App Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>{appInfo.version}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>{appInfo.build}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Release Date</Text>
            <Text style={styles.infoValue}>{appInfo.releaseDate}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Developer</Text>
            <Text style={styles.infoValue}>{appInfo.developer}</Text>
          </View>
        </View>

        {/* Team */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          <Text style={styles.sectionSubtitle}>Meet the people behind MedLives</Text>
          {teamMembers.map(renderTeamMember)}
        </View>

        {/* Contact Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactInfo}>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleLinkPress(appInfo.website)}
            >
              <Ionicons name="globe" size={20 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>{appInfo.website}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handleEmailPress(appInfo.email)}
            >
              <Ionicons name="mail" size={20 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>{appInfo.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.contactItem}
              onPress={() => handlePhonePress(appInfo.phone)}
            >
              <Ionicons name="call" size={20 * scale} color={COLORS.primary} />
              <Text style={styles.contactText}>{appInfo.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Follow Us</Text>
          <Text style={styles.sectionSubtitle}>Stay connected with us</Text>
          <View style={styles.socialLinks}>
            {socialLinks.map(renderSocialLink)}
          </View>
        </View>

        {/* Legal Information */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.muted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Licenses</Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.muted} />
          </TouchableOpacity>
        </View>

        {/* Copyright */}
        <View style={styles.copyrightCard}>
          <Text style={styles.copyrightText}>
            © 2024 MedLives. All rights reserved.
          </Text>
          <Text style={styles.copyrightSubtext}>
            Made with ❤️ for healthcare professionals
          </Text>
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
  appInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20 * scale,
    padding: 24 * scale,
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
  appLogo: {
    width: 80 * scale,
    height: 80 * scale,
    borderRadius: 40 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16 * scale,
  },
  appName: {
    fontSize: 24 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  appDescription: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 20 * scale,
    marginBottom: 16 * scale,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.primary,
    marginRight: 8 * scale,
  },
  buildText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
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
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8 * scale,
  },
  featureText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
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
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  memberAvatar: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  memberAvatarText: {
    color: '#fff',
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  memberRole: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 4 * scale,
  },
  memberEmail: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.primary,
  },
  contactInfo: {
    marginTop: 8 * scale,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  contactText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 12 * scale,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8 * scale,
  },
  socialLink: {
    alignItems: 'center',
    flex: 1,
  },
  socialLinkText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginTop: 4 * scale,
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12 * scale,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legalText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  copyrightCard: {
    alignItems: 'center',
    marginTop: 16 * scale,
    marginBottom: 80 * scale,
  },
  copyrightText: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 4 * scale,
  },
  copyrightSubtext: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
});

export default About;
