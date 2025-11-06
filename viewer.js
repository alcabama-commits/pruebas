// viewer.js - 100% funcional en GitHub Pages
import { IfcViewerAPI } from 'web-ifc-viewer';
import { Color } from 'three';

const container = document.getElementById('viewer-container');
const input = document.getElementById('file-input');
const loadingText = container.querySelector('.loading');

const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xf5f7fa)
});

// Configuración esencial
viewer.IFC.setWasmPath('https://cdn.jsdelivr.net/npm/web-ifc-viewer@1.1.15/dist/');
viewer.grid.setGrid();
viewer.axes.setAxes();
viewer.context.renderer.shadowMap.enabled = true;
viewer.context.renderer.shadowMap.type = 1; // PCFSoftShadowMap

// Modelo de ejemplo confiable
const SAMPLE_URL = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

async function loadIfc(url) {
    try {
        // Limpiar modelos anteriores
        viewer.IFC.context.ifcModels.forEach(m => {
            if (m.mesh) viewer.IFC.context.scene.remove(m.mesh);
        });

        loadingText.style.display = 'block';
        loadingText.textContent = 'Cargando modelo 3D...';
        loadingText.style.color = '#1a3d7c';

        const model = await viewer.IFC.loadIfcUrl(url, true);
        
        // Zoom automático al modelo
        viewer.IFC.context.ifcCamera.zoomToFit(model);
        
        // Aplicar sombras
        await viewer.shadowDropper.renderShadow(model.modelID);
        
        loadingText.style.display = 'none';
        console.log('Modelo IFC cargado:', model);
    } catch (err) {
        console.error('Error al cargar IFC:', err);
        loadingText.textContent = 'Error: archivo no válido o corrupto';
        loadingText.style.color = '#e74c3c';
    }
}

// Cargar modelo de ejemplo al iniciar
loadIfc(SAMPLE_URL);

// Carga de archivo local
let currentObjectUrl = null;

input.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Revocar URL anterior para evitar memory leaks
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);
    await loadIfc(currentObjectUrl);
});
