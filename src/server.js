import express from 'express';
import { productManager } from './api/ProductManager.js';
import { cartsManager } from './api/CartsManager.js';

const app = express();
const PORT = 8080;

// Server initialization
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// App configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoints
// GET /api/products
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});

// GET /api/carts
app.get('/api/carts', async (req, res) => {
  const carts = await cartsManager.getCarts();
  res.status(200).json(carts);
});

// GET /api/products/:pid
app.get('/api/products/:pid', async (req, res) => {
  const id = req.params.pid;
  const product = await productManager.getProductById({ id });
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.status(200).json(product);
});

// GET /api/carts
app.get('/api/carts/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartsManager.getCartById({ cid });
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  res.status(200).json(cart);
});

// POST /api/products
app.post('/api/products', async (req, res) => {
  const { title, description, code, price, status, category, stock, thumbnails } = req.body;

  try {
    const newProduct = await productManager.createProduct({ title, description, code, price, status, category, stock, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// POST /api/carts
app.post('/api/carts', async (req, res) => {
  const { products } = req.body;

  try {
    const newCart = await cartsManager.createCart({ products });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// POST /api/carts/:cid/products/:pid
app.post('/api/carts/:cid/products/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;

  try {
    const cart = await cartsManager.addProductToCart({ cid, pid, quantity });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// PUT /api/products/:pid
app.put('/api/products/:pid', async (req, res) => {
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
app.delete('/api/products/:pid', async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.deleteProduct({ id});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});