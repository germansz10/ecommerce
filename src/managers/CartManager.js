// Se importa el módulo 'fs' (File System) de Node.js, en su versión de promesas.
import { promises as fs } from 'fs';

// Se exporta la clase CartManager para que pueda ser utilizada desde otros módulos, como el router de carritos.
export default class CartManager {
  
  // El constructor se ejecuta al crear una instancia de CartManager.
  // Se recibe un 'path', que es la ruta al archivo donde se guardarán los carritos (ej: 'src/data/carts.json').
  constructor(path) {
    // Se guarda la ruta en una propiedad de la clase para un fácil acceso en otros métodos.
    this.path = path;
  }

  /**
   * Lee el archivo de carritos y lo devuelve como un array de objetos.
   * Si el archivo no existe o hay un error, se devuelve un array vacío.
   */
  async getCarts() {
    try {
      // Se intenta leer el contenido del archivo especificado en el path.
      const data = await fs.readFile(this.path, 'utf-8');
      // Se convierte el contenido (string en formato JSON) a un objeto/array de JavaScript.
      return JSON.parse(data);
    } catch {
      // Si falla la lectura (ej: el archivo no existe), se retorna un array vacío para evitar errores.
      return [];
    }
  }

  /**
   * Método auxiliar para guardar el array de carritos en el archivo JSON.
   * @param {Array} carts - El array de carritos a guardar.
   */
  async saveCarts(carts) {
    // Se sobrescribe el archivo con el nuevo array de carritos, convirtiéndolo a un string JSON formateado.
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  /**
   * Crea un nuevo carrito vacío y lo guarda en el archivo.
   * @returns {object} - El nuevo carrito creado.
   */
  async createCart() {
    // Se obtiene la lista actual de carritos.
    const carts = await this.getCarts();
    
    // Se crea el objeto del nuevo carrito.
    const newCart = {
      // Se genera un nuevo ID. Si ya hay carritos, se toma el ID del último y se le suma 1. Si no, el ID es 1.
      id: carts.length ? carts[carts.length - 1].id + 1 : 1,
      // Se inicializa con un array de productos vacío.
      products: [],
    };
    
    // Se agrega el nuevo carrito al array de carritos.
    carts.push(newCart);
    
    // Se utiliza el método auxiliar para guardar el array actualizado en el archivo.
    await this.saveCarts(carts);
    
    // Se devuelve el objeto del carrito recién creado.
    return newCart;
  }

  /**
   * Busca un carrito por su ID.
   * @param {number} id - El ID del carrito a buscar.
   * @returns {object|undefined} - El carrito encontrado o undefined si no existe.
   */
  async getCartById(id) {
    // Se obtiene la lista completa de carritos.
    const carts = await this.getCarts();
    // Se usa el método 'find' para buscar y devolver el carrito que coincida con el ID proporcionado.
    return carts.find(c => c.id === id);
  }

  /**
   * Agrega un producto a un carrito específico.
   * Si el producto ya existe en el carrito, se incrementa su cantidad.
   * @param {number} cid - El ID del carrito.
   * @param {number} pid - El ID del producto a agregar.
   * @returns {object|null} - El carrito actualizado o null si el carrito no se encontró.
   */
  async addProductToCart(cid, pid) {
    // Se obtiene la lista completa de carritos.
    const carts = await this.getCarts();
    // Se busca el carrito específico al que se quiere agregar el producto.
    const cart = carts.find(c => c.id === cid);
    
    // Si no se encuentra el carrito con el ID 'cid', se retorna null para indicar el error.
    if (!cart) return null;

    // Dentro del carrito encontrado, se busca si el producto ('pid') ya existe en su array 'products'.
    const existingProduct = cart.products.find(p => p.product === pid);
    
    if (existingProduct) {
      // Si el producto ya existe, simplemente se incrementa su propiedad 'quantity' en 1.
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe en el carrito, se agrega un nuevo objeto al array 'products'.
      // Este objeto contiene el ID del producto y la cantidad inicial de 1.
      cart.products.push({ product: pid, quantity: 1 });
    }

    // Se guarda el array de carritos completo con las modificaciones realizadas.
    await this.saveCarts(carts);
    
    // Se devuelve el carrito actualizado.
    return cart;
  }
}