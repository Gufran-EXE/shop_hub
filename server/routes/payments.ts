import { Router, Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order } from '../models/Order';

const router = Router();

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
});

// ── POST /api/payments/create-order ───────────────────────────────────────
// Creates a Razorpay order and returns the order ID + key to the frontend
router.post('/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return void res.status(400).json({ error: 'Valid amount is required' });
    }

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // Razorpay needs paise (1 INR = 100 paise)
      currency,
      receipt:  receipt ?? `rcpt_${Date.now()}`,
    });

    res.json({
      orderId:  order.id,
      amount:   order.amount,
      currency: order.currency,
      keyId:    process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('create-order error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// ── POST /api/payments/verify ──────────────────────────────────────────────
// Verifies Razorpay signature after payment success, then saves order to DB
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      // Order details to save in MongoDB
      items,
      shippingAddress,
      subtotal,
      shipping,
      discount,
      total,
    } = req.body;

    // Verify HMAC signature
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return void res.status(400).json({ error: 'Payment verification failed. Invalid signature.' });
    }

    // Save verified order to MongoDB
    const order = await Order.create({
      items,
      shippingAddress,
      subtotal,
      shipping:      shipping ?? 0,
      discount:      discount ?? 0,
      total,
      paymentMethod: 'razorpay',
      status:        'confirmed',
    });

    res.json({
      success:     true,
      orderNumber: order.orderNumber,
      orderId:     order._id,
    });
  } catch (err) {
    console.error('verify error:', err);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// ── POST /api/payments/webhook ─────────────────────────────────────────────
// Razorpay webhook — body is raw (configured in server/index.ts)
router.post('/webhook', (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body      = req.body as Buffer;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
      .update(body)
      .digest('hex');

    if (expected !== signature) {
      return void res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const event = JSON.parse(body.toString());
    console.log('Razorpay webhook event:', event.event);
    // Handle events like payment.captured, payment.failed here if needed

    res.json({ ok: true });
  } catch (err) {
    console.error('webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;
