"use client"

import { useState } from "react"
import { useProject } from "../context/ProjectContext"
import FormularioTarea from "./FormularioTarea"

const TareasProyecto = ({ proyecto }) => {
  const { actualizarTarea, eliminarTarea, filtrarTareasPorEstado, filtrarTareasPorVencimiento } = useProject()

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [tareaEditando, setTareaEditando] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState("todas")
  const [filtroFecha, setFiltroFecha] = useState("")
  const [tareasFiltradas, setTareasFiltradas] = useState(null)

  const handleToggleCompletado = async (tarea) => {
    try {
      await actualizarTarea(proyecto._id, tarea._id, {
        ...tarea,
        completado: !tarea.completado,
      })
    } catch (error) {
      console.error("Error al actualizar tarea:", error)
    }
  }

  const handleEliminarTarea = async (tareaId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await eliminarTarea(proyecto._id, tareaId)
      } catch (error) {
        console.error("Error al eliminar tarea:", error)
      }
    }
  }

  const handleEditarTarea = (tarea) => {
    setTareaEditando(tarea)
    setMostrarFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
    setTareaEditando(null)
  }

  const handleFiltrarPorEstado = async (estado) => {
    setFiltroEstado(estado)
    setFiltroFecha("")

    if (estado === "todas") {
      setTareasFiltradas(null)
    } else {
      const completado = estado === "completadas"
      const tareas = await filtrarTareasPorEstado(proyecto._id, completado)
      setTareasFiltradas(tareas)
    }
  }

  const handleFiltrarPorFecha = async (fecha) => {
    setFiltroFecha(fecha)
    setFiltroEstado("todas")

    if (!fecha) {
      setTareasFiltradas(null)
    } else {
      const tareas = await filtrarTareasPorVencimiento(proyecto._id, fecha)
      setTareasFiltradas(tareas)
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES")
  }

  const esFechaVencida = (fecha) => {
    return new Date(fecha) < new Date()
  }

  const tareasAMostrar = tareasFiltradas || proyecto.tareas

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">
            <i className="fas fa-tasks me-2"></i>
            Tareas ({tareasAMostrar.length})
          </h5>
          <button className="btn btn-primary btn-sm" onClick={() => setMostrarFormulario(true)}>
            <i className="fas fa-plus me-2"></i>
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card-body border-bottom">
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Filtrar por estado:</label>
            <select
              className="form-select form-select-sm"
              value={filtroEstado}
              onChange={(e) => handleFiltrarPorEstado(e.target.value)}
            >
              <option value="todas">Todas las tareas</option>
              <option value="completadas">Completadas</option>
              <option value="pendientes">Pendientes</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Filtrar por vencimiento:</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filtroFecha}
              onChange={(e) => handleFiltrarPorFecha(e.target.value)}
            />
          </div>
        </div>

        {(filtroEstado !== "todas" || filtroFecha) && (
          <div className="mt-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setFiltroEstado("todas")
                setFiltroFecha("")
                setTareasFiltradas(null)
              }}
            >
              <i className="fas fa-times me-1"></i>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      <div className="card-body p-0">
        {tareasAMostrar.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-clipboard-list fa-3x text-muted mb-3"></i>
            <h5 className="text-muted">No hay tareas</h5>
            <p className="text-muted">
              {tareasFiltradas
                ? "No se encontraron tareas con los filtros aplicados"
                : "Comienza agregando una nueva tarea"}
            </p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {tareasAMostrar.map((tarea) => (
              <div key={tarea._id} className="list-group-item">
                <div className="d-flex align-items-start">
                  <div className="form-check me-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={tarea.completado}
                      onChange={() => handleToggleCompletado(tarea)}
                    />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className={`mb-1 ${tarea.completado ? "text-decoration-line-through text-muted" : ""}`}>
                          {tarea.nombreTarea}
                        </h6>
                        <p className={`mb-2 ${tarea.completado ? "text-muted" : ""}`}>{tarea.descripcion}</p>
                        <div className="d-flex align-items-center gap-3">
                          <small
                            className={`${esFechaVencida(tarea.fechaEntrega) && !tarea.completado ? "text-danger" : "text-muted"}`}
                          >
                            <i className="fas fa-calendar-alt me-1"></i>
                            Vence: {formatearFecha(tarea.fechaEntrega)}
                            {esFechaVencida(tarea.fechaEntrega) && !tarea.completado && (
                              <span className="badge bg-danger ms-2">Vencida</span>
                            )}
                          </small>
                          {tarea.completado && (
                            <span className="badge bg-success">
                              <i className="fas fa-check me-1"></i>
                              Completada
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleEditarTarea(tarea)}
                          title="Editar tarea"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleEliminarTarea(tarea._id)}
                          title="Eliminar tarea"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal/Formulario de tarea */}
      {mostrarFormulario && (
        <FormularioTarea proyecto={proyecto} tarea={tareaEditando} onCerrar={handleCerrarFormulario} />
      )}
    </div>
  )
}

export default TareasProyecto
