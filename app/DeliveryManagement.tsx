import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
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

const DeliveryManagement = () => {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
  const [newDeliveryBoy, setNewDeliveryBoy] = useState({
    name: '',
    phone: '',
    email: '',
    role: 'delivery_boy',
    status: 'active',
  });

  const [deliveryBoys, setDeliveryBoys] = useState([
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '9876543210',
      email: 'rajesh@example.com',
      role: 'admin',
      status: 'active',
      totalDeliveries: 156,
      rating: 4.8,
      joinDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Suresh Patel',
      phone: '9876543211',
      email: 'suresh@example.com',
      role: 'manager',
      status: 'active',
      totalDeliveries: 89,
      rating: 4.6,
      joinDate: '2024-02-10',
    },
    {
      id: '3',
      name: 'Amit Singh',
      phone: '9876543212',
      email: 'amit@example.com',
      role: 'delivery_boy',
      status: 'offline',
      totalDeliveries: 45,
      rating: 4.4,
      joinDate: '2024-03-05',
    },
    {
      id: '4',
      name: 'Vikram Sharma',
      phone: '9876543213',
      email: 'vikram@example.com',
      role: 'delivery_boy',
      status: 'active',
      totalDeliveries: 78,
      rating: 4.7,
      joinDate: '2024-01-20',
    },
  ]);

  const roles = [
    { id: 'admin', name: 'Admin', color: COLORS.danger },
    { id: 'manager', name: 'Manager', color: COLORS.warning },
    { id: 'delivery_boy', name: 'Delivery Boy', color: COLORS.info },
  ];

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[2];
  };

  const handleAddDeliveryBoy = () => {
    if (!newDeliveryBoy.name || !newDeliveryBoy.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newBoy = {
      ...newDeliveryBoy,
      id: Date.now().toString(),
      totalDeliveries: 0,
      rating: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };

    setDeliveryBoys(prev => [...prev, newBoy]);
    setNewDeliveryBoy({ name: '', phone: '', email: '', role: 'delivery_boy', status: 'active' });
    setShowAddModal(false);
    Alert.alert('Success', 'Delivery boy added successfully!');
  };

  const handleEditDeliveryBoy = () => {
    if (!selectedDeliveryBoy) return;

    setDeliveryBoys(prev => 
      prev.map(boy => 
        boy.id === selectedDeliveryBoy.id 
          ? { ...boy, ...selectedDeliveryBoy }
          : boy
      )
    );
    setShowEditModal(false);
    setSelectedDeliveryBoy(null);
    Alert.alert('Success', 'Delivery boy updated successfully!');
  };

  const handleDeleteDeliveryBoy = (id: string) => {
    Alert.alert(
      'Delete Delivery Boy',
      'Are you sure you want to delete this delivery boy?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDeliveryBoys(prev => prev.filter(boy => boy.id !== id));
            Alert.alert('Success', 'Delivery boy deleted successfully!');
          }
        }
      ]
    );
  };

  const renderDeliveryBoy = ({ item }: any) => {
    const roleInfo = getRoleInfo(item.role);
    
    return (
      <View style={styles.deliveryBoyCard}>
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View style={styles.deliveryBoyInfo}>
            <Text style={styles.deliveryBoyName}>{item.name}</Text>
            <Text style={styles.deliveryBoyPhone}>{item.phone}</Text>
            <View style={styles.roleContainer}>
              <View style={[styles.roleBadge, { backgroundColor: roleInfo.color }]}>
                <Text style={styles.roleText}>{roleInfo.name}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'active' ? COLORS.success : COLORS.muted }
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => {
                setSelectedDeliveryBoy(item);
                setShowEditModal(true);
              }}
            >
              <Ionicons name="create-outline" size={16 * scale} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => handleDeleteDeliveryBoy(item.id)}
            >
              <Ionicons name="trash-outline" size={16 * scale} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.totalDeliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.joinDate}</Text>
            <Text style={styles.statLabel}>Joined</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderAddModal = () => (
    <Modal
      visible={showAddModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Delivery Boy</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter full name"
                value={newDeliveryBoy.name}
                onChangeText={(text) => setNewDeliveryBoy(prev => ({ ...prev, name: text }))}
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter phone number"
                value={newDeliveryBoy.phone}
                onChangeText={(text) => setNewDeliveryBoy(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter email address"
                value={newDeliveryBoy.email}
                onChangeText={(text) => setNewDeliveryBoy(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleSelector}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleOption,
                      newDeliveryBoy.role === role.id && styles.selectedRoleOption,
                      { borderColor: role.color }
                    ]}
                    onPress={() => setNewDeliveryBoy(prev => ({ ...prev, role: role.id }))}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      newDeliveryBoy.role === role.id && styles.selectedRoleOptionText,
                      { color: newDeliveryBoy.role === role.id ? role.color : COLORS.text }
                    ]}>
                      {role.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddDeliveryBoy}>
              <Text style={styles.addButtonText}>Add Delivery Boy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Delivery Boy</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24 * scale} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter full name"
                value={selectedDeliveryBoy?.name || ''}
                onChangeText={(text) => setSelectedDeliveryBoy(prev => ({ ...prev, name: text }))}
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter phone number"
                value={selectedDeliveryBoy?.phone || ''}
                onChangeText={(text) => setSelectedDeliveryBoy(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.inputBox}
                placeholder="Enter email address"
                value={selectedDeliveryBoy?.email || ''}
                onChangeText={(text) => setSelectedDeliveryBoy(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                placeholderTextColor="#BFC3C9"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Role</Text>
              <View style={styles.roleSelector}>
                {roles.map((role) => (
                  <TouchableOpacity
                    key={role.id}
                    style={[
                      styles.roleOption,
                      selectedDeliveryBoy?.role === role.id && styles.selectedRoleOption,
                      { borderColor: role.color }
                    ]}
                    onPress={() => setSelectedDeliveryBoy(prev => ({ ...prev, role: role.id }))}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      selectedDeliveryBoy?.role === role.id && styles.selectedRoleOptionText,
                      { color: selectedDeliveryBoy?.role === role.id ? role.color : COLORS.text }
                    ]}>
                      {role.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusSelector}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    selectedDeliveryBoy?.status === 'active' && styles.selectedStatusOption,
                    { borderColor: COLORS.success }
                  ]}
                  onPress={() => setSelectedDeliveryBoy(prev => ({ ...prev, status: 'active' }))}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedDeliveryBoy?.status === 'active' && styles.selectedStatusOptionText,
                    { color: selectedDeliveryBoy?.status === 'active' ? COLORS.success : COLORS.text }
                  ]}>
                    Active
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    selectedDeliveryBoy?.status === 'offline' && styles.selectedStatusOption,
                    { borderColor: COLORS.muted }
                  ]}
                  onPress={() => setSelectedDeliveryBoy(prev => ({ ...prev, status: 'offline' }))}
                >
                  <Text style={[
                    styles.statusOptionText,
                    selectedDeliveryBoy?.status === 'offline' && styles.selectedStatusOptionText,
                    { color: selectedDeliveryBoy?.status === 'offline' ? COLORS.muted : COLORS.text }
                  ]}>
                    Offline
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleEditDeliveryBoy}>
              <Text style={styles.addButtonText}>Update Delivery Boy</Text>
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
        <Text style={styles.headerTitle}>Delivery Management</Text>
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={20 * scale} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24 * scale} color={COLORS.primary} />
          <Text style={styles.statValue}>{deliveryBoys.length}</Text>
          <Text style={styles.statLabel}>Total Staff</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24 * scale} color={COLORS.success} />
          <Text style={styles.statValue}>{deliveryBoys.filter(boy => boy.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24 * scale} color={COLORS.muted} />
          <Text style={styles.statValue}>{deliveryBoys.filter(boy => boy.status === 'offline').length}</Text>
          <Text style={styles.statLabel}>Offline</Text>
        </View>
      </View>

      {/* Delivery Boys List */}
      <FlatList
        data={deliveryBoys}
        keyExtractor={item => item.id}
        renderItem={renderDeliveryBoy}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {renderAddModal()}
      {renderEditModal()}
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
  addBtn: {
    backgroundColor: COLORS.primaryAlt,
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 20 * scale,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16 * scale,
    paddingVertical: 16 * scale,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12 * scale,
    padding: 16 * scale,
    alignItems: 'center',
    marginHorizontal: 4 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: 20 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 8 * scale,
    marginBottom: 4 * scale,
  },
  statLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16 * scale,
    paddingBottom: 80 * scale,
  },
  deliveryBoyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16 * scale,
    padding: 16 * scale,
    marginBottom: 12 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12 * scale,
  },
  avatar: {
    width: 50 * scale,
    height: 50 * scale,
    borderRadius: 25 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12 * scale,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18 * scale,
    fontFamily: FONTS.bold,
  },
  deliveryBoyInfo: {
    flex: 1,
  },
  deliveryBoyName: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2 * scale,
  },
  deliveryBoyPhone: {
    fontSize: 14 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
    marginBottom: 8 * scale,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
    marginRight: 8 * scale,
  },
  roleText: {
    fontSize: 10 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
  statusBadge: {
    paddingHorizontal: 8 * scale,
    paddingVertical: 4 * scale,
    borderRadius: 12 * scale,
  },
  statusText: {
    fontSize: 10 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8 * scale,
    marginLeft: 4 * scale,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8 * scale,
    paddingTop: 12 * scale,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16 * scale,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    marginBottom: 2 * scale,
  },
  statLabel: {
    fontSize: 12 * scale,
    fontFamily: FONTS.regular,
    color: COLORS.muted,
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
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  roleOption: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 20 * scale,
    borderWidth: 1,
    marginRight: 8 * scale,
    marginBottom: 8 * scale,
  },
  selectedRoleOption: {
    backgroundColor: COLORS.chipBg,
  },
  roleOptionText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
  },
  selectedRoleOptionText: {
    color: COLORS.primary,
  },
  statusSelector: {
    flexDirection: 'row',
  },
  statusOption: {
    paddingHorizontal: 16 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 20 * scale,
    borderWidth: 1,
    marginRight: 8 * scale,
  },
  selectedStatusOption: {
    backgroundColor: COLORS.chipBg,
  },
  statusOptionText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
  },
  selectedStatusOptionText: {
    color: COLORS.primary,
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
  addButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 12 * scale,
    borderRadius: 12 * scale,
    alignItems: 'center',
    marginLeft: 8 * scale,
  },
  addButtonText: {
    fontSize: 14 * scale,
    fontFamily: FONTS.semi,
    color: '#fff',
  },
});

export default DeliveryManagement;
