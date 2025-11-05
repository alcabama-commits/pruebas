// Importamos la clase del visor desde la librería
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

// Obtenemos las referencias a nuestros elementos HTML
const container = document.getElementById('viewer-container');

// Creamos una instancia del visor
const viewer = new IfcViewerAPI({
  container,
  backgroundColor: new Color(0xffffff), // Fondo blanco
});

// Le indicamos al visor dónde encontrar los archivos WASM necesarios
viewer.IFC.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.55/');

// Creamos una grilla y ejes para tener una referencia visual
viewer.grid.setGrid();
viewer.axes.setAxes();

// Función para cargar un modelo IFC desde una URL
async function loadIfcFromUrl(url) {
  const model = await viewer.IFC.loadIfcUrl(url);
  // Opcional: Añadir sombras para un mejor efecto visual
  await viewer.shadowDropper.renderShadow(model.modelID);
}

// URL del modelo de ejemplo. [1]
const sampleUrl = 'https://raw.githubusercontent.com/openBIMstandards/DataSetSchependomlaan/main/IFC%20Schependomlaan.ifc';

// Llamamos a la función para cargar el modelo
loadIfcFromUrl(sampleUrl);

// --- CÓDIGO AÑADIDO PARA CARGA LOCAL ---

// Obtenemos la referencia al input para cargar archivos locales
const input = document.getElementById('file-input');

// Configuramos el evento para cargar un archivo local cuando el usuario elija uno
input.addEventListener(
  'change',
  async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Creamos una URL para el archivo local
    const url = URL.createObjectURL(file);

    // Cargamos el nuevo modelo (esto reemplazará al anterior)
    await loadIfcFromUrl(url);
  }
);