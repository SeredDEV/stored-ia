import express from 'express';
import cors from 'cors';
import { productRoutes } from './routes/products';
import { orderRoutes } from './routes/orders';
import { customerRoutes } from './routes/customers';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.listen(PORT, () => {
  console.log(`🚀 Store API running on port ${PORT}`);
});

export default app;

