const  express = require("express");
const listEndpoints = require("express-list-endpoints");
const moviesRouter = require("./movies/index")

const server = express();
const port = process.env.PORT || 5050;

server.use(express.json())

server.use("/movies", moviesRouter)

console.log(listEndpoints(server))

server.listen(port, ()=> console.log("🏃‍♂️ on port: ", port))