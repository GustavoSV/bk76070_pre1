import { Router } from "express";
import { cartsManager } from "../api/CartsManager.js";

export const cartsRouter = Router();

// GET /api/carts
cartsRouter.get('/', async (req, res) => {
  const carts = await cartsManager.getCarts();
  res.status(200).json(carts);
});

// GET /api/carts
cartsRouter.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  const cart = await cartsManager.getCartById({ cid });
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  res.status(200).json(cart);
});

// POST /api/carts
cartsRouter.post('/', async (req, res) => {
  const { products } = req.body;

  try {
    const newCart = await cartsManager.createCart({ products });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
});

// POST /api/carts/:cid/products/:pid
cartsRouter.post('/:cid/products/:pid', async (req, res) => {
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