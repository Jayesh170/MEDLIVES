import mongoose from 'mongoose';

const MedicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, index: true },
    date: { type: String }, // formatted dd/MM/yy to match current UI filters
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    contactNumber: { type: String, required: true },
    medications: { type: [MedicationSchema], required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    payableAmount: { type: Number, required: true },
    status: { type: String, enum: ['paid', 'credit', 'pending'], default: 'pending' },
    deliveryBoy: { type: String, default: '' },
    deliveryBoyPhone: { type: String, default: '' },
    paymentMethod: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);
