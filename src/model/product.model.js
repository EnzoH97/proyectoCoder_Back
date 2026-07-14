import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    id: Number,
    title: {
        type: String,
        required: true
    },
    description: String,
    price: Number,
    category: {
        type: String,
        index: true
    },
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


productSchema.plugin(paginate);

export const productModel = model("product", productSchema);