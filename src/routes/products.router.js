import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';

const router = Router();
const productManager = new ProductManager(path.resolve('src/data/products.json'));

// Las rutas GET y PUT
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(Number(req.params.pid));
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});

// --- RUTA POST MODIFICADA ---
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    // NUEVO: se obtiene el servidor de sockets y se emite el evento
    const io = req.app.get('socketio');
    const products = await productManager.getProducts();
    io.emit('updateProducts', products);

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

// --- RUTA DELETE MODIFICADA ---
router.delete('/:pid', async (req, res) => {
    try {
        const result = await productManager.deleteProduct(Number(req.params.pid));
        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // NUEVO: se obtiene el servidor de sockets y se emite el evento
        const io = req.app.get('socketio');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
        
        res.json({ mensaje: 'Producto eliminado' });

    } catch(error) {
        // se mejora el manejo de errores
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;