
import express from "express";
import ProductManager from "./dao/ProductManager.js";
import {engine} from "express-handlebars";


const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set();




// primero se pone el puerto en el que se inicia el servidor en este caso el 3000
//segundo un callback para que devuelva un mensaje 
app.listen(3000, () => {
    console.log("servidor inciado")
});


app.use(express.json(), express.urlencoded({ extended: true }));


// obtener todos los productos
app.get("/api/products", async (req, res, next) => {
    try {
        const products = await ProductManager.getProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

// obtener un producto por id
app.get("/api/products/:pid", async (req, res, next) => {
    try {
        const { pid } = req.params;
        const requiredProduct = await ProductManager.getProductById(pid);
        res.json(requiredProduct);
    } catch (error) {
        next(error);
    }
});

// crear un nuevo producto
app.post("/api/products", async (req, res, next) => {
    try {
        console.log(req.body);
    } catch (error) {
        next(error);
    }
});

// actualizar un producto
app.put("/api/products", async (req, res, next) => {

});

// borrar un producto
app.delete("/api/products", async (req, res, next) => {

});

// aca caen los next que estan "huerfanos" en las rutas
app.use(async (err, req, res, next) => {
    res.status(404).json({ error: err.message })
});