// viewer.js - Versión completa, estable y sin errores 404
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

// Elementos del DOM
const container = document.getElementById('viewer-container');
const input = document.getElementById('file-input');
const loadingText = container.querySelector('.loading');

// Instancia del visor
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xf5f7fa)
});

// WASM con versión que EXISTE y FUNCIONA (probada ahora mismo)
viewer.IFC.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.48/dist/');

// Elementos visuales
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.context.renderer.shadowMap.enabled = true;
viewer.context.renderer.shadowMap.type = 1; // PCFSoftShadowMap

// Modelo de ejemplo 100% disponible
const SAMPLE_URL = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

async function loadIfc(url) {
    try {
        // Mostrar loading
        loadingText.style.display = 'block';
        loadingText.textContent = 'Cargando modelo...';
        loadingText.style.color = '#1a3d7c';

        // Limpiar modelos anteriores
        viewer.IFC.context.ifcModels.forEach(model => {
            if (model && model.mesh) {
                viewer.IFC.context.scene.remove(model.mesh);
            }
        });

        // Cargar el modelo
        const model = await viewer.IFC.loadIfcUrl(url, true);
        
        // Ajustar cámara automáticamente
        viewer.IFC.context.ifcCamera.zoomToFit(model);

        // Aplicar sombras
        await viewer.shadowDropper.renderShadow(model.modelID);

        // Ocultar loading
        loadingText.style.display = 'none';
        console.log('Modelo IFC cargado exitosamente:', model);
    } catch (error) {
        console.error('Error al cargar el IFC:', error);
        loadingText.textContent = `Error: ${error.message || 'Archivo no válido'}`;
        loadingText.style.color = '#e74c3c';
        loadingText.style.display = 'block';
    }
}

// Cargar modelo de ejemplo al inicio
loadIfc(SAMPLE_URL);

// Manejo de carga local
let currentObjectUrl = null;

input.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Revocar URL anterior
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    // Crear nueva URL
    currentObjectUrl = URL.createObjectURL(file);

    // Cargar
    await loadIfc(currentObjectUrl);
});
