
import fs from "fs/promises";
import { GenericManager } from "./GenericManager.js";

class ProductManager extends GenericManager {

    constructor(filePath) {
        super(filePath)
    }

    async getProducts() {
        const products = await fs.readFile(this.filePath, { encoding: "utf-8" });
        if (products) return JSON.parse(products);
        else throw new Error("no hay productos");
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        const requiredProduct = products.find(product => product.id == pid);
        if (requiredProduct) return requiredProduct;
        else throw new Error("producto no encontrado");
    }

    async createProduct(product) {
        const products = await this.getProducts();
        // SE EVITA USAR UN SIMPLE INCREMENTO DE ACUERDO AL LARGO DEL ARRAY
        // PORQUE SI SE EMPIEZAN A BORRAR REGISTROS, SE PUEDEN REPETIR LOS ID
        if (products.length == 0) product.id = 1
        else product.id = products[products.length - 1].id + 1;

        products.push(product);
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 4), { encoding: "utf-8" });
        return product;
    }

    async updateProductById(pid, updatedData) {
        const products = await this.getProducts();
        const requiredProductIndex = products.findIndex((product) => product.id == pid);
        products[requiredProductIndex] = { ...updatedData, id: parseInt(pid) };
        await fs.writeFile(this.filePath, JSON.stringify(products), { encoding: "utf-8" });
        return products[requiredProductIndex];
    }

    async deleteProductById(pid) {
        const requiredProduct = await this.getProductById(pid);
        let products = await this.getProducts();
        products = products.filter((product) => product.id != pid);
        await fs.writeFile(this.filePath, JSON.stringify(products), { encoding: "utf-8" });
        return requiredProduct;
    }
}

export default new ProductManager("products.json")