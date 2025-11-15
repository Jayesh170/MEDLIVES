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
      label: 'Completed Orders',
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

  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <View
      style={[
        styles.bottomBar,
        {
          paddingBottom: bottomPadding,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isSpecial = tab.isSpecial;

        if (isSpecial) {
          return (
            <View key={tab.id} style={styles.addBtnContainer}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => onTabPress(tab.id)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={28 * scale} color="#fff" />
              </TouchableOpacity>
            </View>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.bottomIcon}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {renderIcon(
              tab.iconType,
              tab.icon,
              22 * scale,
              isActive ? COLORS.primary : COLORS.text
            )}
            <Text
              style={[
                styles.bottomLabel,
                { color: isActive ? COLORS.primary : COLORS.text },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
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
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: 4,
    paddingTop: 6 * scale,
    minHeight: 58 * scale,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4 * scale,
    paddingHorizontal: 2,
    minWidth: 0,
  },
  bottomLabel: {
    marginTop: 3 * scale,
    fontSize: Math.max(9 * scale, 10),
    fontFamily: FONTS.semi,
    textAlign: 'center',
    minHeight: 14 * scale,
  },
  addBtnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    paddingHorizontal: 2,
    minWidth: 0,
  },
  addBtn: {
    width: 56 * scale,
    height: 56 * scale,
    borderRadius: 28 * scale,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22 * scale,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default BottomTabBar;
