"use client"

import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useProject } from "../context/ProjectContext"
import TareasProyecto from "./TareasProyecto"

const DetalleProyecto = () => {
  const { id } = useParams()
  const { obtenerProyecto, proyectoActual, loading, error } = useProject()

  useEffect(() => {
    if (id) {
      obtenerProyecto(id)
    }
  }, [id, obtenerProyecto])

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    )
  }

  if (!proyectoActual) {
    return (
      <div className="alert alert-warning" role="alert">
        Proyecto no encontrado
      </div>
    )
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
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatearCosto = (costo) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(costo)
  }

  const calcularProgreso = () => {
    if (proyectoActual.tareas.length === 0) return 0
    const tareasCompletadas = proyectoActual.tareas.filter((tarea) => tarea.completado).length
    return Math.round((tareasCompletadas / proyectoActual.tareas.length) * 100)
  }

  const progreso = calcularProgreso()

  return (
    <div>
      {/* Header del proyecto */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Proyectos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {proyectoActual.nombreProyecto}
              </li>
            </ol>
          </nav>
          <h1 className="h2 mb-2">{proyectoActual.nombreProyecto}</h1>
          <span className={`badge ${getEstadoBadge(proyectoActual.estado)} fs-6`}>{proyectoActual.estado}</span>
        </div>
        <Link to={`/proyecto/editar/${proyectoActual._id}`} className="btn btn-outline-primary">
          <i className="fas fa-edit me-2"></i>
          Editar Proyecto
        </Link>
      </div>

      <div className="row">
        {/* Información del proyecto */}
        <div className="col-lg-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="fas fa-info-circle me-2"></i>
                Información del Proyecto
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6 className="text-muted mb-1">Descripción</h6>
                <p className="mb-0">{proyectoActual.descripcion}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-1">Fechas</h6>
                <p className="mb-1">
                  <i className="fas fa-play text-success me-2"></i>
                  <strong>Inicio:</strong> {formatearFecha(proyectoActual.fechaInicio)}
                </p>
                <p className="mb-0">
                  <i className="fas fa-stop text-danger me-2"></i>
                  <strong>Fin:</strong> {formatearFecha(proyectoActual.fechaFin)}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-1">Costo</h6>
                <p className="mb-0 h5 text-primary">{formatearCosto(proyectoActual.costo)}</p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-1">Progreso</h6>
                <div className="progress mb-2" style={{ height: "20px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progreso}%` }}
                    aria-valuenow={progreso}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {progreso}%
                  </div>
                </div>
                <small className="text-muted">
                  {proyectoActual.tareas.filter((t) => t.completado).length} de {proyectoActual.tareas.length} tareas
                  completadas
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Tareas del proyecto */}
        <div className="col-lg-8">
          <TareasProyecto proyecto={proyectoActual} />
        </div>
      </div>
    </div>
  )
}

export default DetalleProyecto
