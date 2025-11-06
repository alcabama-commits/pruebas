// viewer.js
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

// Referencia al contenedor
const container = document.getElementById('viewer-container');

// Crear instancia del visor
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xf0f0f0) // Fondo gris claro suave
});

// Configurar ruta de los archivos WASM (¡MISMA VERSIÓN!)
viewer.IFC.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc-viewer@1.1.15/dist/');

// Añadir grilla y ejes
viewer.grid.setGrid();
viewer.axes.setAxes();

// Habilitar sombras (opcional, mejora realismo)
viewer.context.renderer.shadowMap.enabled = true;

// Función para cargar modelo desde URL
async function loadIfcFromUrl(url) {
    try {
        // Limpiar modelos anteriores
        viewer.IFC.context.ifcModels.forEach(model => {
            viewer.IFC.context.scene.remove(model);
        });

        const model = await viewer.IFC.loadIfcUrl(url);
        
        // Ajustar cámara automáticamente
        viewer.IFC.context.ifcCamera.zoomToFit(model);

        // Sombras (opcional)
        await viewer.shadowDropper.renderShadow(model.modelID);

        console.log("Modelo IFC cargado correctamente:", model);
    } catch (error) {
        console.error("Error al cargar el modelo:", error);
        alert("Error al cargar el archivo IFC. Verifica la consola.");
    }
}

// Modelo de ejemplo funcional (100% disponible)
const sampleUrl = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

// Cargar modelo de ejemplo al inicio
loadIfcFromUrl(sampleUrl);

// --- CARGA DE ARCHIVO LOCAL ---
const input = document.getElementById('file-input');

input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    // Limpiar URL anterior si existe
    if (input._currentUrl) {
        URL.revokeObjectURL(input._currentUrl);
    }
    input._currentUrl = url;

    await loadIfcFromUrl(url);
});
