
/** put all routes together here and export out  */

const router = require("express").Router();

const tutorsRouter = require("./tutors")

const moduleRouter = require("./modules")
 
const classesRouter = require("./classes")
 

router.use("/tutors",tutorsRouter)

router.use("/modules",moduleRouter)

router.use("/classes",classesRouter)


module.exports = router