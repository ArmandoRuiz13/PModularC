'use strict';


// Select current page on menú to add class 'MenuPicked'
const reportar = document.querySelectorAll('.nav-item a').item(2);
const boton_reportar = document.querySelector('#mandar_reporte_btn');
reportar.id = 'MenuPicked';
 
// Get DOM elements
// Formulario de reporte
const formReporte = document.getElementById('formReport');

// Campos comunes
const tipoEdificioInput = document.getElementById('tipo_edificio');


// Academicos
const letraEdificio = document.getElementById('letraEdificio-container');
const numeroSalon = document.getElementById('numeroSalon-container');

// Baños
const tipoBaño = document.getElementById('tipoBaño-container');
const edificioBaño = document.getElementById('edificioBaño-container');
const pisoBaño = document.getElementById('pisoBaño-container');

// Areas Comunes
const tipoAreaComun = document.getElementById('tipoAreaComun-container');
const tipoAreaComunInput = document.getElementById('tipo_area_comun');
const ubicacionArea = document.getElementById('ubicacion_area-container');

// Departamentos
const tipoDepartamento = document.getElementById('tipoDepartamento-container');
const tipoDepartamentoInput = document.getElementById('tipo_departamento');
const tipoEdificioDepartamento = document.getElementById('tipoEdificioDepartamento-container');
const tipoEdificioDepartamentoInput = document.getElementById('tipo_edificio_departamento');
const ubicacionDepartamento = document.getElementById('ubicacionDepartamento-container');

// Modal

const myModal = new bootstrap.Modal(document.getElementById('datosReportarModal'));
const btnAbrirModal = document.getElementById('btn-abrir-modal');
const datosEdificioModal = document.getElementById('datos_edificio_modal');
const datosProblemaModal = document.getElementById('datos_problema_modal');
let BodyModal = document.querySelector('.modal-body');


// Opciones edificio

const btnNext = document.getElementById('btn-next');
const btnPreviews = document.getElementById('btn-previews');
const mireportes = document.querySelector('.mireportes');
const mireportes1 = document.querySelector('.mireportes1');

// Opciones edificio departamento 

const opcionesEdificioDepartamento = {
    "Administrativos": 
        `<option value="" selected>Seleccionar</option>
        <option value="Unidad de Planeación">Unidad de Planeación</option>
        <option value="Unidad de Presupuesto">Unidad de Presupuesto</option>
        <option value="Unidad de Servicio Social">Unidad de Servicio Social</option>
        <option value="Auditorio Antonio Rodríguez">Auditorio Antonio Rodríguez</option>
        <option value="Jefatura del departamento de Ingeniería Química">Jefatura del departamento de Ingeniería Química</option>
        <option value="Museo de mineralogía">Museo de mineralogía</option>
        <option value="Servicios médicos integrales">Servicios médicos integrales</option>
        <option value="COMITÉ DE ALUMOS DE LA DIVISIÓN DE CIENCIAS BÁSICAS">COMITÉ DE ALUMOS DE LA DIVISIÓN DE CIENCIAS BÁSICAS</option>
        <option value="MAESTRÍA EN CIENCIAS QUÍMICAS">MAESTRÍA EN CIENCIAS QUÍMICAS</option>
        <option value="UNIDAD DE VINCULACIÓN">UNIDAD DE VINCULACIÓN</option>
        <option value="UNIDAD INTERNA DE PROTECCIÓN CIVIL">UNIDAD INTERNA DE PROTECCIÓN CIVIL</option>
        <option value="DIVISIÓN DE CIENCIAS BÁSICAS">DIVISIÓN DE CIENCIAS BÁSICAS</option>
        <option value="RADIO CUCEI">RADIO CUCEI</option>
        <option value="Auditorio Antonio Alatorre">Auditorio Antonio Alatorre</option>
        <option value="Departamento de Ingeniería Industrial">Departamento de Ingeniería Industrial</option>
        <option value="Departamento de Ciencias Computacionales">Departamento de Ciencias Computacionales</option>
        <option value="Departamento de Ingeniería Civil y Topográfica">Departamento de Ingeniería Civil y Topográfica</option>
        <option value="Departamento de Ingeniería Mecánica Eléctrica">Departamento de Ingeniería Mecánica Eléctrica</option>
        <option value="División de Electrónica y Computación">División de Electrónica y Computación</option>
        <option value="División Ingenierías">División Ingenierías</option>
        <option value="Sala de maestros de electrónica y computación">Sala de maestros de electrónica y computación</option>
        <option value="Maestría en Ciencias en Ingeniería Electrónica y Computación">Maestría en Ciencias en Ingeniería Electrónica y Computación</option>
        <option value="Oficinas de investigadores">Oficinas de investigadores</option>
        <option value="Oficinas del STAUdeG">Oficinas del STAUdeG</option>
        <option value="Aula de posgrados en Ciencias de la Hidrometeorología">Aula de posgrados en Ciencias de la Hidrometeorología</option>
        <option value="Departamento de Matemáticas">Departamento de Matemáticas</option>
        <option value="Maestría en Ciencias en Química">Maestría en Ciencias en Química</option>
        <option value="Salas audiovisuales">Salas audiovisuales</option>
        <option value="Sala de lectura de Matemáticas">Sala de lectura de Matemáticas</option>
        <option value="Comité de Computación">Comité de Computación</option>
        <option value="Comité de Física">Comité de Física</option>
        <option value="Comité de Informática">Comité de Informática</option>
        <option value="Comité de Matemáticas">Comité de Matemáticas</option>
        <option value="Oficina 1">Oficina 1</option>
        <option value="Oficinas del servicio social">Oficinas del servicio social</option>`,
    "Coordinacion":
        `<option value="" selected>Seleccionar</option>
        <option value="Computación">Computación</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Coordinación de Comisiones del Consejo de Centro">Coordinación de Comisiones del Consejo de Centro</option>
        <option value="Coordinación de Control Escolar">Coordinación de Control Escolar</option>
        <option value="Coordinación de Extensión">Coordinación de Extensión</option>
        <option value="Coordinación de Finanzas">Coordinación de Finanzas</option>
        <option value="Coordinación de Personal">Coordinación de Personal</option>
        <option value="Coordinación de Servicios Académicos">Coordinación de Servicios Académicos</option>
        <option value="Coordinación de Servicios Generales">Coordinación de Servicios Generales</option>
        <option value="Coordinación de la licenciatura de Ingeniería Química">Coordinación de la licenciatura de Ingeniería Química</option>
        <option value="Coordinacion de la maestría en Sistemas de Calidad">Coordinacion de la maestría en Sistemas de Calidad</option>
        <option value="Coordinación de licenciatura en Ingeniería en Computación">Coordinación de licenciatura en Ingeniería en Computación</option>
        <option value="Coordinación de licenciatura en Informática">Coordinación de licenciatura en Informática</option>
        <option value="Coordinación de licenciatura en Ingeniería Biomédica">Coordinación de licenciatura en Ingeniería Biomédica</option>
        <option value="Coordinación de licenciatura en Ingeniería en Comunicaciones y Electrónica">Coordinación de licenciatura en Ingeniería en Comunicaciones y Electrónica</option>
        <option value="Coordinación de Ingeniería Mecánica Eléctrica">Coordinación de Ingeniería Mecánica Eléctrica</option>
        <option value="Coordinación de licenciatura en Ingeniería Industrial">Coordinación de licenciatura en Ingeniería Industrial</option>
        <option value="Coordinación de licenciatura en Ingeniería Topográfica">Coordinación de licenciatura en Ingeniería Topográfica</option>
        <option value="Coordinación de la licenciatura en Física">Coordinación de la licenciatura en Física</option>
        <option value="Coordinación de la licenciatura en Matemáticas">Coordinación de la licenciatura en Matemáticas</option>`,

}

/**
 * Function to hide all form elements.
 */
function hideBuildingElements() {
    letraEdificio.hidden = true;
    numeroSalon.hidden = true;
    tipoBaño.hidden = true;
    edificioBaño.hidden = true;
    pisoBaño.hidden = true;
    tipoAreaComun.hidden = true;
    ubicacionArea.hidden = true;
    tipoDepartamento.hidden = true;
    ubicacionDepartamento.hidden = true;
    tipoEdificioDepartamento.hidden = true;
}

/** 
 * Reset values of all building form.
*/

function resetBuildingElements() {
    Array.from(document.querySelectorAll('.mireportes textarea')).forEach(input => input.value = "");
    Array.from(document.querySelectorAll('.mireportes select')).forEach(input => {
        if (input.id !== 'tipo_edificio') {
            input.value = "";
        }
    });
}


/** 
 * Reset values of all building form.
*/
function resetAllElements() {
    Array.from(document.querySelectorAll('textarea, select', 'input')).forEach(input => input.value = "");
}


/**
 * Function to reportValidity of sent inputs
*/

function reportValidityInputs(inputs, checkEmpty = false) {
    inputs.forEach((input) => {
        input.setCustomValidity("");
        if ((input.value == '' && checkEmpty) || !input.checkValidity()) {
            input.setCustomValidity("Este campo es requerido");
            input.reportValidity();
            return;
        }
    });
}


/** 
 * Add data to the modal.
*/
function addDataToModal(datosEdificio, inputProblemas) {
    
    let htmlProblema = `<h3 class="datos_modal-titulo fs-4">Problema</h3>`; 
    let htmlEdificios = `<h3 class="datos_modal-titulo fs-4">Edificio</h3>`;

    datosEdificioModal.innerHTML = '';
    datosProblemaModal.innerHTML = '';

    inputProblemas.forEach((field) => {
        htmlProblema += `<p class="fs-5"> <span class="fs-4 font-weight-bold">${field.dataset.titulo}</span> ${field.value}</p>`;
    });
 
    datosEdificio.forEach((field) => {
        htmlEdificios += `<p class="fs-5"> <span class="fs-4 font-weight-bold">${field.dataset.titulo}</span> ${field.value}</p>`;
    });

    // Add to modal 
    datosEdificioModal.insertAdjacentHTML('beforeend', htmlEdificios);
    datosProblemaModal.insertAdjacentHTML('beforeend', htmlProblema);

}

// Function to handle input change and show/hide elements
function handleInputChange(elementsToUnhide) {
    hideBuildingElements(); // Hide all form elements
    elementsToUnhide.forEach(element => element.hidden = false); // Unhide the selected elements
}

// Event listener for the 'change' event on the tipoEdificioInput select element
tipoEdificioInput.addEventListener('click', function (e) {
    let elementsToUnhide;

    if (e.target?.value === undefined)  return;

    
    this.querySelectorAll('label').forEach((element) => {
        if (element !== e.target) {
            element.classList.remove('btn-tipo-1__selected');
        } else{
            element.classList.add('btn-tipo-1__selected');
        }
    });

    // e.target.classList.add('btn-tipo-1__selected');

    if (e.target.value === 'Academico') {
        elementsToUnhide = [letraEdificio, numeroSalon]; // Additional element to unhide for Academicos
    } else if (e.target.value === 'Baños') {
        elementsToUnhide = [edificioBaño, pisoBaño, tipoBaño]; // Additional element to unhide for Baños
    } else if (e.target.value === 'Áreas comunes') {
        elementsToUnhide = [tipoAreaComun]; // Additional element to unhide for AreasComunes
    } else if (e.target.value === 'Departamento') {
        elementsToUnhide = [tipoDepartamento]; // Additional element to unhide for Departamento
    }
    handleInputChange(elementsToUnhide); // Call the handleInputChange function
});

// Event listener for the 'change' event on the tipoDepartamentoInput select element
tipoDepartamentoInput.addEventListener('change', function () {
    let elementToUnhide;
    if (tipoDepartamentoInput.value === 'Administrativos' || tipoDepartamentoInput.value === 'Coordinacion') {
        tipoEdificioDepartamentoInput.innerHTML = opcionesEdificioDepartamento[tipoDepartamentoInput.value];
        elementToUnhide = tipoEdificioDepartamento; // Additional element to unhide for Administrativos and Coordinacion
    } else if (tipoDepartamentoInput.value != '') {
        elementToUnhide = ubicacionDepartamento; // Additional element to unhide for other options
    }
    handleInputChange([tipoDepartamento, elementToUnhide]); // Call the handleInputChange function
});

// Event listener for the 'change' event on the tipoAreaComunInput select element
tipoAreaComunInput.addEventListener('change', function () {
    handleInputChange([tipoAreaComun, ubicacionArea]); // Call the handleInputChange function
});


/**
 * Event listener for the 'click' event on the sendFormReportButton button.
 * Handles the logic for submitting the form based on the selected tipoEdificioInput value.
 */
btnAbrirModal.addEventListener('click', function () {
  
    const inputEdificios = Array.from(document.querySelectorAll('.mireportes select, .mireportes textarea'))
        .filter(input => !input.parentElement.hidden);

    const inputProblemas = Array.from(document.querySelectorAll('.mireportes1 select, .mireportes1 textarea'));
    
    // Report validity of inputs
    reportValidityInputs(inputEdificios, true);
    reportValidityInputs(inputProblemas);

    addDataToModal(inputEdificios, inputProblemas);

    // Open the modal if all fields are valid
    if (inputEdificios.every(field => field.checkValidity()) && inputProblemas.every(field => field.checkValidity())) {
        myModal.show();
    }
});

boton_reportar.addEventListener('click',function(){
    
    BodyModal.innerHTML = `<div id="loading" class="loading-container">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </div>`;  
});

// Call the resetAllElements function to reset the values of all form elements
resetAllElements();
// Obtener la cadena de consulta de la URL
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let qValue = urlParams.get('success');

const myModalConfirmation = new bootstrap.Modal(document.getElementById('sendConfirmationModal'));
const bodyModalConfirmation = document.querySelector('#sendConfirmationModal .modal-body');
const url = new URL(window.location);
url.searchParams.delete('qValue'); // Elimina el parámetro 'qValue'
    
if (qValue === 'true') {
    bodyModalConfirmation.innerHTML = `<div class="fs-4 success-message">¡Reporte enviado con éxito!</div>`;
    myModalConfirmation.show();   
    window.history.replaceState({}, document.title, url.pathname);
} else if (qValue === 'false') {
    bodyModalConfirmation.innerHTML = `<div class="fs-4 error-message">¡Error en el envío!</div>`;
    myModalConfirmation.show();  
    window.history.replaceState({}, document.title, url.pathname);
}


btnNext.addEventListener('click', function () {
    mireportes.classList.add('hidden');
    mireportes1.classList.remove('hidden');

});

btnPreviews.addEventListener('click', function () {
    mireportes1.classList.add('hidden');
    mireportes.classList.remove('hidden');
});