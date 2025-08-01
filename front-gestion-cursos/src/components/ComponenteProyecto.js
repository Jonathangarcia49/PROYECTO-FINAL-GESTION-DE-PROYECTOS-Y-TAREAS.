"use client"
import { Link } from "react-router-dom"
import { useProject } from "../context/ProjectContext"

const ComponenteProyecto = ({ proyecto }) => {
  const { eliminarProyecto } = useProject()

  const handleEliminar = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este proyecto?")) {
      await eliminarProyecto(proyecto._id)
    }
  }

  const getEstadoBadge = (estado) => {
    const badges = {
      Iniciado: "bg-primary",
      Completado: "bg-success",
      Cancelado: "bg-danger",
    }
    return badges[estado] || "bg-secondary"
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES")
  }

  const formatearCosto = (costo) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(costo)
  }

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">{proyecto.nombreProyecto}</h5>
        <span className={`badge ${getEstadoBadge(proyecto.estado)}`}>{proyecto.estado}</span>
      </div>
      <div className="card-body">
        <p className="card-text text-muted">{proyecto.descripcion}</p>
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-calendar-alt me-1"></i>
            {formatearFecha(proyecto.fechaInicio)} - {formatearFecha(proyecto.fechaFin)}
          </small>
        </div>
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-euro-sign me-1"></i>
            {formatearCosto(proyecto.costo)}
          </small>
        </div>
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-tasks me-1"></i>
            {proyecto.tareas.length} tareas
          </small>
        </div>
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <Link to={`/proyecto/${proyecto._id}`} className="btn btn-outline-primary btn-sm">
            <i className="fas fa-eye me-1"></i>
            Ver
          </Link>
          <Link to={`/proyecto/editar/${proyecto._id}`} className="btn btn-outline-secondary btn-sm">
            <i className="fas fa-edit me-1"></i>
            Editar
          </Link>
          <button onClick={handleEliminar} className="btn btn-outline-danger btn-sm">
            <i className="fas fa-trash me-1"></i>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComponenteProyecto
