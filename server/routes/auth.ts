import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'gufu_dev_secret_change_in_prod';
const COOKIE = 'gufu_token';
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ── POST /api/auth/register ────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password)
      return void res.status(400).json({ error: 'Name, email and password are required.' });

    if (password.length < 6)
      return void res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing)
      return void res.status(409).json({ error: 'An account with that email already exists.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), passwordHash });

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE, token, COOKIE_OPTS);

    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('register error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password)
      return void res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return void res.status(401).json({ error: 'No account found with that email.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return void res.status(401).json({ error: 'Incorrect password.' });

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE, token, COOKIE_OPTS);

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// ── POST /api/auth/logout ──────────────────────────────────────────────────
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(COOKIE);
  res.json({ ok: true });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.[COOKIE];
    if (!token) return void res.status(401).json({ error: 'Not authenticated.' });

    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return void res.status(401).json({ error: 'User not found.' });

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch {
    res.status(401).json({ error: 'Invalid or expired session.' });
  }
});

export default router;
