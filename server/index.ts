import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import authRoutes from './routes/auth';
import cartRoutes from './routes/cart';

const app  = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
