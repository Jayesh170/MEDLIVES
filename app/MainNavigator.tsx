import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from './HomeScreen';
import CustomersScreen from './CustomersScreen';
import CompletedScreen from './CompletedScreen';
import ProfileScreen from './ProfileScreen';
import AddOrderFixed from './AddOrderFixed';
import CustomerDetails from './CustomerDetails';

const MainNavigator = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const homeScreenRef = useRef<any>(null);

  const handleTabPress = (tab: string) => {
    if (tab === 'add') {
      setShowAddOrder(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleAddOrder = (newOrder: any) => {
    // Pass the order to HomeScreen for handling
    if (homeScreenRef.current && homeScreenRef.current.handleAddOrder) {
      homeScreenRef.current.handleAddOrder(newOrder);
    }
    setShowAddOrder(false);
    setOrdersCount(prev => prev + 1);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen ref={homeScreenRef} />;
      case 'customers':
        return <CustomersScreen />;
      case 'completed':
        return <CompletedScreen onBackPress={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen ref={homeScreenRef} />;
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