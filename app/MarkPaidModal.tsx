import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../src/services/api';

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
};

const FONTS = {
  regular: 'ManropeRegular',
  semi: 'ManropeSemiBold',
  bold: 'ManropeBold',
};

interface MarkPaidModalProps {
  visible: boolean;
  order: any | null;
  onClose: () => void;
  onSuccess: (updatedOrder: any) => void;
}

export const MarkPaidModal: React.FC<MarkPaidModalProps> = ({ visible, order, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'cash' | 'upi' | 'other' | null>('cash');
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetState = () => {
    setMethod('cash');
    setImageData(null);
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose();
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is needed to capture payment proof.');
      return false;
    }
    return true;
  };

  const handleCapture = async () => {
    if (!(await requestCameraPermission())) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.6,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const uri = `data:${asset.type || 'image/jpeg'};base64,${asset.base64}`;
          setImageData(uri);
        } else if (asset.uri) {
          setImageData(asset.uri);
        }
      }
    } catch (e) {
      console.error('Failed to capture image', e);
      Alert.alert('Error', 'Could not open camera. Please try again.');
    }
  };

  const handleConfirm = async () => {
    if (!order || !order._id) {
      Alert.alert('Error', 'Order information is missing.');
      return;
    }

    if (!method) {
      Alert.alert('Select method', 'Please select a payment method.');
      return;
    }

    if (method === 'upi' && !imageData) {
      Alert.alert('Proof required', 'Please capture a payment proof photo for UPI payments.');
      return;
    }

    try {
      setLoading(true);
      const payload: any = {
        status: 'paid',
        paymentMethod: method,
      };
      if (imageData) {
        payload.paymentProofImageUrl = imageData;
      }

      const res = await apiService.updateOrderStatus(order._id, payload);
      if (res.success && (res.data as any)?.data) {
        const updated = (res.data as any).data;
        onSuccess(updated);
        resetState();
        onClose();
      } else {
        Alert.alert('Error', res.error || res.message || 'Failed to update order status');
      }
    } catch (e) {
      console.error('Failed to mark paid', e);
      Alert.alert('Error', 'Failed to mark order as paid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible || !order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheet}>
          <Text style={styles.title}>Mark as Paid</Text>
          <Text style={styles.subtitle}>Choose how the payment was received for Order #{order.orderId}</Text>

          <View style={styles.methodsRow}>
            <TouchableOpacity
              style={[styles.methodCard, method === 'cash' && styles.methodCardActive]}
              onPress={() => setMethod('cash')}
            >
              <Ionicons name="cash-outline" size={22 * scale} color={method === 'cash' ? '#fff' : COLORS.text} />
              <Text style={[styles.methodLabel, method === 'cash' && styles.methodLabelActive]}>Cash</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, method === 'upi' && styles.methodCardActive]}
              onPress={() => setMethod('upi')}
            >
              <Ionicons name="qr-code-outline" size={22 * scale} color={method === 'upi' ? '#fff' : COLORS.text} />
              <Text style={[styles.methodLabel, method === 'upi' && styles.methodLabelActive]}>UPI / GPay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.methodCard, method === 'other' && styles.methodCardActive]}
              onPress={() => setMethod('other')}
            >
              <Ionicons name="card-outline" size={22 * scale} color={method === 'other' ? '#fff' : COLORS.text} />
              <Text style={[styles.methodLabel, method === 'other' && styles.methodLabelActive]}>Other</Text>
            </TouchableOpacity>
          </View>

          {method === 'upi' && (
            <View style={styles.proofSection}>
              <Text style={styles.sectionTitle}>Payment Proof</Text>
              <Text style={styles.sectionHint}>Capture a clear photo of the payment confirmation or customer screen.</Text>

              <View style={styles.proofRow}>
                <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={loading}>
                  <Ionicons name="camera" size={18 * scale} color="#fff" />
                  <Text style={styles.captureText}>{imageData ? 'Retake Photo' : 'Capture Proof'}</Text>
                </TouchableOpacity>

                {imageData && (
                  <View style={styles.previewWrapper}>
                    <Image source={{ uri: imageData }} style={styles.previewImage} />
                  </View>
                )}
              </View>
            </View>
          )}

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleClose} disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={18 * scale} color="#fff" />
                  <Text style={styles.confirmText}>Confirm Paid</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20 * scale,
    borderTopRightRadius: 20 * scale,
    padding: 16 * scale,
  },
  title: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  subtitle: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 12 * scale,
  },
  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12 * scale,
  },
  methodCard: {
    flex: 1,
    marginHorizontal: 4 * scale,
    paddingVertical: 10 * scale,
    borderRadius: 14 * scale,
    backgroundColor: COLORS.chipBg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  methodCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  methodLabel: {
    marginTop: 6 * scale,
    fontSize: 11.5 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    textAlign: 'center',
  },
  methodLabelActive: {
    color: '#fff',
  },
  proofSection: {
    marginTop: 8 * scale,
    marginBottom: 8 * scale,
  },
  sectionTitle: {
    fontSize: 13 * scale,
    fontFamily: FONTS.semi,
    color: COLORS.text,
    marginBottom: 4 * scale,
  },
  sectionHint: {
    fontSize: 11 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 8 * scale,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 8 * scale,
    paddingHorizontal: 14 * scale,
    borderRadius: 16 * scale,
  },
  captureText: {
    color: '#fff',
    fontFamily: FONTS.semi,
    fontSize: 12 * scale,
    marginLeft: 6 * scale,
  },
  previewWrapper: {
    marginLeft: 12 * scale,
    borderRadius: 10 * scale,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 64 * scale,
    height: 64 * scale,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16 * scale,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 6 * scale,
    paddingVertical: 10 * scale,
    borderRadius: 14 * scale,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelText: {
    fontFamily: FONTS.semi,
    fontSize: 13 * scale,
    color: COLORS.text,
  },
  confirmBtn: {
    flex: 1,
    marginLeft: 6 * scale,
    paddingVertical: 10 * scale,
    borderRadius: 14 * scale,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6 * scale,
  },
  confirmText: {
    fontFamily: FONTS.semi,
    fontSize: 13 * scale,
    color: '#fff',
  },
});

export default MarkPaidModal;
