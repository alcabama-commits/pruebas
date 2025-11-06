// viewer.js - Funciona con la implementación global de arriba
const container = document.getElementById('viewer-container');
const input = document.getElementById('file-input');
const loadingText = container.querySelector('.loading');

// Instancia del visor
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new THREE.Color(0xf5f7fa)
});

// Configuración visual
viewer.grid.setGrid();
viewer.axes.setAxes();

// Modelo de ejemplo
const SAMPLE_URL = 'https://ifcjs.github.io/web-ifc-viewer/example/models/01.ifc';

async function loadIfc(url) {
    try {
        loadingText.style.display = 'block';
        loadingText.textContent = 'Cargando...';
        loadingText.style.color = '#1a3d7c';

        // Limpiar
        viewer.IFC.context.ifcModels.forEach(m => m.mesh && viewer.IFC.context.scene.remove(m.mesh));
        viewer.IFC.context.ifcModels = [];

        // Cargar
        const model = await viewer.IFC.loadIfcUrl(url);

        loadingText.style.display = 'none';
        console.log('Modelo cargado:', model);
    } catch (err) {
        console.error(err);
        loadingText.textContent = 'Error al cargar IFC';
        loadingText.style.color = '#e74c3c';
    }
}

// Cargar ejemplo
loadIfc(SAMPLE_URL);

// Carga local
let currentUrl = null;
input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(file);
    loadIfc(currentUrl);
});
