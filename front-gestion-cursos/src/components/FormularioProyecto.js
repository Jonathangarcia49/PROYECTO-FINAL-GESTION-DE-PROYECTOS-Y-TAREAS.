"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProject } from "../context/ProjectContext"

const FormularioProyecto = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { crearProyecto, actualizarProyecto, obtenerProyecto, proyectoActual } = useProject()

  const [formData, setFormData] = useState({
    nombreProyecto: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
    costo: "",
    estado: "Iniciado",
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const esEdicion = Boolean(id)

  useEffect(() => {
    if (esEdicion && id) {
      obtenerProyecto(id)
    }
  }, [id, esEdicion, obtenerProyecto])

  useEffect(() => {
    if (esEdicion && proyectoActual) {
      setFormData({
        nombreProyecto: proyectoActual.nombreProyecto,
        descripcion: proyectoActual.descripcion,
        fechaInicio: new Date(proyectoActual.fechaInicio).toISOString().split("T")[0],
        fechaFin: new Date(proyectoActual.fechaFin).toISOString().split("T")[0],
        costo: proyectoActual.costo,
        estado: proyectoActual.estado,
      })
    }
  }, [proyectoActual, esEdicion])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.nombreProyecto.trim()) {
      nuevosErrores.nombreProyecto = "El nombre del proyecto es requerido"
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida"
    }

    if (!formData.fechaInicio) {
      nuevosErrores.fechaInicio = "La fecha de inicio es requerida"
    }

    if (!formData.fechaFin) {
      nuevosErrores.fechaFin = "La fecha de fin es requerida"
    }

    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
        nuevosErrores.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio"
      }
    }

    if (!formData.costo || formData.costo <= 0) {
      nuevosErrores.costo = "El costo debe ser mayor a 0"
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setLoading(true)

    try {
      const proyectoData = {
        ...formData,
        costo: Number.parseFloat(formData.costo),
      }

      if (esEdicion) {
        await actualizarProyecto(id, proyectoData)
      } else {
        await crearProyecto(proyectoData)
      }

      navigate("/")
    } catch (error) {
      console.error("Error al guardar proyecto:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">{esEdicion ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombreProyecto" className="form-label">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombreProyecto ? "is-invalid" : ""}`}
                  id="nombreProyecto"
                  name="nombreProyecto"
                  value={formData.nombreProyecto}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre del proyecto"
                />
                {errors.nombreProyecto && <div className="invalid-feedback">{errors.nombreProyecto}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">
                  Descripción *
                </label>
                <textarea
                  className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                  id="descripcion"
                  name="descripcion"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe el proyecto"
                ></textarea>
                {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="fechaInicio" className="form-label">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.fechaInicio ? "is-invalid" : ""}`}
                      id="fechaInicio"
                      name="fechaInicio"
                      value={formData.fechaInicio}
                      onChange={handleChange}
                    />
                    {errors.fechaInicio && <div className="invalid-feedback">{errors.fechaInicio}</div>}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="fechaFin" className="form-label">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.fechaFin ? "is-invalid" : ""}`}
                      id="fechaFin"
                      name="fechaFin"
                      value={formData.fechaFin}
                      onChange={handleChange}
                    />
                    {errors.fechaFin && <div className="invalid-feedback">{errors.fechaFin}</div>}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="costo" className="form-label">
                      Costo *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">€</span>
                      <input
                        type="number"
                        className={`form-control ${errors.costo ? "is-invalid" : ""}`}
                        id="costo"
                        name="costo"
                        value={formData.costo}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                      />
                      {errors.costo && <div className="invalid-feedback">{errors.costo}</div>}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">
                      Estado
                    </label>
                    <select
                      className="form-select"
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="Iniciado">Iniciado</option>
                      <option value="Completado">Completado</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      {esEdicion ? "Actualizar" : "Crear"} Proyecto
                    </>
                  )}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/")} disabled={loading}>
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormularioProyecto
