
import express from "express";
import ProductManager from "./dao/ProductManager.js";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import { root } from "./utils.js";


const app = express();

app.engine("handlebars", engine({
    helpers: {
        isStock: (stock) => stock > 1 
    },
    partialsDir: root + "/views/partials"
}));
app.set("view engine", "handlebars");
app.set("views", root + "/views");

// primero se pone el puerto en el que se inicia el servidor en este caso el 3000
//segundo un callback para que devuelva un mensaje 
app.listen(3000, () => {
    console.log("servidor inciado")
});

app.use(express.static(root + "/public"))

app.use("/api/products", productsRouter);
app.use("/", viewsRouter)

// aca caen los next que estan "huerfanos" en las rutas
app.use(async (err, req, res, next) => {
    res.status(404).json({ error: err.message })
});