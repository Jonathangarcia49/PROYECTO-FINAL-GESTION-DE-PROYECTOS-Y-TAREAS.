"use client"

import { useState, useEffect } from "react"
import { useProject } from "../context/ProjectContext"

const FormularioTarea = ({ proyecto, tarea, onCerrar }) => {
  const { agregarTarea, actualizarTarea } = useProject()

  const [formData, setFormData] = useState({
    nombreTarea: "",
    descripcion: "",
    fechaEntrega: "",
    completado: false,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const esEdicion = Boolean(tarea)

  useEffect(() => {
    if (esEdicion && tarea) {
      setFormData({
        nombreTarea: tarea.nombreTarea,
        descripcion: tarea.descripcion,
        fechaEntrega: new Date(tarea.fechaEntrega).toISOString().split("T")[0],
        completado: tarea.completado,
      })
    }
  }, [tarea, esEdicion])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.nombreTarea.trim()) {
      nuevosErrores.nombreTarea = "El nombre de la tarea es requerido"
    }

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = "La descripción es requerida"
    }

    if (!formData.fechaEntrega) {
      nuevosErrores.fechaEntrega = "La fecha de entrega es requerida"
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
      if (esEdicion) {
        await actualizarTarea(proyecto._id, tarea._id, formData)
      } else {
        await agregarTarea(proyecto._id, formData)
      }

      onCerrar()
    } catch (error) {
      console.error("Error al guardar tarea:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{esEdicion ? "Editar Tarea" : "Nueva Tarea"}</h5>
            <button type="button" className="btn-close" onClick={onCerrar} disabled={loading}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="nombreTarea" className="form-label">
                  Nombre de la Tarea *
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.nombreTarea ? "is-invalid" : ""}`}
                  id="nombreTarea"
                  name="nombreTarea"
                  value={formData.nombreTarea}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre de la tarea"
                />
                {errors.nombreTarea && <div className="invalid-feedback">{errors.nombreTarea}</div>}
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
                  placeholder="Describe la tarea"
                ></textarea>
                {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="fechaEntrega" className="form-label">
                  Fecha de Entrega *
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.fechaEntrega ? "is-invalid" : ""}`}
                  id="fechaEntrega"
                  name="fechaEntrega"
                  value={formData.fechaEntrega}
                  onChange={handleChange}
                />
                {errors.fechaEntrega && <div className="invalid-feedback">{errors.fechaEntrega}</div>}
              </div>

              {esEdicion && (
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="completado"
                      name="completado"
                      checked={formData.completado}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="completado">
                      Tarea completada
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCerrar} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {esEdicion ? "Actualizar" : "Crear"} Tarea
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormularioTarea
