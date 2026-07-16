import { Router } from "express";
import { productModel } from "../model/product.model.js";
import { cartModel } from "../model/cart.model.js";


const router = Router();

router.get("/", async (req, res, next) => {
    try{
        res.render("index")
    }catch (error) {
        next(error);
    }
    
})

router.get("/products", async (req, res, next) => {
    try {
        const { page = 1, limit = 2} = req.query;
        const pagination = await productModel.find({}).paginate({
            limit: Number(limit),
            page: Number(page),
            lean: true
        });
        res.render("products", {
            pagination,
            message: "Tienda"
        })
    } catch (error) {
        next(error);
    }
});

router.get("/products/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findById(pid).lean();
        
        if (!product) {
            return res.status(404).render("error", { message: "Producto no encontrado" });
        }

        res.render("product-detail", { product });
    } catch (error) {
        next(error);
    }
});

router.get("/carts/:cid", async (req, res, next) => {
    try {
        const { cid } = req.params;

        const cart = await cartModel.findById(cid).lean();

        if (!cart) {
            return res.status(404).render("error", { message: "Carrito no encontrado" });
        }

        res.render("cart-detail", { cart });
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
});

router.get("/realtimeproducts", async (req, res, next) => {
    try {
        const products = await productModel.find({}).lean();
        res.render("realtime-products", { products });
    } catch (error) {
        next(error);
    }
});

router.get('/chat', (req, res) => {
    const { user } = req.query;
    if (!user) {
        return res.redirect('/');
    }
    res.render('chat', { user });
});

export default router;
