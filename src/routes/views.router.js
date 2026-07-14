import { Router } from "express";
import { productModel } from "../model/product.model.js"
//import ProductManager from "../dao/ProductManager.js";

const router = Router();

router.get("/", async (req, res, next) => {
    res.render("index")
})

router.get("/products", async (req, res, next) => {
    try {

        const { page } = req.query;
        //const products = await ProductManager.getProducts();
        const pagination = await productModel.find({}).paginate({
            limit: 2,
            lean: true,
            page
        });
        res.render("products", {
            pagination,
            message: "Tienda"
        })
    } catch (error) {
        next(error);
    }
});

router.get("/create-products", async (req, res, next) => {
    try{
        res.render("products-form")
    }catch(error){
        next(error)
    }
})

router.get('/chat', (req, res) => {
    const { user } = req.query;
    if (!user) {
        return res.redirect('/');
    }
    res.render('chat', { user });
});

export default router;