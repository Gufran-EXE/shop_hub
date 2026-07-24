import { Router, Request, Response } from 'express';
import { Order } from '../models/Order';

const router = Router();

// POST /api/orders — create a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, subtotal, shipping, discount, total, paymentMethod } = req.body;

    // Basic validation
    if (!items?.length || !shippingAddress || total == null) {
      res.status(400).json({ error: 'Missing required order fields' });
      return;
    }

    const order = await Order.create({
      items,
      shippingAddress,
      subtotal,
      shipping: shipping ?? 0,
      discount: discount ?? 0,
      total,
      paymentMethod: paymentMethod ?? 'card',
    });

    res.status(201).json(order);
  } catch (err) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// GET /api/orders/:orderNumber
router.get('/:orderNumber', async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    res.json(order);
  } catch (err) {
    console.error('GET /api/orders/:orderNumber error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

export default router;
