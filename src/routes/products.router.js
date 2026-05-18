import { Router, json, urlencoded } from "express";
import ProductManager from "../dao/ProductManager.js";
import { uploader } from "../utils.js";

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
router.get("/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const requiredProduct = await ProductManager.getProductById(pid);
        res.json(requiredProduct);
    } catch (error) {
        next(error);
    }
});

// crear un nuevo producto
// terminarlo en la semana 
router.post("/", 
    uploader.single("thumbnail"), 
    async (req, res, next) => {
    try {
        if(req.body.status == "on"){
            req.body.status = true
        }else{
            req.body.status = false
        }
        const newProduct = await ProductManager.createProduct({...req.body, thumbnails: [req.file.path]})
        res.status(201).json(newProduct)
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