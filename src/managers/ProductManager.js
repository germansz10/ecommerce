import { promises as fs } from 'fs';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async getProductById(id) {
    const productos = await this.getProducts();
    return productos.find(p => p.id === id) || null;
  }

  async addProduct(product) {
    const productos = await this.getProducts();
    const { title, description, price, thumbnail, code, stock } = product;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Faltan campos obligatorios');
    }

    if (productos.some(p => p.code === code)) {
      throw new Error('Ya existe un producto con ese código');
    }

    const newProduct = {
      id: productos.length ? productos[productos.length - 1].id + 1 : 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status: true,
      category: product.category || 'sin categoría',
      thumbnails: product.thumbnails || [],
    };

    productos.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    return newProduct;
  }

  async updateProduct(id, fields) {
    const productos = await this.getProducts();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return null;

    productos[index] = { ...productos[index], ...fields, id }; // nunca actualiza el ID
    await fs.writeFile(this.path, JSON.stringify(productos, null, 2));
    return productos[index];
  }

  async deleteProduct(id) {
    const productos = await this.getProducts();
    const newList = productos.filter(p => p.id !== id);
    if (newList.length === productos.length) return false;

    await fs.writeFile(this.path, JSON.stringify(newList, null, 2));
    return true;
  }
}
