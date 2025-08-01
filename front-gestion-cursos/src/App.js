import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ProjectProvider } from "./context/ProjectContext"
import Navbar from "./components/Navbar"
import ListaProyectos from "./components/ListaProyectos"
import DetalleProyecto from "./components/DetalleProyecto"
import FormularioProyecto from "./components/FormularioProyecto"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App() {
  return (
    <ProjectProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<ListaProyectos />} />
              <Route path="/proyecto/nuevo" element={<FormularioProyecto />} />
              <Route path="/proyecto/editar/:id" element={<FormularioProyecto />} />
              <Route path="/proyecto/:id" element={<DetalleProyecto />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ProjectProvider>
  )
}

export default App
