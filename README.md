# Buscador de peliculas- React App

Buscador de películas moderno que utiliza la API de **OMDb** para mostrar información en tiempo real. Este proyecto se enfoca en el manejo eficiente de estados asíncronos y una interfaz de usuario fluida.

## Tecnologías
* **React 18**: Vite
* **TanStack Query (React Query)**: Gestión de caché y peticiones asíncronas.
* **Bootstrap 5**: Diseño responsive y componentes de UI.
* **OMDb API**: Fuente de datos de películas.

## Características
* **Búsqueda dinámica:** Resultados instantáneos al escribir.
* **Caché inteligente:** Evita peticiones repetidas gracias a React Query.
* **Detalles extendidos:** Modales con sinopsis, rating y reparto.
* **UX Mejorada:** Estados de carga (spinners), manejo de errores y animaciones CSS.

## Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/EdwinCastellanos22/Buscador-de-peliculas.git
   ```

2. Navega a la carpeta del repositorio:
    ``` bash
   cd buscador-de-peliculas
   ```

3. Instala las dependencias:
    ``` bash
    npm install
    ```
4. Crea un archivo .env en la raíz y añade tu API Key:
    ``` bash
    VITE_OMDB_KEY=tu_api_key_aqui
   ```
5. Inicia el proyecto
    ``` bash
    npm run dev
    ```

## Ejecución en Docker

1. Clona el repositorio:
   ```bash
   git clone https://github.com/EdwinCastellanos22/Buscador-de-peliculas.git
   ```

2. Navega a la carpeta del repositorio:
    ``` bash
   cd buscador-de-peliculas

3. Iniciar Docker Compose
    ``` bash
   docker-compose up
   ```

4. Navegar al sitio
    ``` bash
   http://localhost:8080/
   ```

5. Detener Docker Compose
    ``` bash
   docker-compose down
    ```

---
[Haz clic aquí para ver la Demo](https://searchmovies-ffbm.onrender.com/)
---
