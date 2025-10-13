import React, { useState } from 'react';
import { View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from './HomeScreen';
import CustomersScreen from './CustomersScreen';
import CompletedScreen from './CompletedScreen';
import ProfileScreen from './ProfileScreen';
import AddOrderFixed from './AddOrderFixed';

const MainNavigator = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  const handleTabPress = (tab: string) => {
    if (tab === 'add') {
      setShowAddOrder(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddOrder = (newOrder: any) => {
    // For now, just close the modal and increment count
    // The HomeScreen will handle its own state
    setShowAddOrder(false);
    setOrdersCount(prev => prev + 1);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'customers':
        return <CustomersScreen />;
      case 'completed':
        return <CompletedScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderActiveScreen()}
      
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      <AddOrderFixed
        visible={showAddOrder}
        onClose={() => setShowAddOrder(false)}
        onAddOrder={handleAddOrder}
        existingOrdersCount={ordersCount}
      />
    </View>
  );
};

export default MainNavigator;
