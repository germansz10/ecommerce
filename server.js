// server.js
import app from './src/app.js';
import { Server } from 'socket.io';
import ProductManager from './src/managers/ProductManager.js';
import path from 'path';

const PORT = 8080;
const productManager = new ProductManager(path.resolve('src/data/products.json'));

// Levantamos el servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Creamos el servidor de WebSockets
const io = new Server(httpServer);

// Configuramos los eventos de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('createProduct', async (product) => {
    try {
      await productManager.addProduct(product);
      // Emitimos la lista actualizada a TODOS los clientes
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error.message);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      // Emitimos la lista actualizada a TODOS los clientes
      const products = await productManager.getProducts();
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error.message);
    }
  });
});

// Hacemos que `io` sea accesible globalmente en las rutas
app.set('socketio', io);