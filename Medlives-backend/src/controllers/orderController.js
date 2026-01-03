import Order from '../models/Order.js';
import Counter from '../models/Counter.js';
import { kafkaProducer } from '../services/kafkaProducer.js';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const payload = req.body || {};
    // Auto-generate orderId using atomic counter if not provided
    if (!payload.orderId) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'orderId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      payload.orderId = String(counter.seq);
    }

    // Ensure date in dd/MM/yy format if not provided
    if (!payload.date) {
      const d = new Date();
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      payload.date = `${dd}/${mm}/${yy}`;
    }

    // Attach tenantCode from authenticated user so orders are scoped per shop
    if (!req.user || typeof req.user.tenantCode === 'undefined') {
      return res.status(400).json({ success: false, error: 'Tenant information missing on user' });
    }
    payload.tenantCode = req.user.tenantCode;

    // DUAL-WRITE MODE: Write to MongoDB directly (for backward compatibility)
    // AND publish to Kafka (for event-driven processing)
    // TODO: Once Kafka consumers are stable, remove direct MongoDB write
    const created = await Order.create(payload);

    // Publish order creation event to Kafka (non-blocking)
    kafkaProducer.publishOrderEvent('order.created', created.toObject(), req.user.tenantCode)
      .catch((error) => {
        console.error('Failed to publish order event to Kafka:', error);
        // Don't fail the request if Kafka fails
      });

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
    const filter = { tenantCode: req.user?.tenantCode };
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
    const item = await Order.findOne({ _id: req.params.id, tenantCode: req.user?.tenantCode });
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
    const { status, paymentMethod, paymentProofImageUrl } = req.body; // status: paid | credit | pending
    
    // Get current order to capture old status
    // First fetch the existing order; use tenantCode from user if present, otherwise
    // fall back to looking it up by id alone (for safety in case user context is missing).
    const currentFilter = req.user && typeof req.user.tenantCode !== 'undefined'
      ? { _id: req.params.id, tenantCode: req.user.tenantCode }
      : { _id: req.params.id };

    const currentOrder = await Order.findOne(currentFilter);
    if (!currentOrder) {
      return res.status(404).json({ success: false, error: 'Not found' });
    }

    const oldStatus = currentOrder.status;
    const resolvedTenantCode = req.user && typeof req.user.tenantCode !== 'undefined'
      ? req.user.tenantCode
      : currentOrder.tenantCode;

    // DUAL-WRITE MODE: Update MongoDB directly AND publish to Kafka
    const update = { status };
    if (typeof paymentMethod === 'string') {
      update.paymentMethod = paymentMethod;
    }
    if (typeof paymentProofImageUrl === 'string') {
      update.paymentProofImageUrl = paymentProofImageUrl;
    }

    const item = await Order.findOneAndUpdate(
      { _id: currentOrder._id, tenantCode: resolvedTenantCode },
      update,
      { new: true }
    );

    // Publish status update event to Kafka (non-blocking)
    kafkaProducer.publishStatusUpdate(
      {
        orderId: item.orderId,
        tenantCode: resolvedTenantCode,
        oldStatus,
        newStatus: status,
        changedBy: req.user?.userId || req.user?._id?.toString() || 'system',
        paymentMethod: item.paymentMethod,
        paymentProofImageUrl: item.paymentProofImageUrl,
        data: item.toObject(),
      },
      resolvedTenantCode
    ).catch((error) => {
      console.error('Failed to publish status update event to Kafka:', error);
      // Don't fail the request if Kafka fails
    });

    return res.json({ success: true, message: 'Status updated', data: item });
  } catch (err) {
    console.error('updateOrderStatus error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update status' });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const item = await Order.findOneAndDelete({ _id: req.params.id, tenantCode: req.user?.tenantCode });
    if (!item) return res.status(404).json({ success: false, error: 'Order not found' });

    // Publish order deletion event to Kafka (non-blocking)
    kafkaProducer.publishOrderEvent('order.deleted', item.toObject(), req.user.tenantCode)
      .catch((error) => {
        console.error('Failed to publish order deletion event to Kafka:', error);
        // Don't fail the request if Kafka fails
      });

    return res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    console.error('deleteOrder error', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to delete order' });
  }
};
