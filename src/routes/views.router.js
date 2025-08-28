// src/routes/views.router.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = Router();
const productManager = new ProductManager(path.resolve('src/data/products.json'));

// Vista para mostrar productos con HTTP
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', {
    title: 'Productos',
    products: products
  });
});

// Vista para mostrar productos en tiempo real con WebSockets
router.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', {
    title: 'Productos en Tiempo Real',
    products: products
  });
});

export default router;