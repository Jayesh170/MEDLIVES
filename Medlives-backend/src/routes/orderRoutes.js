import { Router } from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.put('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

export default router;
