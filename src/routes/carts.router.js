import { Router } from 'express';
import CartManager from '../managers/CartManager.js';
import path from 'path';

const router = Router();
const cartManager = new CartManager(path.resolve('src/data/carts.json'));

router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(Number(req.params.cid));
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

router.post('/:cid/product/:pid', async (req, res) => {
  const result = await cartManager.addProductToCart(Number(req.params.cid), Number(req.params.pid));
  result ? res.json(result) : res.status(404).json({ error: 'No se pudo agregar el producto al carrito' });
});

export default router;
