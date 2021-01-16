const { Schema, model } = require("mongoose")

const BookSchema = new Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    title: { type: String, required: true },
    price: {
      type: Number,
      min: [0, "Should be greater than zero"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["horror", "romance", "fantasy", "history", "scifi"],
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model("Book", BookSchema)
