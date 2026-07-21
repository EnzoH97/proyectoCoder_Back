import { Router } from "express";
import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/product.model.js";

const router = Router();

// 1. GET /api/carts/:cid - Obtener carrito con populate autoejecutado
router.get("/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await cartModel.findOne({ _id: cid });
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.status(200).json(cart);
    } catch (error) {
        next(error);
    }
});

// 2. POST /api/carts - Crear un nuevo carrito vacío
router.post("/", async (req, res, next) => {
    try {
        const cart = await cartModel.create({});
        res.status(201).json({ message: `El carrito con id ${cart._id} fue creado con éxito`, cart });
    } catch (error) {
        next(error);
    }
});

// 3. POST /api/carts/:cid/products/:pid - Agregar producto o incrementar cantidad
router.post("/:cid/products/:pid", async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        // Validamos que el producto realmente exista en la base de datos
        const productExists = await productModel.findById(pid);
        if (!productExists) {
            return res.status(404).json({ error: "El producto que intentas agregar no existe" });
        }
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        // Buscamos si el producto ya existe dentro del array del carrito
        const productIndex = cart.products.findIndex(
            p => p.productId && p.productId.toString() === pid
        );
        if (productIndex !== -1) {
            // Si ya existe, incrementamos la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si es nuevo, lo agregamos al array con cantidad inicial de 1
            cart.products.push({ productId: pid, quantity: 1 });
        }
        await cart.save();
        res.status(200).json({ message: "Producto añadido al carrito con éxito", cart });
    } catch (error) {
        next(error);
    }
});

// 4. DELETE /api/carts/:cid/products/:pid - Eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        // Filtramos el array para conservar solo los productos que NO coincidan con el pid
        cart.products = cart.products.filter(
            p => p.productId && p.productId.toString() !== pid
        );
        await cart.save();
        res.status(200).json({ message: "Producto eliminado del carrito con éxito", cart });
    } catch (error) {
        next(error);
    }
});

// 5. PUT /api/carts/:cid - Actualizar el carrito completo con un arreglo de productos
router.put("/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; // Se espera recibir un array: [{ productId: "...", quantity: X }]
        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "Se requiere un formato de array para actualizar" });
        }
        const cart = await cartModel.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        );
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.status(200).json({ message: "Carrito actualizado por completo", cart });
    } catch (error) {
        next(error);
    }
});

// 6. PUT /api/carts/:cid/products/:pid - Actualizar únicamente la cantidad de un producto
router.put("/:cid/products/:pid", async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if (quantity === undefined || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ error: "Debe proveer una cantidad válida y mayor a 0" });
        }
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(
            p => p._id && p._id.toString() === pid
        );
        if (productIndex === -1) {
            return res.status(404).json({ error: "El producto no existe en este carrito" });
        }
        cart.products[productIndex].quantity = Number(quantity);
        await cart.save();
        res.status(200).json({ message: "Cantidad de producto actualizada", cart });
    } catch (error) {
        next(error);
    }
});


// 7. DELETE /api/carts/:cid - Vaciar el carrito completo
router.delete("/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;
        // Vaciamos el array de productos del carrito seleccionado
        const cart = await cartModel.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );
        if (!cart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.status(200).json({ message: "Carrito vaciado por completo", cart });
    } catch (error) {
        next(error);
    }
});

export default router;