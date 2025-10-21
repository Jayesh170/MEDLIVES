import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const scale = width / 320;

type OrderSuccessModalProps = {
  visible: boolean;
  orderId?: string | number;
  customerName?: string;
  onClose: () => void;
};

export default function OrderSuccessModal({ visible, orderId, customerName, onClose }: OrderSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Order Created Successfully</Text>
          <View style={styles.circle}>
            <Ionicons name="checkmark" size={36 * scale} color="#fff" />
          </View>
          {!!orderId && (
            <Text style={styles.metaText}>Order ID : <Text style={styles.metaValue}>{String(orderId)}</Text></Text>
          )}
          {!!customerName && (
            <Text style={[styles.metaText, { marginTop: 2 * scale }]}>Customer Name : <Text style={styles.metaValue}>{customerName}</Text></Text>
          )}
          <TouchableOpacity style={styles.primaryBtn} onPress={onClose} activeOpacity={0.9}>
            <Text style={styles.primaryBtnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16 * scale,
  },
  card: {
    width: Math.min(300 * scale, width - 32 * scale),
    backgroundColor: '#ECEFF1',
    borderRadius: 16 * scale,
    paddingVertical: 18 * scale,
    paddingHorizontal: 16 * scale,
    borderWidth: 2,
    borderColor: '#2EC4D6',
    alignItems: 'center',
  },
  title: {
    fontSize: 16 * scale,
    fontWeight: 'bold',
    color: '#2A2A2A',
    marginBottom: 12 * scale,
  },
  circle: {
    width: 80 * scale,
    height: 80 * scale,
    borderRadius: 40 * scale,
    backgroundColor: '#2EC4D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12 * scale,
  },
  metaText: {
    fontSize: 13 * scale,
    color: '#222',
  },
  metaValue: {
    fontWeight: 'bold',
    color: '#222',
  },
  primaryBtn: {
    marginTop: 14 * scale,
    backgroundColor: '#2EC4D6',
    paddingVertical: 10 * scale,
    paddingHorizontal: 24 * scale,
    borderRadius: 18 * scale,
    minWidth: 180 * scale,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13 * scale,
  },
});


