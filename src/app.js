
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

const httpServer = app.listen(8080, () => {
    console.log("servidor inciado en el puerto 8080")
    connectToMongo();
});

// Inicialización del servidor de Sockets
const socketServer = new Server(httpServer);

// Guardamos la instancia de socketServer dentro de Express para usarla en los routers
app.set("socketio", socketServer);

socketServer.on("connection", (clientSocket) => {
    console.log(`Cliente conectado: ${clientSocket.id}`);
    clientSocket.broadcast.emit("new-user-connected", clientSocket.id);
    clientSocket.on("send-message", (message) => {
        socketServer.emit("new-message", { id: clientSocket.id, message });
    });
});