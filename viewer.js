// viewer.js - Visor IFC funcional y robusto
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

// Elementos del DOM
const container = document.getElementById('viewer-container');
const input = document.getElementById('file-input');

// Instancia del visor
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xf5f7fa)
});

// Configuración esencial
viewer.IFC.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc-viewer@1.1.15/dist/');
viewer.grid.setGrid();
viewer.axes.setAxes();

// Habilitar sombras
viewer.context.renderer.shadowMap.enabled = true;
viewer.context.renderer.shadowMap.type = 1; // PCFSoftShadowMap

// Modelo de ejemplo confiable
const SAMPLE_MODEL_URL = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

// Cargar modelo desde URL
async function loadIfc(url) {
    try {
        // Limpiar escena anterior
        viewer.IFC.context.ifcModels.forEach(model => {
            viewer.IFC.context.scene.remove(model.mesh);
        });

        const model = await viewer.IFC.loadIfcUrl(url, true);
        
        // Ajustar cámara al modelo
        viewer.IFC.context.ifcCamera.zoomToFit(model);

        // Aplicar sombras
        await viewer.shadowDropper.renderShadow(model.modelID);

        console.log('Modelo cargado:', model);
    } catch (err) {
        console.error('Error al cargar IFC:', err);
        alert('No se pudo cargar el modelo. Verifica que el archivo sea válido (.ifc).');
    }
}

// Cargar modelo de ejemplo al inicio
loadIfc(SAMPLE_MODEL_URL);

// Carga de archivo local
let currentObjectUrl = null;

input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revocar URL anterior
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);
    await loadIfc(currentObjectUrl);
});
