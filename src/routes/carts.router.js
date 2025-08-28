// Se importa la funcionalidad Router de Express para definir las rutas de la API.
import { Router } from 'express';
// Se importa la clase CartManager que contiene toda la lógica para manejar los carritos.
import CartManager from '../managers/CartManager.js';
// Se importa el módulo 'path' para un manejo correcto de las rutas de archivos.
import path from 'path';

// Se crea una instancia del Router.
const router = Router();
// Se crea una instancia de CartManager, indicándole dónde está el archivo de datos de los carritos.
const cartManager = new CartManager(path.resolve('src/data/carts.json'));


// === ENDPOINT PARA CREAR UN CARRITO ===

// Se define la ruta POST en la raíz ('/api/carts/') para crear un nuevo carrito.
router.post('/', async (req, res) => {
  // Se llama al método del manager para crear un carrito nuevo.
  const newCart = await cartManager.createCart();
  // Se responde con un código de estado 201 (Creado) y el objeto del nuevo carrito en formato JSON.
  res.status(201).json(newCart);
});


// === ENDPOINTS PARA OBTENER CARRITOS ===

// Se define una ruta para obtener TODOS los carritos existentes.
// Nota: Esta ruta no era un requisito estricto en la consigna, pero es útil para debugging.
router.get('/', async (req, res) => {
  // Se obtienen todos los carritos.
  const carts = await cartManager.getCarts();
  // Se devuelven en formato JSON.
  res.json(carts);
});


// Se define la ruta GET para obtener un carrito específico por su ID.
router.get('/:cid', async (req, res) => {
  // Se obtiene el ID del carrito ('cid') desde los parámetros de la URL.
  const cart = await cartManager.getCartById(Number(req.params.cid));
  
  // Si se encuentra el carrito, se responde con el array de sus productos.
  // Si no se encuentra, se responde con un error 404 (No Encontrado).
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});


// === ENDPOINT PARA AGREGAR UN PRODUCTO A UN CARRITO ===

// Se define la ruta POST para agregar un producto ('pid') a un carrito específico ('cid').
router.post('/:cid/product/:pid', async (req, res) => {
  // Se obtienen ambos IDs desde los parámetros de la URL y se convierten a número.
  const cid = Number(req.params.cid);
  const pid = Number(req.params.pid);
  
  // Se llama al método del manager que contiene la lógica para agregar el producto.
  const result = await cartManager.addProductToCart(cid, pid);
  
  // Si el método tiene éxito (no devuelve null), se envía el carrito actualizado.
  // Si no, se envía un error 404, usualmente porque el carrito ('cid') no fue encontrado.
  result ? res.json(result) : res.status(404).json({ error: 'No se pudo agregar el producto al carrito' });
});

// Se exporta el router configurado para ser montado en la aplicación principal.
export default router;