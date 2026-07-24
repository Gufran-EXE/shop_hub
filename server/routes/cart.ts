import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Cart } from '../models/Cart';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'gufu_dev_secret_change_in_prod';
const COOKIE = 'gufu_token';

/** Pull userId from cookie — returns null if not authed */
function getUserId(req: Request): string | null {
  try {
    const token = req.cookies?.[COOKIE];
    if (!token) return null;
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    return payload.id;
  } catch {
    return null;
  }
}

// GET /api/cart — load saved cart for logged-in user
router.get('/', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return void res.json({ items: [] });

  try {
    const cart = await Cart.findOne({ userId }).lean();
    res.json({ items: cart?.items ?? [] });
  } catch (err) {
    console.error('GET /api/cart error:', err);
    res.status(500).json({ error: 'Failed to load cart' });
  }
});

// PUT /api/cart — replace entire cart for logged-in user
router.put('/', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return void res.status(401).json({ error: 'Not authenticated' });

  try {
    const { items } = req.body;
    await Cart.findOneAndUpdate(
      { userId },
      { userId, items: items ?? [] },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('PUT /api/cart error:', err);
    res.status(500).json({ error: 'Failed to save cart' });
  }
});

// DELETE /api/cart — clear entire cart
router.delete('/', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  if (!userId) return void res.status(401).json({ error: 'Not authenticated' });

  try {
    await Cart.findOneAndUpdate({ userId }, { items: [] }, { upsert: true });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/cart error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router;
