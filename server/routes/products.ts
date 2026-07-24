import { Router, Request, Response } from 'express';
import { Product } from '../models/Product';

const router = Router();

// GET /api/products
// Query params: category, search, deals, limit, page
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, deals, limit = '20', page = '1' } = req.query;

    const filter: Record<string, unknown> = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (deals === 'true') {
      filter.isDeal = true;
    }

    if (search && typeof search === 'string' && search.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const pageNum  = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip     = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
