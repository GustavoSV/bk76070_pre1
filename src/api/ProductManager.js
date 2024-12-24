import { log } from 'node:console';
import fs from 'node:fs';
import { v4 as uuid } from 'uuid';

class ProductManager {
  path;
  products = [];

  /**
   * 
   * @param { path } path - Ruta del archivo de productos  
   */
  constructor({ path }) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
      } catch (error) {
        this.products = [];
      }

    } else {
      this.products = [];
    }
  }

  /**
   * 
   * @returns - Retorna todos los productos
   */
  getProducts() {
    return this.products;
  }

  /**
   * 
   * @param {id} id - Id del producto a buscar   
   * @returns Producto encontrado
   */
  getProductById({ id }) {
    const product = this.products.find(product => product.id === id);
    return product;
  }

  async createProduct({ title, description, code, price, status, category, stock, thumbnails }) {

    if (!title || !description || !code || !price || !category || !stock) {
      throw new Error('Faltan datos. Debe al menos completar los campos de título, descripción, code, precio, categoria y stock');
    }

    const id = uuid();
    if (this.products.some(product => product.id === id)) {
      throw new Error('Error interno. Se ha creado 2 veces el mismo id');
    }

    const product = {
      id,
      title,
      description,
      code,
      price,
      status: status || true,
      category,
      stock,
      thumbnails
    };

    this.products.push(product);
    try {
      await this.saveOnFile();
      return product;
    } catch (error) {
      throw new Error('Error al guardar el archivo', error);
    }
  }

  async updateProduct({ id, title, description, code, price, status, category, stock, thumbnails }) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.code = code || product.code;
    product.price = price || product.price;
    product.status = status || product.status;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.thumbnails = thumbnails || product.thumbnails;

    const index = this.products.findIndex(product => product.id === id);
    this.products[index] = product;

    try {
      await this.saveOnFile();
      return product;
    } catch (error) {
      console.log('Error al actualizar el archivo', error);
    }
  }

  async deleteProduct({ id }) {
    const product = this.products.find(product => product.id === id);

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const index = this.products.findIndex(product => product.id === id);
    this.products.splice(index, 1);

    try {
      await this.saveOnFile();
      return product;
    } catch (error) {
      console.log('Error al actualizar el archivo', error);
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.log('Error al guardar el archivo', error);
    }
  }
}

export const productManager = new ProductManager({ path: './src/data/products.json' });