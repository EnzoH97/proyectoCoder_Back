import { Schema, model, Types } from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                productId: {
                    type: Types.ObjectId,
                    ref: "product"
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],
        default: []
    }
});

cartSchema.pre("findOne", function(next) {
    this.populate("products.productId");
});

export const cartModel = model("cart", cartSchema);