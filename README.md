# PROYECTO-FINAL-GESTION-DE-PROYECTOS-Y-TAREAS
Ejercicio #1:
Este es un sistema completo de gestión de proyectos y tareas desarrollado con el stack MERN (MongoDB, Express, React, Node.js).

## Características

### Backend (Node.js + Express + MongoDB)
- **Modelo de Proyecto**: Incluye nombre, descripción, fechas, costo y estado
- **Modelo de Tarea**: Tareas anidadas dentro de proyectos con estado de completado
- **CRUD completo**: Para proyectos y tareas
- **Filtros avanzados**: Por estado de tarea y fecha de vencimiento
- **API RESTful**: Endpoints bien estructurados

### Frontend (React + Bootstrap)
- **Interfaz responsive**: Diseñada con Bootstrap 5
- **Gestión de estado**: Context API para manejo global del estado
- **Navegación**: React Router para SPA
- **Componentes reutilizables**: Arquitectura modular
- **Validación de formularios**: Validación en tiempo real
- **Filtros dinámicos**: Para tareas por estado y fecha

## Estructura del Proyecto

\`\`\`
├── back-gestion-cursos/          # Backend
│   ├── models/
│   │   └── Proyecto.js           # Modelo de MongoDB
│   ├── routes/
│   │   └── proyectos.js          # Rutas de la API
│   ├── server.js                 # Servidor principal
│   └── package.json
│
└── front-gestion-cursos/         # Frontend
    ├── src/
    │   ├── components/           # Componentes React
    │   ├── context/              # Context API
    │   ├── App.js               # Componente principal
    │   └── index.js             # Punto de entrada
    └── package.json
\`\`\`

## Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (local o remoto)
- npm o yarn

### Backend
\`\`\`bash
cd back-gestion-cursos
npm install
npm run dev
\`\`\`

### Frontend
\`\`\`bash
cd front-gestion-cursos
npm install
npm start
\`\`\`

## Funcionalidades Principales

### Gestión de Proyectos
- ✅ Crear nuevos proyectos
- ✅ Listar todos los proyectos
- ✅ Editar proyectos existentes
- ✅ Eliminar proyectos
- ✅ Ver detalles del proyecto

### Gestión de Tareas
- ✅ Agregar tareas a proyectos
- ✅ Marcar tareas como completadas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ Filtrar por estado (completadas/pendientes)
- ✅ Filtrar por fecha de vencimiento

### Características Adicionales
- 📊 Barra de progreso del proyecto
- 🎨 Interfaz moderna y responsive
- ⚡ Notificaciones de éxito/error
- 🔍 Filtros dinámicos
- 📱 Diseño mobile-first

## API Endpoints

### Proyectos
- `GET /api/proyectos` - Obtener todos los proyectos
- `GET /api/proyectos/:id` - Obtener proyecto por ID
- `POST /api/proyectos` - Crear nuevo proyecto
- `PUT /api/proyectos/:id` - Actualizar proyecto
- `DELETE /api/proyectos/:id` - Eliminar proyecto

### Tareas
- `POST /api/proyectos/:id/tareas` - Agregar tarea
- `PUT /api/proyectos/:id/tareas/:tareaId` - Actualizar tarea
- `DELETE /api/proyectos/:id/tareas/:tareaId` - Eliminar tarea
- `GET /api/proyectos/:id/tareas/estado/:completado` - Filtrar por estado
- `GET /api/proyectos/:id/tareas/vencimiento/:fecha` - Filtrar por fecha

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Body-parser

### Frontend
- React 18
- React Router DOM
- Bootstrap 5
- Axios
- Context API
- Font Awesome

## Base de Datos

**Nombre de la base de datos**: `SuPrimerApellido`
**Colección**: `ProyectosuPrimerNombre`

### Esquema de Proyecto
\`\`\`javascript
{
  nombreProyecto: String,
  descripcion: String,
  fechaInicio: Date,
  fechaFin: Date,
  costo: Number,
  estado: String, // "Iniciado", "Completado", "Cancelado"
  tareas: [
    {
      nombreTarea: String,
      descripcion: String,
      completado: Boolean,
      fechaEntrega: Date
    }
  ]
}
\`\`\`

## Uso

1. **Crear un proyecto**: Navega a "Nuevo Proyecto" y completa el formulario
2. **Ver proyectos**: La página principal muestra todos los proyectos en tarjetas
3. **Gestionar tareas**: Haz clic en "Ver" en cualquier proyecto para gestionar sus tareas
4. **Filtrar tareas**: Usa los filtros por estado o fecha de vencimiento
5. **Editar/Eliminar**: Usa los botones correspondientes en cada elemento

## Contribución

Este proyecto fue desarrollado como parte de un ejercicio académico siguiendo las especificaciones del stack MERN.
