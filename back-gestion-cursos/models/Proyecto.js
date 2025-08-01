const mongoose = require("mongoose")

const tareaSchema = new mongoose.Schema(
  {
    nombreTarea: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    completado: {
      type: Boolean,
      default: false,
    },
    fechaEntrega: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const proyectoSchema = new mongoose.Schema(
  {
    nombreProyecto: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },
    costo: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      required: true,
      enum: ["Iniciado", "Completado", "Cancelado"],
      default: "Iniciado",
    },
    tareas: [tareaSchema],
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Proyectos", proyectoSchema)
