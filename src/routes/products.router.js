import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = Router();
const productManager = new ProductManager(path.resolve('src/data/products.json'));

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const result = await productManager.updateProduct(Number(req.params.pid), req.body);
  result
    ? res.json(result)
    : res.status(404).json({ error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
  const result = await productManager.deleteProduct(Number(req.params.pid));
  result
    ? res.json({ mensaje: 'Producto eliminado' })
    : res.status(404).json({ error: 'Producto no encontrado' });
});

export default router;
