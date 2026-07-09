import { Router, json, urlencoded } from "express";
//import ProductManager from "../dao/ProductManager.js";
import { uploader } from "../utils.js";
import { productModel } from "../model/product.model.js"

const router = Router();

router.use(json(), urlencoded({ extended: true }));

// obtener todos los productos
router.get("/", async (req, res, next) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        next(error);
    }
});


// obtener un producto por id
router.get("/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const requiredProduct = await productModel.findOne({_id: pid});
        res.json(requiredProduct);
    } catch (error) {
        next(error);
    }
});

// crear un nuevo producto
router.post("/", 
    uploader.single("thumbnail"), 
    async (req, res, next) => {
    try {
        if(req.body.status == "on"){
            req.body.status = true
        }else{
            req.body.status = false
        }
        const newProduct = await productModel.create({...req.body});
        res.status(201).json(newProduct)
    } catch (error) {
        next(error);
    }
});

// actualizar un producto
router.put("/:pid", async (req, res, next) => {
    try{
        const { pid } = req.params;
        const update = req.body;
        const product = await productModel.findByIdAndUpdate(pid, update, {new: true});
        res.status(200).json(product);
    }catch(error){
        next(error);
    }
});

// borrar un producto
router.delete("/:pid", async (req, res, next) => {
    try{
        const { pid } = req.params;
        const product = await productModel.findByIdAndDelete(pid);
        res.status(200).json(product);
    }catch(error){
        next(error);
    }

});

export default router;