import { Router } from 'express';
// import { ProductService } from '../../services/product/src/product.service';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    // const products = await ProductService.list();
    res.json({ products: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    // const product = await ProductService.retrieve(req.params.id);
    res.json({ product: null });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

export { router as productRoutes };







