const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Conexión a MongoDB
mongoose.connect("mongodb://localhost:27017/Garcia", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"))
db.once("open", () => {
  console.log("Conectado a MongoDB")
})

// Importar rutas
const proyectoRoutes = require("./routes/proyectos")
app.use("/api/proyectos", proyectoRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
