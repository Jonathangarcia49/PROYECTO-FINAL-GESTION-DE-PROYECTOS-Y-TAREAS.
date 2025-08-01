const express = require("express")
const router = express.Router()
const Proyecto = require("../models/Proyecto")

// CRUD Proyectos

// Obtener todos los proyectos
router.get("/", async (req, res) => {
  try {
    const proyectos = await Proyecto.find()
    res.json(proyectos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Obtener un proyecto por ID
router.get("/:id", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }
    res.json(proyecto)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Crear nuevo proyecto
router.post("/", async (req, res) => {
  try {
    const proyecto = new Proyecto(req.body)
    const nuevoProyecto = await proyecto.save()
    res.status(201).json(nuevoProyecto)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Actualizar proyecto
router.put("/:id", async (req, res) => {
  try {
    const proyecto = await Proyecto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }
    res.json(proyecto)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Eliminar proyecto
router.delete("/:id", async (req, res) => {
  try {
    const proyecto = await Proyecto.findByIdAndDelete(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }
    res.json({ message: "Proyecto eliminado correctamente" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// CRUD Tareas

// Agregar tarea a proyecto
router.post("/:id/tareas", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }

    proyecto.tareas.push(req.body)
    await proyecto.save()
    res.status(201).json(proyecto)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Actualizar tarea
router.put("/:id/tareas/:tareaId", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }

    const tarea = proyecto.tareas.id(req.params.tareaId)
    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" })
    }

    Object.assign(tarea, req.body)
    await proyecto.save()
    res.json(proyecto)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Eliminar tarea
router.delete("/:id/tareas/:tareaId", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }

    proyecto.tareas.id(req.params.tareaId).remove()
    await proyecto.save()
    res.json(proyecto)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Filtrar tareas por estado
router.get("/:id/tareas/estado/:completado", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }

    const completado = req.params.completado === "true"
    const tareasFiltradas = proyecto.tareas.filter((tarea) => tarea.completado === completado)
    res.json(tareasFiltradas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Filtrar tareas por fecha de vencimiento
router.get("/:id/tareas/vencimiento/:fecha", async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
    if (!proyecto) {
      return res.status(404).json({ message: "Proyecto no encontrado" })
    }

    const fechaLimite = new Date(req.params.fecha)
    const tareasFiltradas = proyecto.tareas.filter((tarea) => new Date(tarea.fechaEntrega) <= fechaLimite)
    res.json(tareasFiltradas)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
