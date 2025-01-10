import { Router } from "express";
import { productManager } from "../api/ProductManager.js";

export const productsRouter = Router();

// GET /api/products
productsRouter.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});

// GET /api/products/:pid
productsRouter.get('/:pid', async (req, res) => {
  const id = req.params.pid;
  const product = await productManager.getProductById({ id });
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.status(200).json(product);
});

// POST /api/products
productsRouter.post('/', async (req, res) => {
  const { title, description, code, price, status, category, stock, thumbnails } = req.body;

  try {
    const newProduct = await productManager.createProduct({ title, description, code, price, status, category, stock, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// PUT /api/products/:pid
productsRouter.put('/:pid', async (req, res) => {
  const id = req.params.pid;
  const { title, description, code, price, status, category, stock, thumbnails } = req.body;

  try {
    const product = await productManager.updateProduct({ id, title, description, code, price, status, category, stock, thumbnails });
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// DELETE /api/products/:pid
productsRouter.delete('/:pid', async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.deleteProduct({ id});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});