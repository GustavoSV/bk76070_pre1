import express from 'express';
import { productManager } from './api/ProductManager.js';

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
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.status(200).json(products);
});

app.get('/api/products/:pid', async (req, res) => {
  const id = req.params.pid;
  const product = await productManager.getProductById({ id });
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.status(200).json(product);
});

app.post('/api/products', async (req, res) => {
  const { title, description, code, price, status, category, stock, thumbnails } = req.body;

  try {
    const newProduct = await productManager.createProduct({ title, description, code, price, status, category, stock, thumbnails });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

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

app.delete('/api/products/:pid', async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.deleteProduct({ id});
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});