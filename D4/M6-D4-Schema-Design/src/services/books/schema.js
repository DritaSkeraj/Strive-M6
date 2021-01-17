const { Schema, model } = require("mongoose")

const BookSchema = new Schema(
  {
    asin: {
      type: String,
      required: true,
    },
    title: String,
    price: Number,
    category: {
      type: String,
      enum: ["horror", "fantasy", "romance", "history"],
    },
    availableQuantity: Number,
    authors: [{ type: Schema.Types.ObjectId, ref: "Author" }],
  },
  {
    timestamps: true,
  }
)

BookSchema.static("findBookWithAuthors", async function (id) {
  const book = await BookModel.findById(id).populate("authors")
  return book
})

BookSchema.static("decreaseBookQuantity", async function (id, amount) {
  const book = await BookModel.findByIdAndUpdate(id, {
    $inc: { availableQuantity: -amount },
  })
  return book
})

const BookModel = model("Book", BookSchema)
module.exports = BookModel
