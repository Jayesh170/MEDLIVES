import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const scale = width / 320;

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onProceedToLogin: () => void;
  data: {
    tenantCode: number;
    ownerUserId: number;
    password: string;
    ownerName: string;
    businessName: string;
  };
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  onProceedToLogin,
  data,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Welcome Message */}
          <Text style={styles.welcomeText}>
            Welcome Mr. {data.ownerName}
          </Text>

          {/* Success Circle */}
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40 * scale} color="#fff" />
          </View>

          {/* Credentials */}
          <View style={styles.credentialsContainer}>
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Tenant Code : </Text>
              <Text style={styles.credentialValue}>{data.tenantCode}</Text>
            </View>
            
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>User ID : </Text>
              <Text style={styles.credentialValue}>{data.ownerUserId}</Text>
            </View>
            
            <View style={styles.credentialRow}>
              <Text style={styles.credentialLabel}>Password : </Text>
              <Text style={styles.credentialValue}>{data.password}</Text>
            </View>
          </View>

          {/* Proceed To Login Button */}
          <TouchableOpacity style={styles.proceedButton} onPress={onProceedToLogin}>
            <Text style={styles.proceedButtonText}>Proceed To Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20 * scale,
  },
  modalContainer: {
    backgroundColor: "rgba(45, 55, 72, 0.95)",
    borderRadius: 20 * scale,
    padding: 30 * scale,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4ECDC4",
    minWidth: 300 * scale,
    maxWidth: 350 * scale,
    backdropFilter: "blur(10px)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 18 * scale,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20 * scale,
    fontFamily: "ManropeBold",
  },
  successCircle: {
    width: 80 * scale,
    height: 80 * scale,
    borderRadius: 40 * scale,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25 * scale,
  },
  credentialsContainer: {
    width: "100%",
    marginBottom: 25 * scale,
  },
  credentialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8 * scale,
  },
  credentialLabel: {
    fontSize: 14 * scale,
    color: "#E2E8F0",
    fontFamily: "ManropeSemiBold",
  },
  credentialValue: {
    fontSize: 14 * scale,
    color: "#4ECDC4",
    fontWeight: "bold",
    fontFamily: "ManropeBold",
  },
  proceedButton: {
    backgroundColor: "#4ECDC4",
    paddingVertical: 12 * scale,
    paddingHorizontal: 30 * scale,
    borderRadius: 25 * scale,
    minWidth: 200 * scale,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16 * scale,
    fontWeight: "bold",
    fontFamily: "ManropeBold",
  },
});

export default SuccessModal;
