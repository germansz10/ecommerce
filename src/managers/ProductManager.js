// Se importa el módulo 'fs' (File System) de Node.js, específicamente la versión que trabaja con promesas (async/await).
// Se le asigna el alias 'fs' para un uso más corto.
import { promises as fs } from 'fs';

// Se exporta la clase ProductManager para poder ser utilizada en otros archivos (como los routers).
export default class ProductManager {
  
  // El constructor es el método que se ejecuta al crear una nueva instancia de la clase.
  // Se recibe un 'path', que es la ruta al archivo donde se guardarán los productos.
  constructor(path) {
    // Se guarda la ruta en una propiedad de la clase para poder acceder a ella desde otros métodos.
    this.path = path;
  }

  /**
   * Lee el archivo de productos y lo devuelve como un array de objetos.
   * Si el archivo no existe, se devuelve un array vacío.
   */
  async getProducts() {
    try {
      // Se intenta leer el archivo de forma asíncrona. 'utf-8' es la codificación del texto.
      const data = await fs.readFile(this.path, 'utf-8');
      // Si la lectura es exitosa, se convierte el string JSON a un objeto/array de JavaScript.
      return JSON.parse(data);
    } catch {
      // Si ocurre un error (ej: el archivo no existe), no se detiene la aplicación, simplemente se devuelve un array vacío.
      return [];
    }
  }

  /**
   * Busca un producto en el archivo por su ID.
   * @param {number} id - El ID del producto a buscar.
   * @returns {object|null} - El producto encontrado o null si no se encuentra.
   */
  async getProductById(id) {
    // Primero, se obtiene la lista completa de productos.
    const productos = await this.getProducts();
    // Se usa el método 'find' de los arrays para buscar el primer producto cuyo ID coincida.
    // Si 'find' no encuentra nada, devuelve 'undefined'. Con '|| null' se asegura de devolver 'null' en ese caso.
    return productos.find(p => p.id === id) || null;
  }

  /**
   * Agrega un nuevo producto al archivo.
   * @param {object} product - El objeto del producto a agregar.
   * @returns {object} - El producto recién creado.
   */
  async addProduct(product) {
    // Se obtiene la lista actual de productos.
    const productos = await this.getProducts();
    // Se desestructura el objeto 'product' para tener sus propiedades en variables separadas.
    const { title, description, price, thumbnail, code, stock } = product;

    // --- VALIDACIONES ---
    // Se verifica que todos los campos obligatorios existan. Si falta alguno, se lanza un error.
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Faltan campos obligatorios');
    }

    // Se verifica que no exista ya un producto con el mismo código. 'some' devuelve true si algún elemento cumple la condición.
    if (productos.some(p => p.code === code)) {
      throw new Error('Ya existe un producto con ese código');
    }

    // --- CREACIÓN DEL NUEVO PRODUCTO ---
    const newProduct = {
      // Se genera un nuevo ID. Si hay productos, se toma el ID del último y se le suma 1. Si no hay, el ID es 1.
      id: productos.length ? productos[productos.length - 1].id + 1 : 1,
      // Se usan las propiedades desestructuradas anteriormente.
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      // Se asignan valores por defecto para los campos no obligatorios.
      status: true,
      category: product.category || 'sin categoría',
      thumbnails: product.thumbnails || [],
    };

    // Se agrega el nuevo producto al array en memoria.
    productos.push(newProduct);
    
    // Se sobrescribe el archivo JSON con la nueva lista de productos.
    // JSON.stringify convierte el array de JavaScript a un string en formato JSON.
    // 'null, 2' formatea el archivo JSON para que sea legible y esté bien indentado.
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    
    // Se devuelve el producto recién creado.
    return newProduct;
  }

  /**
   * Actualiza un producto existente por su ID.
   * @param {number} id - El ID del producto a actualizar.
   * @param {object} fields - Un objeto con los campos a actualizar.
   * @returns {object|null} - El producto actualizado o null si no se encontró.
   */
  async updateProduct(id, fields) {
    const productos = await this.getProducts();
    // Se busca el índice (la posición) del producto en el array.
    const index = productos.findIndex(p => p.id === id);
    // Si 'findIndex' no encuentra el producto, devuelve -1. En ese caso, se retorna null.
    if (index === -1) return null;

    // Se actualiza el producto. Se usa el spread operator (...) para crear un nuevo objeto:
    // 1. ...productos[index] -> Se copian todas las propiedades del producto original.
    // 2. ...fields -> Se sobrescriben las propiedades que vienen en el objeto 'fields'.
    // 3. id -> Se asegura que el ID original se mantenga, evitando que sea modificado.
    productos[index] = { ...productos[index], ...fields, id };
    
    // Se guarda el array modificado de vuelta en el archivo.
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    
    // Se devuelve el producto ya actualizado.
    return productos[index];
  }

  /**
   * Elimina un producto por su ID.
   * @param {number} id - El ID del producto a eliminar.
   * @returns {boolean} - true si se eliminó, false si no se encontró.
   */
  async deleteProduct(id) {
    const productos = await this.getProducts();
    // Se crea una nueva lista que contiene todos los productos EXCEPTO el que tiene el ID a borrar.
    const newList = productos.filter(p => p.id !== id);
    
    // Si la nueva lista tiene el mismo tamaño que la original, significa que no se encontró el producto y no se borró nada.
    if (newList.length === productos.length) return false;

    // Se guarda la nueva lista (ya sin el producto) en el archivo.
    await fs.writeFile(this.path, JSON.stringify(newList, null, 2));
    
    // Se devuelve true para indicar que la eliminación fue exitosa.
    return true;
  }
}