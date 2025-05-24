# Aplicación de Lista de Tareas (To-Do List)

## Descripción
Una sencilla aplicación de lista de tareas para llevar un registro de temas pendientes. Permite agregar, completar y eliminar tareas. Las tareas ahora se gestionan a través de un backend Node.js y se persisten en una base de datos SQLite. El frontend (HTML, CSS, JavaScript) se comunica con este backend para todas las operaciones de tareas.

## Estado del Proyecto
Funcional (con backend)

## Configuración y Ejecución del Backend

Esta aplicación ahora utiliza un backend Node.js para gestionar las tareas.

### Prerrequisitos
*   Node.js (que incluye npm) debe estar instalado en tu sistema. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).

### Instalación de Dependencias
Una vez clonado el repositorio o descargados los archivos, navega a la carpeta raíz del proyecto en tu terminal y ejecuta el siguiente comando para instalar las dependencias necesarias para el backend:
```bash
npm install
```

### Ejecución del Servidor Backend
Para iniciar el servidor backend, ejecuta el siguiente comando desde la carpeta raíz del proyecto:
```bash
node server.js
```
Por defecto, el servidor se ejecutará en `http://localhost:3000`. Deberías ver un mensaje en la consola confirmando que el servidor está escuchando.

## Cómo Usar
1.  **Importante:** Asegúrate de que el servidor backend esté en ejecución (ver la sección "Configuración y Ejecución del Backend").
2.  Una vez que el backend esté corriendo, abre el archivo `index.html` en tu navegador web preferido.

La interfaz de usuario (frontend) se comunicará con el servidor backend local para cargar, agregar, completar y eliminar tareas.

### Funcionalidades:
*   **Agregar una nueva tarea:** Escribe la descripción de la tarea en el campo de texto y haz clic en el botón "Agregar Tarea". La nueva tarea aparecerá en la lista después de ser guardada en el backend.
*   **Marcar una tarea como completada:** Haz clic en el botón "Completar" asociado a la tarea. El estado se actualizará en el backend y el cambio se reflejará visualmente. Vuelve a hacer clic para desmarcarla.
*   **Eliminar una tarea:** Haz clic en el botón "Eliminar" asociado a la tarea. La tarea se eliminará del backend y de la lista.

## Tecnologías Utilizadas
*   **Frontend:**
    *   HTML5
    *   CSS3
    *   JavaScript (ES6+)
*   **Backend:**
    *   Node.js
    *   Express.js (para el servidor API)
    *   SQLite (para la base de datos)

## Contribuciones
Este es un proyecto simple con fines de demostración. Por el momento, no se buscan contribuciones externas.

## Licencia
Este proyecto es de código abierto. Siéntete libre de usarlo y modificarlo según tus necesidades.
