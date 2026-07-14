import { Router, json } from "express";
import { cartModel } from "../model/cart.model.js";
import { productModel } from "../model/product.model.js";

const router = Router();

router.get("/:cid", async(req, res, next )=>{
    try{
        const {cid} = req.params;
        const cart = await cartModel.findOne({_id: cid});
        res.status(200).json(cart);

    }catch(error){
        next(error);
    }
});

router.post("/", async(req, res, next )=>{
    try{
        const cart = await cartModel.create({});
        res.status(201).json({ message: `El carrito con id ${cart._id} fue creado con exito` })

    }catch(error){
        next(error);
    }
});

router.post("/:cid/product/:pid", async(req, res, next )=>{
    try{
        const { cid, pid} = req.params;
        const product = await productModel.findById(pid);
        if (product != null) {
            const cart = await cartModel.findById(cid);
            cart.products.push({ productId: pid });
            await cart.save();

            res.status(200).json({ message: "El carrito fue actualizado"})
        }
    }catch(error){
        next(error);
    }
});

export default router; 