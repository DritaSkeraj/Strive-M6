const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const ProductsSchema = new Schema(
    {
        // name, description, brand, imageUrl,
        // price, category, createdAt, updatedAt
        // reviews: comment, rate, createdAt
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        brand: {
            type: String,
        },
        imageUrl: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        category: {
            type: String,
        },
        reviews: {
            type: [{
                comment: {
                    type: String,
                    required: true
                },
                rate: {
                    type: Number,
                    required: true
                }, 
                createdAt: {
                     type: Date, 
                     default: Date.now 
                }
            }],
            default: []
        }
    }
)

module.exports = mongoose.model("Products", ProductsSchema)