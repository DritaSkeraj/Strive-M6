const dotenv = require("dotenv")
dotenv.config()

const mongoose = require("mongoose")
const express = require("express")
const listEndpoints = require("express-list-endpoints")
const { join } = require("path")
const cors = require("cors")

const {
    notFoundHandler,
    unauthorizedHandler,
    forbiddenHandler,
    catchAllHandler,
  } = require("./errorHandling")

const server = express()
  
const productsRouter = require("./services/products")
const port = process.env.PORT || 3001
const publicFolderPath = join(__dirname, "../public")

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolderPath))  

server.use("/products", productsRouter)

server.use(notFoundHandler)
server.use(unauthorizedHandler)
server.use(forbiddenHandler)
server.use(catchAllHandler)

console.log(listEndpoints(server))

mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    server.listen(port, () => {
        console.log("Running on port ", port)
    })
).catch(err => console.log(err))






