// Se importa la funcionalidad Router de Express.
import { Router } from 'express';
// Se importa el ProductManager para poder obtener la lista de productos y pasarla a las vistas.
import ProductManager from '../managers/ProductManager.js';
// Se importa el módulo 'path' para el manejo de rutas de archivos.
import path from 'path';

// Se crea una instancia del Router.
const router = Router();
// Se crea una instancia del ProductManager, apuntando al archivo de productos.
const productManager = new ProductManager(path.resolve('src/data/products.json'));


// === RUTA PARA LA VISTA PRINCIPAL (HOME) ===

// Se define la ruta GET para la página de inicio ('/').
router.get('/', async (req, res) => {
  // Se obtiene la lista completa de productos desde el manager.
  const products = await productManager.getProducts();
  
  // Se utiliza el método 'res.render()' de Express para renderizar una vista.
  // Es como un "combinar correspondencia" para HTML.
  // Primer argumento: 'home' -> El nombre del archivo 'home.handlebars' que se usará como plantilla.
  // Segundo argumento: un objeto con los datos que se quieren "inyectar" en la plantilla.
  res.render('home', {
    title: 'Productos', // Este valor reemplazará a {{title}} en la plantilla.
    products: products  // Este array de productos reemplazará a {{#each products}} en la plantilla.
  });
});


// === RUTA PARA LA VISTA EN TIEMPO REAL ===

// Se define la ruta GET para la página de productos en tiempo real.
router.get('/realtimeproducts', async (req, res) => {
  // Al igual que en la ruta anterior, se obtienen todos los productos para la carga inicial de la página.
  const products = await productManager.getProducts();
  
  // Se renderiza la plantilla 'realTimeProducts.handlebars'.
  // Se le pasan los mismos datos que a la vista 'home', ya que ambas muestran una lista inicial de productos.
  // La magia del tiempo real ocurrirá en el lado del cliente (con JavaScript) después de que esta página se haya cargado.
  res.render('realTimeProducts', {
    title: 'Productos en Tiempo Real',
    products: products
  });
});

// Se exporta el router para que la aplicación principal (app.js) pueda usar estas rutas.
export default router;