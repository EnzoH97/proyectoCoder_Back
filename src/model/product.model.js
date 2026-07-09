import { Schema, model } from "mongoose";

const productSchema = new Schema({
    id: Number,
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    category: String,
    stock: Number,
    status: {
        type: Boolean,
        default: true
    },
    code: {
        type: String,
        unique: true
    },
    thumbnails: [String]
})

export const productModel = model("product", productSchema);