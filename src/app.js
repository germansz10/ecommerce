import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Bienvenido al backend del proyecto!');
});


app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

export default app;
