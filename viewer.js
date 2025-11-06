// viewer.js - Versión completa con implementación básica de IfcViewerAPI para evitar dependencias CDN problemáticas
const container = document.getElementById('viewer-container');
const input = document.getElementById('file-input');
const loadingText = container.querySelector('.loading');

// Instancia del visor (ahora definido en el inline script)
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new THREE.Color(0xf5f7fa)
});

// Elementos visuales
viewer.grid.setGrid();
viewer.axes.setAxes();

// Modelo de ejemplo (URL básica)
const SAMPLE_URL = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

async function loadIfc(url) {
    try {
        loadingText.style.display = 'block';
        loadingText.textContent = 'Cargando modelo...';
        loadingText.style.color = '#1a3d7c';

        // Limpiar modelos anteriores
        viewer.IFC.context.ifcModels.forEach(model => {
            if (model && model.mesh) {
                viewer.IFC.context.scene.remove(model.mesh);
            }
        });
        viewer.IFC.context.ifcModels = [];

        // Cargar el modelo
        const model = await viewer.IFC.loadIfcUrl(url);
        
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

    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);

    await loadIfc(currentObjectUrl);
});
