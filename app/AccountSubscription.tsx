import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const AccountSubscription = () => {
  const router = useRouter();
  const [currentPlan] = useState('standard');
  const [renewalDate] = useState('2024-12-15');
  const [tenantId] = useState('TENANT-12345');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: 'month',
      features: [
        'Up to 100 orders per month',
        'Basic customer management',
        'Standard support',
        'Mobile app access',
      ],
      limitations: [
        'Limited to 1 user',
        'Basic reporting',
        'No API access',
      ],
      isCurrent: false,
      isPopular: false,
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '₹2,999',
      period: 'month',
      features: [
        'Up to 1,000 orders per month',
        'Advanced customer management',
        'Priority support',
        'Advanced reporting & analytics',
        'Multi-user access (up to 5 users)',
        'API access',
        'Custom branding',
      ],
      limitations: [],
      isCurrent: true,
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹4,999',
      period: 'month',
      features: [
        'Unlimited orders',
        'Full customer management suite',
        '24/7 premium support',
        'Advanced analytics & insights',
        'Unlimited users',
        'Full API access',
        'White-label solution',
        'Custom integrations',
        'Dedicated account manager',
      ],
      limitations: [],
      isCurrent: false,
      isPopular: false,
    },
  ];

  const renderPlanCard = (plan: any) => (
    <View key={plan.id} style={[
      styles.planCard,
      plan.isCurrent && styles.currentPlanCard,
      plan.isPopular && styles.popularPlanCard,
    ]}>
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>Most Popular</Text>
        </View>
      )}
      {plan.isCurrent && (
        <View style={styles.currentBadge}>
          <Text style={styles.currentBadgeText}>Current Plan</Text>
        </View>
      )}
      
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{plan.price}</Text>
          <Text style={styles.period}>/{plan.period}</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        {plan.features.map((feature: string, index: number) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16 * scale} color={COLORS.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {plan.limitations.length > 0 && (
        <View style={styles.limitationsContainer}>
          <Text style={styles.limitationsTitle}>Limitations:</Text>
          {plan.limitations.map((limitation: string, index: number) => (
            <View key={index} style={styles.limitationItem}>
              <Ionicons name="close-circle" size={16 * scale} color={COLORS.muted} />
              <Text style={styles.limitationText}>{limitation}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.selectButton,
          plan.isCurrent && styles.currentButton,
          plan.isPopular && styles.popularButton,
        ]}
        disabled={plan.isCurrent}
      >
        <Text style={[
          styles.selectButtonText,
          plan.isCurrent && styles.currentButtonText,
          plan.isPopular && styles.popularButtonText,
        ]}>
          {plan.isCurrent ? 'Current Plan' : 'Upgrade'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24 * scale} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account & Subscription</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionBtn}>
            <Ionicons name="refresh" size={20 * scale} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Current Plan Info */}
        <View style={styles.currentPlanCard}>
          <View style={styles.currentPlanHeader}>
            <Ionicons name="card" size={24 * scale} color={COLORS.primary} />
            <Text style={styles.currentPlanTitle}>Current Plan</Text>
          </View>
          <Text style={styles.currentPlanName}>Standard Plan</Text>
          <Text style={styles.currentPlanPrice}>₹2,999/month</Text>
          <View style={styles.renewalInfo}>
            <Text style={styles.renewalLabel}>Next billing date:</Text>
            <Text style={styles.renewalDate}>{renewalDate}</Text>
          </View>
        </View>

        {/* Tenant Information */}
        <View style={styles.tenantCard}>
          <View style={styles.tenantHeader}>
            <Ionicons name="business" size={24 * scale} color={COLORS.info} />
            <Text style={styles.tenantTitle}>Tenant Information</Text>
          </View>
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantLabel}>Tenant ID:</Text>
            <Text style={styles.tenantValue}>{tenantId}</Text>
          </View>
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantLabel}>Account Type:</Text>
            <Text style={styles.tenantValue}>Business Account</Text>
          </View>
          <View style={styles.tenantInfo}>
            <Text style={styles.tenantLabel}>Created:</Text>
            <Text style={styles.tenantValue}>January 15, 2024</Text>
          </View>
        </View>

        {/* Available Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Available Plans</Text>
          <Text style={styles.sectionSubtitle}>Choose the plan that best fits your needs</Text>
          
          {plans.map(renderPlanCard)}
        </View>

        {/* Billing History */}
        <View style={styles.billingCard}>
          <View style={styles.billingHeader}>
            <Ionicons name="receipt" size={24 * scale} color={COLORS.warning} />
            <Text style={styles.billingTitle}>Billing History</Text>
          </View>
          <TouchableOpacity style={styles.billingButton}>
            <Text style={styles.billingButtonText}>View Billing History</Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card-outline" size={24 * scale} color={COLORS.success} />
            <Text style={styles.paymentTitle}>Payment Methods</Text>
          </View>
          <TouchableOpacity style={styles.paymentButton}>
            <Text style={styles.paymentButtonText}>Manage Payment Methods</Text>
            <Ionicons name="chevron-forward" size={16 * scale} color={COLORS.primary} />
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
  currentPlanCard: {
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
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  currentPlanTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  currentPlanName: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 4 * scale,
  },
  currentPlanPrice: {
    fontSize: 18 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 12 * scale,
  },
  renewalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    padding: 12 * scale,
    borderRadius: 8 * scale,
  },
  renewalLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  renewalDate: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
  tenantCard: {
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
  tenantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  tenantTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  tenantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8 * scale,
  },
  tenantLabel: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
  },
  tenantValue: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
  plansSection: {
    marginTop: 16 * scale,
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
  planCard: {
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
    position: 'relative',
  },
  currentPlanCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  popularPlanCard: {
    borderColor: COLORS.warning,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8 * scale,
    right: 16 * scale,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 12 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 10 * scale,
    fontFamily: FONTS.bold,
  },
  currentBadge: {
    position: 'absolute',
    top: -8 * scale,
    left: 16 * scale,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 10 * scale,
    fontFamily: FONTS.bold,
  },
  planHeader: {
    marginBottom: 16 * scale,
    marginTop: 8 * scale,
  },
  planName: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  period: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginLeft: 4 * scale,
  },
  featuresContainer: {
    marginBottom: 16 * scale,
  },
  featuresTitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4 * scale,
  },
  featureText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    marginLeft: 8 * scale,
    flex: 1,
  },
  limitationsContainer: {
    marginBottom: 16 * scale,
  },
  limitationsTitle: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 8 * scale,
  },
  limitationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4 * scale,
  },
  limitationText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginLeft: 8 * scale,
    flex: 1,
  },
  selectButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12 * scale,
    borderRadius: 8 * scale,
    alignItems: 'center',
  },
  currentButton: {
    backgroundColor: COLORS.muted + '20',
  },
  popularButton: {
    backgroundColor: COLORS.warning,
  },
  selectButtonText: {
    fontSize: 16 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
  currentButtonText: {
    color: COLORS.muted,
  },
  popularButtonText: {
    color: '#fff',
  },
  billingCard: {
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
  billingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  billingTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  billingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    padding: 12 * scale,
    borderRadius: 8 * scale,
  },
  billingButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 * scale,
  },
  paymentTitle: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginLeft: 8 * scale,
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.chipBg,
    padding: 12 * scale,
    borderRadius: 8 * scale,
  },
  paymentButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
  },
});

export default AccountSubscription;
