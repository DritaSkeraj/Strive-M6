const { Schema, model } = require("mongoose")

const AuthorSchema = new Schema({
  name: String,
  surname: String,
})

module.exports = model("Author", AuthorSchema)
