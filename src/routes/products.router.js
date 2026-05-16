import { Router, json, urlencoded } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();

router.use(json(), urlencoded({ extended: true }));

// obtener todos los productos
router.get("/", async (req, res, next) => {
    try {
        const products = await ProductManager.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

// obtener un producto por id
router.get("/api/products/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const requiredProduct = await ProductManager.getProductById(pid);
        res.json(requiredProduct);
    } catch (error) {
        next(error);
    }
});

// crear un nuevo producto
router.post("/", async (req, res, next) => {
    try {
        console.log(req.body);
    } catch (error) {
        next(error);
    }
});

// actualizar un producto
router.put("/:pid", async (req, res, next) => {

});

// borrar un producto
router.delete("/:pid", async (req, res, next) => {

});

export default router;