// Importamos la clase del visor desde la librería
import { IfcViewerAPI } from "web-ifc-viewer";

// Obtenemos las referencias a nuestros elementos HTML
const container = document.getElementById("viewer-container");
const input = document.getElementById("file-input");

// Creamos una instancia del visor
const viewer = new IfcViewerAPI({ container });

// Le indicamos al visor dónde encontrar los archivos WASM necesarios
viewer.IFC.setWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.55/");

// Creamos una grilla y ejes para tener una referencia visual
viewer.grid.setGrid();
viewer.axes.setAxes();

// Configuramos el evento para cargar un archivo
input.addEventListener(
  "change",
  async (event) => {
    // Obtenemos el primer archivo seleccionado (si existe)
    const file = event.target.files[0];
    if (!file) return;

    // Creamos una URL local para el archivo
    const url = URL.createObjectURL(file);

    // Cargamos el modelo IFC en el visor
    await viewer.IFC.loadIfcUrl(url);
  },
  false
);