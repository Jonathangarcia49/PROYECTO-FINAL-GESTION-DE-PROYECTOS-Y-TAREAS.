import { Link } from "react-router-dom"
import { useProject } from "../context/ProjectContext"
import ComponenteProyecto from "./ComponenteProyecto"

const ListaProyectos = () => {
  const { proyectos, loading, error } = useProject()

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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Lista de Proyectos</h1>
        <Link to="/proyecto/nuevo" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>
          Nuevo Proyecto
        </Link>
      </div>

      {proyectos.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <h3 className="text-muted">No hay proyectos</h3>
          <p className="text-muted">Comienza creando tu primer proyecto</p>
          <Link to="/proyecto/nuevo" className="btn btn-primary">
            Crear Proyecto
          </Link>
        </div>
      ) : (
        <div className="row">
          {proyectos.map((proyecto) => (
            <div key={proyecto._id} className="col-md-6 col-lg-4 mb-4">
              <ComponenteProyecto proyecto={proyecto} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ListaProyectos
