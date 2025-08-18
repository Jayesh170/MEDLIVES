import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Medication {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  orderId: string;
  address: string;
  contactNumber: string;
  customerName: string;
  society: string; // Added society field for filtering
  medications: Medication[];
  totalAmount: number;
  discount: number;
  discountPercent: number;
  payableAmount: number;
  status: 'pending' | 'paid' | 'credit';
}

class DatabaseService {
  private static instance: DatabaseService;
  private readonly ORDERS_KEY = 'orders';

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Get all orders from AsyncStorage
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersJson = await AsyncStorage.getItem(this.ORDERS_KEY);
      if (ordersJson) {
        return JSON.parse(ordersJson);
      }
      return [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  // Save a new order
  async addOrder(order: Order): Promise<boolean> {
    try {
      const orders = await this.getAllOrders();
      const newOrders = [order, ...orders];
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(newOrders));
      return true;
    } catch (error) {
      console.error('Error adding order:', error);
      return false;
    }
  }

  // Update an existing order
  async updateOrder(orderId: string, updatedOrder: Partial<Order>): Promise<boolean> {
    try {
      const orders = await this.getAllOrders();
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...updatedOrder };
        await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  }

  // Delete an order
  async deleteOrder(orderId: string): Promise<boolean> {
    try {
      const orders = await this.getAllOrders();
      const filteredOrders = orders.filter(order => order.id !== orderId);
      await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(filteredOrders));
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }

  // Get orders by date
  async getOrdersByDate(date: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => order.date === date);
    } catch (error) {
      console.error('Error getting orders by date:', error);
      return [];
    }
  }

  // Get orders by society
  async getOrdersBySociety(society: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => order.society === society);
    } catch (error) {
      console.error('Error getting orders by society:', error);
      return [];
    }
  }

  // Get orders by date and society
  async getOrdersByDateAndSociety(date: string, society?: string): Promise<Order[]> {
    try {
      const orders = await this.getAllOrders();
      return orders.filter(order => {
        const matchesDate = order.date === date;
        const matchesSociety = !society || order.society === society;
        return matchesDate && matchesSociety;
      });
    } catch (error) {
      console.error('Error getting orders by date and society:', error);
      return [];
    }
  }

  // Initialize with sample data (for first-time use)
  async initializeSampleData(): Promise<void> {
    try {
      const existingOrders = await this.getAllOrders();
      if (existingOrders.length === 0) {
        const sampleOrders: Order[] = [
          {
            id: '1',
            date: '19/11/24',
            orderId: '1',
            address: 'F-101 Shantinagar',
            contactNumber: '8888133849',
            customerName: 'JAYESH DANGI',
            society: 'Shantinagar',
            medications: [
              { name: 'Dolo', qty: 2, price: 150 },
              { name: 'Cyclopalm', qty: 1, price: 250 },
              { name: 'Manforce-Family-Pack', qty: 1, price: 650 },
            ],
            totalAmount: 1100,
            discount: 165,
            discountPercent: 15,
            payableAmount: 935,
            status: 'paid',
          },
        ];
        await AsyncStorage.setItem(this.ORDERS_KEY, JSON.stringify(sampleOrders));
      }
    } catch (error) {
      console.error('Error initializing sample data:', error);
    }
  }

  // Clear all orders (useful for testing)
  async clearAllOrders(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(this.ORDERS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing orders:', error);
      return false;
    }
  }
}

export default DatabaseService;