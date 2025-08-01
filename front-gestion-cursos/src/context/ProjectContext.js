"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import axios from "axios"

const ProjectContext = createContext()

const API_URL = "http://localhost:5000/api/proyectos"

const initialState = {
  proyectos: [],
  proyectoActual: null,
  loading: false,
  error: null,
}

const projectReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_PROYECTOS":
      return { ...state, proyectos: action.payload, loading: false }
    case "SET_PROYECTO_ACTUAL":
      return { ...state, proyectoActual: action.payload, loading: false }
    case "ADD_PROYECTO":
      return { ...state, proyectos: [...state.proyectos, action.payload], loading: false }
    case "UPDATE_PROYECTO":
      return {
        ...state,
        proyectos: state.proyectos.map((p) => (p._id === action.payload._id ? action.payload : p)),
        proyectoActual: action.payload,
        loading: false,
      }
    case "DELETE_PROYECTO":
      return {
        ...state,
        proyectos: state.proyectos.filter((p) => p._id !== action.payload),
        loading: false,
      }
    default:
      return state
  }
}

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  const obtenerProyectos = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.get(API_URL)
      dispatch({ type: "SET_PROYECTOS", payload: response.data })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const obtenerProyecto = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.get(`${API_URL}/${id}`)
      dispatch({ type: "SET_PROYECTO_ACTUAL", payload: response.data })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const crearProyecto = async (proyecto) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post(API_URL, proyecto)
      dispatch({ type: "ADD_PROYECTO", payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const actualizarProyecto = async (id, proyecto) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.put(`${API_URL}/${id}`, proyecto)
      dispatch({ type: "UPDATE_PROYECTO", payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const eliminarProyecto = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      await axios.delete(`${API_URL}/${id}`)
      dispatch({ type: "DELETE_PROYECTO", payload: id })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const agregarTarea = async (proyectoId, tarea) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.post(`${API_URL}/${proyectoId}/tareas`, tarea)
      dispatch({ type: "UPDATE_PROYECTO", payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const actualizarTarea = async (proyectoId, tareaId, tarea) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.put(`${API_URL}/${proyectoId}/tareas/${tareaId}`, tarea)
      dispatch({ type: "UPDATE_PROYECTO", payload: response.data })
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      throw error
    }
  }

  const eliminarTarea = async (proyectoId, tareaId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await axios.delete(`${API_URL}/${proyectoId}/tareas/${tareaId}`)
      dispatch({ type: "UPDATE_PROYECTO", payload: response.data })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
    }
  }

  const filtrarTareasPorEstado = async (proyectoId, completado) => {
    try {
      const response = await axios.get(`${API_URL}/${proyectoId}/tareas/estado/${completado}`)
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      return []
    }
  }

  const filtrarTareasPorVencimiento = async (proyectoId, fecha) => {
    try {
      const response = await axios.get(`${API_URL}/${proyectoId}/tareas/vencimiento/${fecha}`)
      return response.data
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message })
      return []
    }
  }

  useEffect(() => {
    obtenerProyectos()
  }, [])

  const value = {
    ...state,
    obtenerProyectos,
    obtenerProyecto,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,
    agregarTarea,
    actualizarTarea,
    eliminarTarea,
    filtrarTareasPorEstado,
    filtrarTareasPorVencimiento,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject debe ser usado dentro de ProjectProvider")
  }
  return context
}
