// Select current page on menu to add class 'MenuPicked'
const reportar = document.querySelectorAll('.nav-item a').item(4);
reportar.id = 'MenuPicked';

// Gráfica Dashboard
const ctxDashboard = document.getElementById('dashboardChart').getContext('2d');

const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
    'Octubre', 'Noviembre', 'Diciembre'];

// const url = 'https://iasimulacion-gaffbnd7atazcag2.mexicocentral-01.azurewebsites.net'; // Add 'http://' protocol
const url = 'http://localhost:5000'; // Add 'http://' protocol
async function getPredictions() {
    try {
        const response = await fetch(`${url}/api/problems/predict`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(Math.round(data.forecast[0].problemas));
        const problemas = data.forecast.map((item) => Math.round(item.problemas));
        const fechas = data.forecast.map((item) => {
            const date = new Date(item.date);
            return arrayMeses[date.getMonth()]; 
        });



        // Uncomment if you want to display the chart
        const dashboardChart = new Chart(ctxDashboard, {
            type: 'line',
            data: {
                labels: fechas,
                datasets: [{
                    label: 'Cantidad de Problemas esperados',
                    data: problemas,
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
    } catch (error) {
        console.error('Error fetching predictions:', error);
    }
}


getPredictions();

// const dashboardChart = new Chart(ctxDashboard, {
//     type: 'line',
//     data: {
//         labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
//         datasets: [{
//             label: 'Probabilidad de Problemas',
//             data: [5, 10, 15, 20, 30, 35],
//             backgroundColor: 'rgba(75, 192, 192, 0.6)',
//             borderColor: 'rgba(75, 192, 192, 1)',
//             borderWidth: 1,
//             fill: true
//         }]
//     },
//     options: {
//         responsive: true,
//         scales: {
//             y: {
//                 beginAtZero: true
//             }
//         }
//     }
// });


const ctxTopLugares = document.getElementById('topLugaresChart').getContext('2d');
const topLugaresChart = new Chart(ctxTopLugares, {
    type: 'bar',
    data: {
        labels: ['Aula 101', 'Biblioteca', 'Gimnasio', 'Laboratorio', 'Cafetería', 'Auditorio', 'Baños', 'Patio', 'Oficinas', 'Estacionamiento'],
        datasets: [{
            label: 'Número de Reportes',
            data: [12, 9, 7, 6, 5, 4, 3, 3, 2, 1],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
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

const ctxAnalisisCausas = document.getElementById('analisisCausasChart').getContext('2d');
const analisisCausasChart = new Chart(ctxAnalisisCausas, {
    type: 'pie',
    data: {
        labels: ['Fallas Eléctricas', 'Fugas de Agua', 'Problemas Estructurales', 'Otros'],
        datasets: [{
            label: 'Causas de Problemas',
            data: [40, 25, 20, 15],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true
    }
});

const ctxEstadisticas = document.getElementById('estadisticasChart').getContext('2d');
const estadisticasChart = new Chart(ctxEstadisticas, {
    type: 'radar',
    data: {
        labels: ['Estructura', 'Electricidad', 'Plomería', 'Seguridad', 'Otros'],
        datasets: [{
            label: 'Calidad de Mantenimiento',
            data: [80, 60, 70, 90, 50],
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true
            }
        }
    }
});

const ctxFrecuenciaReportes = document.getElementById('frecuenciaReportesChart').getContext('2d');
const frecuenciaReportesChart = new Chart(ctxFrecuenciaReportes, {
    type: 'bar',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [{
            label: 'Frecuencia de Reportes',
            data: [5, 8, 6, 10, 15, 12],
            backgroundColor: 'rgba(255, 159, 64, 0.6)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
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


const ctxSimulacion = document.getElementById('simulacionChart').getContext('2d');

const lineasPuntosChart = new Chart(ctxSimulacion, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
            {
                label: 'Humedad',
                data: [5, 10, 15, 8, 6, 12, 18, 14, 9, 11, 7, 10],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)', // Color de fondo debajo de la línea
                borderWidth: 2,
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false // Desactiva el fondo
            },
            {
                label: 'Eléctrico',
                data: [7, 8, 10, 15, 12, 11, 16, 13, 8, 9, 14, 11],
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.1)', // Color de fondo debajo de la línea
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 206, 86, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false // Desactiva el fondo
            },
            {
                label: 'Físico',
                data: [3, 5, 8, 2, 5, 9, 10, 5, 2, 7, 2, 3],
                borderColor: '#795757',
                backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
                borderWidth: 2,
                pointBackgroundColor: '#795757',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false // Desactiva el fondo
            },
            {
                label: 'Ventilación',
                data: [1, 6, 5, 2, 5, 9, 10, 5, 2, 7, 2, 3],
                borderColor: 'rgb(152, 255, 152)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
                borderWidth: 2,
                pointBackgroundColor: 'rgb(152, 255, 152)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false // Desactiva el fondo
            },
            {
                label: 'Electrodomésticos',
                data: [3, 6, 9, 7, 5, 8, 12, 10, 6, 8, 5, 9],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: false // Desactiva el fondo
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Meses'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Número de Reportes'
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: 'Tipos de Problemas a lo Largo del Año'
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

// setInterval(() => {
//     agregarConclusion('simulacion-conclusiones', 'Nueva simulación de escenario completada.');
// }, 10000); // Cada 10 segundos