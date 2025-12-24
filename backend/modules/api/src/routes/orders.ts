import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({ orders: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

router.post('/', async (req, res) => {
  try {
    // const order = await OrderService.create(req.body);
    res.json({ order: null });
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

export { router as orderRoutes };







