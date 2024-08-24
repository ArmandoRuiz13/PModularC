// Select current page on menu to add class 'MenuPicked'
const reportar = document.querySelectorAll('.nav-item a').item(4);
reportar.id = 'MenuPicked';

// Gráfica Dashboard
const ctxDashboard = document.getElementById('dashboardChart').getContext('2d');
const dashboardChart = new Chart(ctxDashboard, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [{
            label: 'Probabilidad de Problemas',
            data: [5, 10, 15, 20, 30, 35],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Función para agregar conclusiones dinámicas
function agregarConclusion(tablaId, texto) {
    const tabla = document.getElementById(tablaId);
    const nuevaFila = document.createElement('tr');
    const nuevaCelda = document.createElement('td');
    nuevaCelda.textContent = texto;
    nuevaFila.appendChild(nuevaCelda);
    tabla.prepend(nuevaFila);

    if (tabla.rows.length > 5) {
        tabla.deleteRow(5); // Limitar a 5 filas visibles
    }
}

// Ejemplos de agregar conclusiones cada cierto tiempo
setInterval(() => {
    agregarConclusion('dashboard-conclusiones', 'Nueva predicción añadida en el Dashboard.');
}, 5000); // Cada 5 segundos

setInterval(() => {
    agregarConclusion('lugares-conclusiones', 'Nueva conclusión sobre los lugares más reportados.');
}, 7000); // Cada 7 segundos

setInterval(() => {
    agregarConclusion('analisis-conclusiones', 'Nuevo análisis añadido.');
}, 6000); // Cada 6 segundos

setInterval(() => {
    agregarConclusion('estadisticas-conclusiones', 'Nuevas estadísticas detalladas disponibles.');
}, 8000); // Cada 8 segundos

setInterval(() => {
    agregarConclusion('alertas-conclusiones', 'Nueva alerta añadida.');
}, 9000); // Cada 9 segundos

setInterval(() => {
    agregarConclusion('simulacion-conclusiones', 'Nueva simulación de escenario completada.');
}, 10000); // Cada 10 segundos