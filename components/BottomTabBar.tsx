import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 320;

const COLORS = {
  primary: '#2EC4D6',
  text: '#0A174E',
  surface: '#FFFFFF',
  border: '#eee',
};

const FONTS = {
  semi: 'ManropeSemiBold',
};

interface BottomTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: 'home',
      iconType: 'Ionicons' as const,
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: 'people',
      iconType: 'Ionicons' as const,
    },
    {
      id: 'add',
      label: 'Add',
      icon: 'add',
      iconType: 'Ionicons' as const,
      isSpecial: true,
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: 'checkmark-circle-outline',
      iconType: 'Ionicons' as const,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: 'user',
      iconType: 'FontAwesome' as const,
    },
  ];

  const renderIcon = (iconType: string, iconName: string, size: number, color: string) => {
    if (iconType === 'FontAwesome') {
      return <FontAwesome name={iconName as any} size={size} color={color} />;
    }
    return <Ionicons name={iconName as any} size={size} color={color} />;
  };

  return (
    <View
      style={[
        styles.bottomBar,
        {
          paddingBottom: (insets.bottom || 10 * scale),
          height: 54 * scale + (insets.bottom || 10 * scale),
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isSpecial = tab.isSpecial;

        if (isSpecial) {
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.addBtn}
              onPress={() => onTabPress(tab.id)}
            >
              <Ionicons name="add" size={28 * scale} color="#fff" />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.bottomIcon}
            onPress={() => onTabPress(tab.id)}
          >
            {renderIcon(
              tab.iconType,
              tab.icon,
              20 * scale,
              isActive ? COLORS.primary : COLORS.text
            )}
            <Text
              style={[
                styles.bottomLabel,
                { color: isActive ? COLORS.primary : COLORS.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 12 * scale,
    paddingVertical: 10 * scale,
    height: 64 * scale,
    zIndex: 10,
  },
  bottomIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56 * scale,
    paddingHorizontal: 4 * scale,
  },
  bottomLabel: {
    marginTop: 3 * scale,
    fontSize: 11 * scale,
    fontFamily: FONTS.semi,
  },
  addBtn: {
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8 * scale,
    marginTop: -28 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default BottomTabBar;
