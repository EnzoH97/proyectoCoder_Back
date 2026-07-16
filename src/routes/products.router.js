import { Router, json, urlencoded } from "express";
import { uploader } from "../utils.js";
import { productModel } from "../model/product.model.js"

const router = Router();

router.use(json(), urlencoded({ extended: true }));

const emitUpdatedProducts = async (req) => {
    const socketServer = req.app.get("socketio");
    if (socketServer) {
        // Obtenemos los productos actualizados de la base de datos
        const products = await productModel.find({}).lean();
        // Los emitimos a todos los clientes conectados
        socketServer.emit("update-products", products);
    }
};

// obtener todos los productos
router.get("/", async (req, res, next) => {
    try {
        let { limit = 10, page = 1, query, sort } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        // 1. Filtro de búsqueda (query)
        let filter = {};
        if (query) {
            // Si el query es 'true' o 'false', filtramos por disponibilidad (status)
            if (query === 'true' || query === 'false') {
                filter = { status: query === 'true' };
            } else {
                // De lo contrario, filtramos por categoría (category)
                filter = { category: query };
            }
        }

        // 2. Ordenamiento (sort)
        let sortOption = {};
        if (sort) {
            sortOption.price = sort === 'asc' ? 1 : -1;
        }

        // 3. Cálculos de paginación
        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        const skip = (page - 1) * limit;

        // 4. Consulta a la base de datos
        const products = await productModel.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean();

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;

        // 5. Construcción de enlaces dinámicos para prevLink y nextLink
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
        
        const buildLink = (targetPage) => {
            if (!targetPage) return null;
            const params = new URLSearchParams({ limit, page: targetPage });
            if (query) params.append('query', query);
            if (sort) params.append('sort', sort);
            return `${baseUrl}?${params.toString()}`;
        };

        // 6. Respuesta con el formato exacto requerido
        res.json({
            status: "success",
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: buildLink(prevPage),
            nextLink: buildLink(nextPage)
        });

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
        await emitUpdatedProducts(req);
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
        await emitUpdatedProducts(req);
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
        await emitUpdatedProducts(req);
        res.status(200).json(product);
    }catch(error){
        next(error);
    }

});

export default router;