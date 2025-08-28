// Se importa la funcionalidad Router de Express para crear manejadores de rutas modulares.
import { Router } from 'express';
// Se importa la clase ProductManager para acceder a la lógica de negocio de los productos.
import ProductManager from '../managers/ProductManager.js';
// Se importa el módulo 'path' de Node.js para manejar rutas de archivos de manera compatible con cualquier sistema operativo.
import path from 'path';

// Se crea una nueva instancia del Router.
const router = Router();
// Se crea una instancia de ProductManager, pasándole la ruta absoluta al archivo de datos.
// 'path.resolve' asegura que la ruta sea correcta sin importar desde dónde se ejecute el servidor.
const productManager = new ProductManager(path.resolve('src/data/products.json'));


// === ENDPOINTS GET ===

// Se define la ruta para obtener todos los productos.
router.get('/', async (req, res) => {
  // Se llama al método del manager para obtener la lista completa de productos.
  const products = await productManager.getProducts();
  // Se envía la lista de productos como respuesta en formato JSON.
  res.json(products);
});

// Se define la ruta para obtener un producto por su ID.
router.get('/:pid', async (req, res) => {
  // Se obtiene el ID del producto desde los parámetros de la URL (ej: /api/products/3).
  // Se convierte a número porque los parámetros de la URL siempre son strings.
  const product = await productManager.getProductById(Number(req.params.pid));
  // Se usa un operador ternario para la respuesta:
  // Si el producto se encontró (no es null), se envía el producto.
  // Si no, se envía un código de estado 404 (No Encontrado) con un mensaje de error.
  product ? res.json(product) : res.status(404).json({ error: 'Producto no encontrado' });
});


// === ENDPOINT POST ===

// Se define la ruta para crear un nuevo producto.
router.post('/', async (req, res) => {
  // Se usa un bloque try...catch para manejar posibles errores que el manager pueda lanzar (ej: campos faltantes).
  try {
    // Se pasa el cuerpo de la petición (req.body), que contiene los datos del nuevo producto, al manager.
    const newProduct = await productManager.addProduct(req.body);

    // --- Integración con WebSockets ---
    // Se obtiene la instancia del servidor de Socket.io que se guardó previamente en la configuración de la app.
    const io = req.app.get('socketio');
    // Se obtiene la lista actualizada de todos los productos.
    const products = await productManager.getProducts();
    // Se emite un evento 'updateProducts' a TODOS los clientes conectados, enviándoles la lista nueva.
    io.emit('updateProducts', products);

    // Si todo sale bien, se responde con un código 201 (Creado) y el objeto del nuevo producto.
    res.status(201).json(newProduct);
  } catch (error) {
    // Si el manager lanza un error, se captura y se envía un código 400 (Mala Petición) con el mensaje de error.
    res.status(400).json({ error: error.message });
  }
});


// === ENDPOINT PUT ===

// Se define la ruta para actualizar un producto existente.
router.put('/:pid', async (req, res) => {
  // Se llama al método para actualizar, pasando el ID de la URL y los campos a modificar del body.
  const result = await productManager.updateProduct(Number(req.params.pid), req.body);
  // Si la actualización fue exitosa (no devolvió null), se envía el producto actualizado.
  // Si no, se envía un error 404.
  result
    ? res.json(result)
    : res.status(404).json({ error: 'Producto no encontrado' });
});


// === ENDPOINT DELETE ===

// Se define la ruta para eliminar un producto.
router.delete('/:pid', async (req, res) => {
    try {
        // Se llama al método para eliminar el producto por su ID.
        const result = await productManager.deleteProduct(Number(req.params.pid));
        // Si el resultado es false, significa que el producto no se encontró.
        if (!result) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // --- Integración con WebSockets ---
        // Al igual que en el POST, se notifica a todos los clientes que la lista de productos ha cambiado.
        const io = req.app.get('socketio');
        const products = await productManager.getProducts();
        io.emit('updateProducts', products);
        
        // Se responde con un mensaje de éxito.
        res.json({ mensaje: 'Producto eliminado' });

    } catch(error) {
        // Se captura cualquier otro error inesperado durante el proceso.
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Se exporta el router configurado para ser utilizado en el archivo principal de la aplicación (app.js).
export default router;