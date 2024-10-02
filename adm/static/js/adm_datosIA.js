// Select current page on menu to add class 'MenuPicked'
const reportar = document.querySelectorAll('.nav-item a').item(4);
reportar.id = 'MenuPicked';

// Gráfica Dashboard
const ctxDashboard = document.getElementById('dashboardChart').getContext('2d');

const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
    'Octubre', 'Noviembre', 'Diciembre'];

const url = 'https://iasimulacion-gaffbnd7atazcag2.mexicocentral-01.azurewebsites.net'; // Add 'http://' protocol
// const url = 'http://localhost:5000'; // Add 'http://' protocol
async function getPredictions() {
    try {
        const response = await fetch(`${url}/api/problems/predict?month=true&forecast_steps=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }



        const data = await response.json();

        console.log(data);
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

async function getSimulation13Months() {
    try {
        const response = await fetch(`${url}/api/problems?group_month=true&last_13_months=true&group_problem_type=true`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
  
        // Array de meses en español para usarlos en las etiquetas del eje X
        const arrayMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'];

        // Inicializar un objeto para almacenar los reportes por tipo de problema
        const reportesPorProblema = {
            'Humedad': new Array(13).fill(0),
            'Eléctrico': new Array(13).fill(0),
            'Físico': new Array(13).fill(0),
            'Ventilación': new Array(13).fill(0),
            'Electrodomésticos': new Array(13).fill(0)
        };

        // Recorrer los datos y agrupar por tipo de problema y mes
        data.forEach((item) => {
            const mes = item.mes; // Ejemplo: "2023-09"
            const tipoProblema = item.tipo_problema;
            const cantidad = item.cantidad_reportes;

            // Obtener el índice del mes en el array de meses
            const [year, month] = mes.split('-').map(Number);
            const mesIndex = (year === 2024 && month === 1) ? 12 : (month - 1);

            // Asignar la cantidad de reportes al índice correspondiente si existe en los problemas predefinidos
            if (reportesPorProblema[tipoProblema]) {
                reportesPorProblema[tipoProblema][mesIndex] += cantidad;
            }
        });

        // Sustituir los datos de las gráficas por los obtenidos del servidor
        const ctxSimulacion = document.getElementById('simulacionChart').getContext('2d');
        const lineasPuntosChart = new Chart(ctxSimulacion, {
            type: 'line',
            data: {
                labels: arrayMeses, // Meses para el eje X
                datasets: [
                    {
                        label: 'Humedad',
                        data: reportesPorProblema['Humedad'],
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
                        data: reportesPorProblema['Eléctrico'],
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
                        data: reportesPorProblema['Físico'],
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
                        data: reportesPorProblema['Ventilación'],
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
                        data: reportesPorProblema['Electrodomésticos'],
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
        
        await getSimulation13MonthsForBuilding();
    } catch (error) {
        console.error('Error fetching predictions:', error);
    }
}


async function getSimulation13MonthsForBuilding() {
    try {
        const response = await fetch(`${url}/api/problems?group_month=true&last_13_months=true&group_problem_type=true&group_building_type=true`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
       

        // Obtener el mes actual y calcular el mes de octubre del año pasado
        const now = new Date();

        const currentDate = new Date();
        let currentMonth = currentDate.getMonth(); // Mes actual (0 es enero, 11 es diciembre)
        let currentYear = currentDate.getFullYear();
    

        const lastYearOctober = new Date(now.getFullYear() - 1, currentMonth); // Mes 9 es Octubre

        // Filtrar los datos para obtener solo los reportes de Octubre del año pasado
        const filteredData = data.filter(item => {
            const reportDate = new Date(item.mes);
            return reportDate.getFullYear() === lastYearOctober.getFullYear() && reportDate.getMonth() === lastYearOctober.getMonth();
        });

        // Inicializar objetos para cada tipo de problema
        const problemasPorTipo = {
            'Humedad': {
                'Academico': 0,
                'Baños': 0,
                'Áreas comunes': 0,
                'Departamento': 0
            },
            'Ventilación': {
                'Academico': 0,
                'Baños': 0,
                'Áreas comunes': 0,
                'Departamento': 0
            },
            'Físico': {
                'Academico': 0,
                'Baños': 0,
                'Áreas comunes': 0,
                'Departamento': 0
            },
            'Electrodomésticos': {
                'Academico': 0,
                'Baños': 0,
                'Áreas comunes': 0,
                'Departamento': 0
            },
            'Eléctrico': {
                'Academico': 0,
                'Baños': 0,
                'Áreas comunes': 0,
                'Departamento': 0
            }
        };

        // Agrupar los datos por tipo de problema y tipo de edificio
        filteredData.forEach((item) => {
            const tipoProblema = item.tipo_problema;
            const tipoEdificio = item.tipo_edificio;
            const cantidad = item.cantidad_reportes;

            if (problemasPorTipo[tipoProblema] && problemasPorTipo[tipoProblema][tipoEdificio] !== undefined) {
                problemasPorTipo[tipoProblema][tipoEdificio] += cantidad;
            }
        });

        // Función para generar la tabla


        function generarTablaProblemas(tipoProblema) {
            return `
                <h3>${tipoProblema}</h3>
    
                <table border="1">
                    <thead>
                        <tr>
                            <th>Tipo de Edificio</th>
                            <th>Reportes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Académico</td><td>${problemasPorTipo[tipoProblema]['Academico']}</td></tr>
                        <tr><td>Baños</td><td>${problemasPorTipo[tipoProblema]['Baños']}</td></tr>
                        <tr><td>Áreas comunes</td><td>${problemasPorTipo[tipoProblema]['Áreas comunes']}</td></tr>
                        <tr><td>Departamento</td><td>${problemasPorTipo[tipoProblema]['Departamento']}</td></tr>
                    </tbody>
                </table>
            `;
        }

        // Generar las 5 tablas y colocarlas en el HTML
        currentYear = currentMonth === 11 ? currentYear : currentYear - 1;
        
        const contenedorTablas = document.getElementById('reportTablesContainer');
        contenedorTablas.insertAdjacentHTML('afterbegin', `<div class="text-center fs-3 my-5 pb-4"> Reportes     
        ${(currentMonth + 1) > 11 ? 'Enero' : arrayMeses[(currentMonth + 1)]}
        ${currentYear} por edificio y tipo de problema
        </div>`);

        document.getElementById('tablaHumedad').innerHTML = generarTablaProblemas('Humedad');
        document.getElementById('tablaVentilacion').innerHTML = generarTablaProblemas('Ventilación');
        document.getElementById('tablaFisico').innerHTML = generarTablaProblemas('Físico');
        document.getElementById('tablaElectrodomesticos').innerHTML = generarTablaProblemas('Electrodomésticos');
        document.getElementById('tablaElectrico').innerHTML = generarTablaProblemas('Eléctrico');
        
        currentMonth = currentMonth == 12 ? 1 : currentMonth + 1;
        currentMonth = currentMonth < 9 ? `0${currentMonth + 1}` : currentMonth + 1;


        let topReportedProblem;
        let topReportedBuildingType;

        const orderedEntries = Object.entries(problemasPorTipo).sort((a, b) => {
                const totalReportesA = Object.entries(a[1]).reduce((acc, curr) => acc + curr[1], 0);
                const totalReportesB = Object.entries(b[1]).reduce((acc, curr) => acc + curr[1], 0);
                return totalReportesB - totalReportesA;
        });

        const orderedBuldings = Object.entries(orderedEntries[0][1]).sort((a, b) =>{
            return b[1] - a[1];
            
        });
    
        // console.log(orderedEntries[0][0], orderedBuldings[0][0]);
        // Test, se va a cambiar
        await getSimulation13MonthsForMostReportedBuildings(orderedEntries[0][0], orderedBuldings[0][0], `${currentYear}-${currentMonth}`, orderedBuldings[0][1]);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}






async function getSimulation13MonthsForMostReportedBuildings(mostReportedProblem, mostReportedTBuildingType, month, totalReportesPorTipoEdificio) {
    try {


        const response = await fetch(`${url}/api/problems?group_month=true&last_13_months=true&group_problem_type=true
            &group_building_type=true&problem_type=${mostReportedProblem}&building_type=${mostReportedTBuildingType}&month=${month}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reportes = await response.json();
        
        // Agrupar por letra_edificio y sumar cantidad_reportes
        const reportesAgrupados = reportes.reduce((acc, reporte) => {
            const letra = reporte.letra_edificio;
            if (!acc[letra]) {
                acc[letra] = 0;
            }
            acc[letra] += reporte.cantidad_reportes;
            return acc;
        }, {});

        // Convertir el objeto en un array y ordenar de mayor a menor por total_reportes
        const top3Reportes = Object.keys(reportesAgrupados)
            .map(letra => ({
                letra_edificio: letra,
                total_reportes: reportesAgrupados[letra]
            }))
            .sort((a, b) => b.total_reportes - a.total_reportes).slice(0, 3); // Tomar los primeros 3

            // Crear la tabla HTML
            let tablaHTML = `
                <h3>Edificios  de academicos con más reportes de ${mostReportedProblem} en ${month}</h3>
                <table border="1">
               
                <tr>
                    <th>Letra del Edificio</th>
                    <th>Cantidad de Reportes</th>
                </tr>`;
            
            top3Reportes.forEach(reporte => {
                tablaHTML += `
                <tr>
                    <td>${reporte.letra_edificio}</td>
                    <td>${reporte.total_reportes}</td>
                </tr>`;
            });
            
            tablaHTML += `</table>`; // Ordenar de mayor a menor
            document.getElementById('tablaTopEdificios').innerHTML = tablaHTML;

            const topReportesSalones = reportes.filter(reporte => reporte.letra_edificio === top3Reportes[0].letra_edificio) 
                                       .sort((a, b) => b.total_reportes - a.total_reportes).slice(0, 3);

            tablaHTML = `
                <h3>Salones de academicos con más reportes de ${mostReportedProblem} en ${month}</h3>
                <table border="1">
               
                <tr>
                    <th>Número de salón</th>
                    <th>Cantidad de Reportes</th>
                </tr>`;
      
            topReportesSalones.forEach(reporte => {
                tablaHTML += `
                <tr>
                    <td>${reporte.numero_salon}</td>
                    <td>${reporte.cantidad_reportes}</td>
                </tr>`;
            });
            
            tablaHTML += `</table>`; // Ordenar de mayor a menor
            document.getElementById('tablaTopSalones').innerHTML = tablaHTML;
            
            const response2 = await fetch(`${url}/api/problems/predict?month=true&forecast_steps=12&problem_type=${mostReportedProblem}&building_type=${mostReportedTBuildingType}`);

            const predictions = await response2.json();

            const nextMonth = predictions.forecast[0].problemas;

            const average = predictions.forecast.reduce((acc, curr) => acc + curr.problemas, 0) / predictions.forecast.length;

            const increasePercentage = Math.round((nextMonth / average) * 100);
            
            const simulacionConclusiones = document.querySelector('#simulacion-conclusiones');

            simulacionConclusiones.innerHTML = ` Se espera un ${increasePercentage}% más que el promedio de reportes de ${mostReportedProblem} en los edificios de ${mostReportedTBuildingType} 
            en el mes de ${arrayMeses[Number.parseInt(month.split("-")[1]) - 1]}`;

          
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log(`${url}/api/problems/simulation?
                tipo_problema=${mostReportedProblem}&tipo_edificio=${mostReportedTBuildingType}&
                cantidad_reportes=${totalReportesPorTipoEdificio}`);
            const response3 = await fetch(`${url}/api/problems/simulation?tipo_problema=${mostReportedProblem}&tipo_edificio=${mostReportedTBuildingType}&cantidad_reportes=${totalReportesPorTipoEdificio}`);
        
            if (!response3.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const recomendacion = await response3.json();
            simulacionConclusiones.innerHTML += `<br> ${recomendacion.recomendacion}`;

            simulacionConclusiones.innerHTML += `<br> Se detecto un número inusual de problemas de Humedad en Noviembre: 69`;
    

         



    } catch (error) {
        console.error('Error fetching predictions:', error);
    }
}


getSimulation13Months();




// const ctxTopLugares = document.getElementById('topLugaresChart').getContext('2d');
// const topLugaresChart = new Chart(ctxTopLugares, {
//     type: 'bar',
//     data: {
//         labels: ['Aula 101', 'Biblioteca', 'Gimnasio', 'Laboratorio', 'Cafetería', 'Auditorio', 'Baños', 'Patio', 'Oficinas', 'Estacionamiento'],
//         datasets: [{
//             label: 'Número de Reportes',
//             data: [12, 9, 7, 6, 5, 4, 3, 3, 2, 1],
//             backgroundColor: 'rgba(54, 162, 235, 0.6)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1
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

// const ctxAnalisisCausas = document.getElementById('analisisCausasChart').getContext('2d');
// const analisisCausasChart = new Chart(ctxAnalisisCausas, {
//     type: 'pie',
//     data: {
//         labels: ['Fallas Eléctricas', 'Fugas de Agua', 'Problemas Estructurales', 'Otros'],
//         datasets: [{
//             label: 'Causas de Problemas',
//             data: [40, 25, 20, 15],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.6)',
//                 'rgba(54, 162, 235, 0.6)',
//                 'rgba(255, 206, 86, 0.6)',
//                 'rgba(75, 192, 192, 0.6)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)'
//             ],
//             borderWidth: 1
//         }]
//     },
//     options: {
//         responsive: true
//     }
// });

// const ctxEstadisticas = document.getElementById('estadisticasChart').getContext('2d');
// const estadisticasChart = new Chart(ctxEstadisticas, {
//     type: 'radar',
//     data: {
//         labels: ['Estructura', 'Electricidad', 'Plomería', 'Seguridad', 'Otros'],
//         datasets: [{
//             label: 'Calidad de Mantenimiento',
//             data: [80, 60, 70, 90, 50],
//             backgroundColor: 'rgba(153, 102, 255, 0.6)',
//             borderColor: 'rgba(153, 102, 255, 1)',
//             borderWidth: 1,
//             fill: true
//         }]
//     },
//     options: {
//         responsive: true,
//         scales: {
//             r: {
//                 beginAtZero: true
//             }
//         }
//     }
// });

// const ctxFrecuenciaReportes = document.getElementById('frecuenciaReportesChart').getContext('2d');
// const frecuenciaReportesChart = new Chart(ctxFrecuenciaReportes, {
//     type: 'bar',
//     data: {
//         labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
//         datasets: [{
//             label: 'Frecuencia de Reportes',
//             data: [5, 8, 6, 10, 15, 12],
//             backgroundColor: 'rgba(255, 159, 64, 0.6)',
//             borderColor: 'rgba(255, 159, 64, 1)',
//             borderWidth: 1
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
// // const lineasPuntosChart = new Chart(ctxSimulacion, {
// //     type: 'line',
// //     data: {
// //         labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero'],
// //         datasets: [
// //             {
// //                 label: 'Humedad',
// //                 data: [5, 10, 15, 8, 6, 12, 18, 14, 9, 11, 7, 10],
// //                 borderColor: 'rgba(54, 162, 235, 1)',
// //                 backgroundColor: 'rgba(54, 162, 235, 0.1)', // Color de fondo debajo de la línea
// //                 borderWidth: 2,
// //                 pointBackgroundColor: 'rgba(54, 162, 235, 1)',
// //                 pointBorderColor: '#fff',
// //                 pointBorderWidth: 2,
// //                 pointRadius: 5,
// //                 pointHoverRadius: 7,
// //                 fill: false // Desactiva el fondo
// //             },
// //             {
// //                 label: 'Eléctrico',
// //                 data: [7, 8, 10, 15, 12, 11, 16, 13, 8, 9, 14, 11],
// //                 borderColor: 'rgba(255, 206, 86, 1)',
// //                 backgroundColor: 'rgba(255, 206, 86, 0.1)', // Color de fondo debajo de la línea
// //                 borderWidth: 2,
// //                 pointBackgroundColor: 'rgba(255, 206, 86, 1)',
// //                 pointBorderColor: '#fff',
// //                 pointBorderWidth: 2,
// //                 pointRadius: 5,
// //                 pointHoverRadius: 7,
// //                 fill: false // Desactiva el fondo
// //             },
// //             {
// //                 label: 'Físico',
// //                 data: [3, 5, 8, 2, 5, 9, 10, 5, 2, 7, 2, 3],
// //                 borderColor: '#795757',
// //                 backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
// //                 borderWidth: 2,
// //                 pointBackgroundColor: '#795757',
// //                 pointBorderColor: '#fff',
// //                 pointBorderWidth: 2,
// //                 pointRadius: 5,
// //                 pointHoverRadius: 7,
// //                 fill: false // Desactiva el fondo
// //             },
// //             {
// //                 label: 'Ventilación',
// //                 data: [1, 6, 5, 2, 5, 9, 10, 5, 2, 7, 2, 3],
// //                 borderColor: 'rgb(152, 255, 152)',
// //                 backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
// //                 borderWidth: 2,
// //                 pointBackgroundColor: 'rgb(152, 255, 152)',
// //                 pointBorderColor: '#fff',
// //                 pointBorderWidth: 2,
// //                 pointRadius: 5,
// //                 pointHoverRadius: 7,
// //                 fill: false // Desactiva el fondo
// //             },
// //             {
// //                 label: 'Electrodomésticos',
// //                 data: [3, 6, 9, 7, 5, 8, 12, 10, 6, 8, 5, 9],
// //                 borderColor: 'rgba(255, 99, 132, 1)',
// //                 backgroundColor: 'rgba(255, 99, 132, 0.1)', // Color de fondo debajo de la línea
// //                 borderWidth: 2,
// //                 pointBackgroundColor: 'rgba(255, 99, 132, 1)',
// //                 pointBorderColor: '#fff',
// //                 pointBorderWidth: 2,
// //                 pointRadius: 5,
// //                 pointHoverRadius: 7,
// //                 fill: false // Desactiva el fondo
// //             }
// //         ]
// //     },
// //     options: {
// //         responsive: true,
// //         scales: {
// //             x: {
// //                 title: {
// //                     display: true,
// //                     text: 'Meses'
// //                 }
// //             },
// //             y: {
// //                 beginAtZero: true,
// //                 title: {
// //                     display: true,
// //                     text: 'Número de Reportes'
// //                 }
// //             }
// //         },
// //         plugins: {
// //             title: {
// //                 display: true,
// //                 text: 'Tipos de Problemas a lo Largo del Año'
// //             }
// //         }
// //     }
// // });



// // Función para agregar conclusiones dinámicas
// function agregarConclusion(tablaId, texto) {
//     const tabla = document.getElementById(tablaId);
//     const nuevaFila = document.createElement('tr');
//     const nuevaCelda = document.createElement('td');
//     nuevaCelda.textContent = texto;
//     nuevaFila.appendChild(nuevaCelda);
//     tabla.prepend(nuevaFila);

//     if (tabla.rows.length > 5) {
//         tabla.deleteRow(5); // Limitar a 5 filas visibles
//     }
// }

// Ejemplos de agregar conclusiones cada cierto tiempo
// setInterval(() => {
//     agregarConclusion('dashboard-conclusiones', 'Nueva predicción añadida en el Dashboard.');
// }, 5000); // Cada 5 segundos

// setInterval(() => {
//     agregarConclusion('lugares-conclusiones', 'Nueva conclusión sobre los lugares más reportados.');
// }, 7000); // Cada 7 segundos

// setInterval(() => {
//     agregarConclusion('analisis-conclusiones', 'Nuevo análisis añadido.');
// }, 6000); // Cada 6 segundos

// setInterval(() => {
//     agregarConclusion('estadisticas-conclusiones', 'Nuevas estadísticas detalladas disponibles.');
// }, 8000); // Cada 8 segundos

// setInterval(() => {
//     agregarConclusion('alertas-conclusiones', 'Nueva alerta añadida.');
// }, 9000); // Cada 9 segundos

// setInterval(() => {
//     agregarConclusion('simulacion-conclusiones', 'Nueva simulación de escenario completada.');
// }, 10000); // Cada 10 segundos