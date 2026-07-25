import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Order } from '../models/Order';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'gufu_dev_secret_change_in_prod';
const COOKIE = 'gufu_token';

function extractToken(req: Request): string | null {
  const cookie = req.cookies?.[COOKIE];
  if (cookie) return cookie;
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function getUserId(req: Request): string | null {
  try {
    const token = extractToken(req);
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch { return null; }
}

// POST /api/orders — create a new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, subtotal, shipping, discount, total, paymentMethod } = req.body;

    if (!items?.length || !shippingAddress || total == null) {
      res.status(400).json({ error: 'Missing required order fields' });
      return;
    }

    const userId = getUserId(req); // optional — attach if logged in

    const order = await Order.create({
      ...(userId ? { userId } : {}),
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
