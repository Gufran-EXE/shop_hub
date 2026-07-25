import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDB } from './db';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import cartRoutes from './routes/cart';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── CORS ────────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Raw body preservation for Razorpay webhook signature verification ──
// Must come BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// ── Body parsers ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate limiting ───────────────────────────────────────
// Auth routes — strict: 20 requests per 15 min per IP (login/register only)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== 'production', // disabled in dev/testing
});

// General API — 200 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api', apiLimiter);

// ── Routes ──────────────────────────────────────────────
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/cart',     cartRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 catch-all for /api/*
app.use('/api/{*path}', (_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ── Start ───────────────────────────────────────────────
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀  API server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
