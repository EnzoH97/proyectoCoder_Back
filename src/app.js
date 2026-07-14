
import express from "express";
import { engine } from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/cart.router.js";
import { root } from "./utils.js";
import {Server} from "socket.io";
import { connectToMongo } from "./config/dataBase.js";

const app = express();

app.engine("handlebars", engine({
    helpers: {
        isStock: (stock) => stock > 1 
    },
    partialsDir: root + "/views/partials"
}));
app.set("view engine", "handlebars");
app.set("views", root + "/views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(root + "/public"))
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter)

// aca caen los next que estan "huerfanos" en las rutas
app.use(async (err, req, res, next) => {
    res.status(500).json({ error: err.message })
});

const httpServer = app.listen(3000, () => {
    console.log("servidor inciado")
    connectToMongo();
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (clientSocket) => {
    clientSocket.broadcast.emit("new-user-connected", clientSocket.id);
    clientSocket.on("send-message", (message) => {
        socketServer.emit("new-message", { id: clientSocket.id, message })
    })
}) 