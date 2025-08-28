// Se importa la instancia de Express ('app') que ya fue configurada en 'app.js'.
import app from './src/app.js';
// Se importa la clase 'Server' desde la librería 'socket.io' para crear el servidor de WebSockets.
import { Server } from 'socket.io';
// Se importa el ProductManager, ya que el servidor de sockets necesitará interactuar con los productos.
import ProductManager from './src/managers/ProductManager.js';
// Se importa el módulo 'path' para el manejo de rutas.
import path from 'path';

// Se define el puerto en el que correrá el servidor.
const PORT = 8080;
// Se crea una instancia de ProductManager para usar en la lógica de los sockets.
const productManager = new ProductManager(path.resolve('src/data/products.json'));


// --- INICIO DEL SERVIDOR HTTP ---

// Se inicia el servidor Express. 'app.listen' pone a la aplicación a escuchar peticiones HTTP.
// IMPORTANTE: 'app.listen' también devuelve una referencia al servidor HTTP nativo de Node.js,
// que es lo que se necesita para que Socket.io pueda funcionar. Se guarda en 'httpServer'.
const httpServer = app.listen(PORT, () => {
  // Esta función (callback) se ejecuta una vez que el servidor se ha iniciado correctamente.
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


// --- INICIO DEL SERVIDOR DE WEBSOCKETS ---

// Se crea una instancia del servidor de Socket.io, "enganchándolo" al servidor HTTP existente.
// Ahora, ambos servidores (HTTP y WebSockets) comparten el mismo puerto.
const io = new Server(httpServer);

// Se configura el evento 'connection'. Este bloque de código se ejecutará CADA VEZ
// que un nuevo cliente (un navegador) se conecte a nuestro servidor de WebSockets.
io.on('connection', (socket) => {
  // 'socket' es un objeto que representa la conexión de UN cliente en particular.
  console.log('Nuevo cliente conectado');

  // Se define un listener para el evento 'createProduct'.
  // Esto se activa cuando un cliente emite un evento con ese nombre (desde realTime.js).
  socket.on('createProduct', async (product) => {
    try {
      // Se usa el manager para agregar el nuevo producto recibido del cliente.
      await productManager.addProduct(product);
      // Se obtiene la lista completa y actualizada de productos.
      const products = await productManager.getProducts();
      // Se emite un evento 'updateProducts' a TODOS los clientes conectados ('io.emit').
      // Se les envía la lista nueva para que actualicen su vista.
      io.emit('updateProducts', products);
    } catch (error) {
      // Se muestra un error en la consola del servidor si algo falla.
      console.error(error.message);
    }
  });

  // Se define un listener para el evento 'deleteProduct'.
  socket.on('deleteProduct', async (productId) => {
    try {
      // Se usa el manager para eliminar el producto usando el ID recibido.
      await productManager.deleteProduct(productId);
      // Se obtiene la lista actualizada.
      const products = await productManager.getProducts();
      // Se emite la lista actualizada a TODOS los clientes.
      io.emit('updateProducts', products);
    } catch (error) {
      console.error(error.message);
    }
  });
});

// --- PUENTE ENTRE HTTP Y WEBSOCKETS ---

// Se guarda la instancia del servidor de sockets 'io' en la configuración de la app de Express.
// Esto actúa como un "puente" para que las rutas de la API (definidas en otros archivos)
// puedan acceder a 'io' y emitir eventos de WebSocket.
app.set('socketio', io);