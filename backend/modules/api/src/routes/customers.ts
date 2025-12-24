import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json({ customers: [] });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

export { router as customerRoutes };






