import fs from 'node:fs';
import { v4 as uuid } from 'uuid';

class CartsManager {
  path;
  carts = [];

  /**
   * 
   * @param { path } path - Ruta del archivo de carritos  
   */
  constructor({ path }) {
    this.path = path;

    if (fs.existsSync(this.path)) {
      try {
        this.carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
      } catch (error) {
        this.carts = [];
      }
    } else {
      this.carts = [];
    }
  }

  /**
   * 
   * @returns - Retorna todos los carritos
   */
  async getCarts() {
    return this.carts;
  }

  /**
   * 
   * @param {cid} cid - Id del carrito a buscar 
   * @returns elemento del carrito encontrado
   */
  async getCartById({ cid }) {
    const cart = this.carts.find(cart => cart.cid === cid);
    return cart;
  }
  /**
   * 
   * @param {products} products - Array de productos a agregar al carrito 
   * @returns elemento del carrito agregado
   */
  async createCart({ products }) {

    if (!Array.isArray(products)) {
      throw new Error('Los productos deben estar en un Array');
    }
    
    const cid = uuid();
    if (this.carts.some(cart => cart.cid === cid)) {
      throw new Error('Error interno. Se ha creado 2 veces el mismo cid');
    }

    const cart = {
      cid,
      products
    };

    this.carts.push(cart);
    try {
      await this.saveOnFile();
      return cart;
    } catch (error) {
      console.log('Error al guardar el carrito', error);
    }
  }

  /**
   * 
   * @param {cid, pid, quantity} 
   * cid - Id del carrito
   * pid - Id del producto
   * quantity - Cantidad de productos a agregar 
   * @returns carrito con el producto agregado o actualizado
   */
  async addProductToCart({ cid, pid, quantity }) {
    const cart = this.carts.find(cart => cart.cid === cid);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    try {
      const indexProduct = cart.products.findIndex(product => product.pid === pid);
      if (indexProduct !== -1) {
        cart.products[indexProduct].quantity += quantity;
      } else {
        cart.products.push({ pid, quantity });
      }
      await this.saveOnFile();
      return cart;
    } catch (error) {
      console.log('Error al agregar producto al carrito', error);
    }
  }

  async saveOnFile() {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.log('Error al guardar el archivo de carts', error);
    }
  }
}

export const cartsManager = new CartsManager({ path: './src/db/carts.json' });
