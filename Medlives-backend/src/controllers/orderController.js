import Order from '../models/Order.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const payload = req.body || {};
    // Auto-generate orderId if not provided
    if (!payload.orderId) {
      // Use count + 1 as simple sequential fallback
      const count = await Order.countDocuments();
      payload.orderId = String(count + 1);
    }

    const created = await Order.create(payload);
    return res.status(201).json({ success: true, message: 'Order created', data: created });
  } catch (err) {
    console.error('createOrder error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to create order' });
  }
};

// Get all orders (optionally filter by date/status/search)
export const getOrders = async (req, res) => {
  try {
    const { date, status, q } = req.query;
    const filter = {};
    if (date) filter.date = date; // expects dd/MM/yy
    if (status && status !== 'all') filter.status = status;

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [
        { orderId: regex },
        { customerName: regex },
        { address: regex },
        { 'medications.name': regex },
      ];
    }

    const items = await Order.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, data: items });
  } catch (err) {
    console.error('getOrders error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch orders' });
  }
};

// Get single order by id
export const getOrderById = async (req, res) => {
  try {
    const item = await Order.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, data: item });
  } catch (err) {
    console.error('getOrderById error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch order' });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body; // paid | credit | pending
    const item = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, message: 'Status updated', data: item });
  } catch (err) {
    console.error('updateOrderStatus error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update status' });
  }
};
