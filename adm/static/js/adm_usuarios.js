import { getCookie } from "./utils.js";

let BodyModal = document.querySelector("#SeguimientoUsuario .modal-body");
let content = "";
const currentUrl = window.location.href;
const url = new URL(currentUrl); // obtiene ruta relativa

// Select current page on menu to add class 'MenuPicked'
const reportar = document.querySelectorAll(".nav-item a").item(2);
reportar.id = "MenuPicked";

const btnStatusAceptar = document.createElement("button");
let idProblema;

const btnStatusRechazar = document.createElement("button");
const btnProblemaSiguiente = document.querySelector("#btn_problem_siguiente");
const btnProblemaAnterior = document.querySelector("#btn_problema_anterior");
const contenedorProblemas = document.querySelector("#contenedor_problemas");
let usuarios,
  pagina = 1,
  numPages;
let usuariosFiltrados;
let estatusCheckboxSeleccionado = "";

// DOM filtro de usuarios

const selectEstatus = document.querySelector("#estatus");
const selectGravedad = document.querySelector("#gravedad");
const selectTipoUsuario = document.querySelector("#tipo_usuario");
const selectTipoEdificio = document.querySelector("#tipo_edificio");
const selectFecha = document.querySelector("#fecha");
const selectReportesPorPagina = document.querySelector("#reportes_pagina");
const btnFiltrar = document.querySelector("#btn_filtrar");
const numResultados = document.querySelector("#num_resultados");

// DOM ordenar por
const thIdReporte = document.querySelector("#th_id_reporte");
const thFecha = document.querySelector("#th_fecha");
const thReportNum = document.querySelector("#th_reportnum");

// Búsqueda

const inputBusqueda = document.querySelector("#inputBusqueda");
const btnBusqueda = document.querySelector("#btnBusqueda");
const formBusqueda = document.querySelector("#formBusqueda");
let busquedaGlobal = "";

// Modal Info Adicional
// let modal = new bootstrap.Modal(document.getElementById('InfoAdiccional'));
// const btnCambiarEstatus = document.getElementById("btnCambiarEstatus");
// const textAreaInfoAdicional = document.getElementById("infoAdicional");
// const spanNuevoEstatus = document.getElementById("tituloNuevoEstatus");

// Button reload

const btnRecargarTabla = document.querySelector("#btnRecargarTabla");

const statusColors = {
  Aceptado: "bg-success text-white",
  Rechazado: "bg-danger text-white",
  Procesando: "bg-warning text-dark",
  Completado: "bg-info text-white",
};

thIdReporte.addEventListener("click", (e) => {
  let orden = e.target.dataset.orden;
  if (orden === "asc") {
    usuariosFiltrados = usuariosFiltrados.sort((a, b) => a.id - b.id);
    e.target.dataset.orden = "desc";
  } else {
    usuariosFiltrados = usuariosFiltrados.sort((a, b) => b.id - a.id);
    e.target.dataset.orden = "asc";
  }

  mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
  addEvents();
});
// Mapeo de gravedad a valores numéricos para la comparación
const gravedadOrden = {
  Menor: 1,
  Moderado: 2,
  Serio: 3,
  Crítico: 4,
};

// Seleccionar el elemento del encabezado de la columna de gravedad
const thGravedad = document.getElementById("thGravedad");

// Evento para el botón de recargar tabla

btnRecargarTabla.addEventListener("click", () => {
  cargarUsuarios();
  btnProblemaSiguiente.classList.add("invisible");
  btnProblemaAnterior.classList.add("invisible");
});

function realizarBusqueda(busqueda) {
  let problemasBusqueda = [];
  if (busqueda === "") {
    problemasBusqueda = usuarios;
  } else if (!isNaN(busqueda)) {
    problemasBusqueda = usuarios.filter((p) => p.id == busqueda);
  } else {
    problemasBusqueda = usuarios.filter((p) => {
      return (
        p.first_name.toLowerCase().includes(busqueda) ||
        p.last_name.toLowerCase().includes(busqueda) ||
        p.email.toLowerCase().includes(busqueda)
      );
    });
  }
  return problemasBusqueda;
}

// Barra de búsqueda
formBusqueda.addEventListener("submit", (event) => {
  event.preventDefault();
  busquedaGlobal = inputBusqueda.value;
  filtrar();
  inputBusqueda.value = "";
});

// Añadir el evento para la columna de gravedad
// thGravedad.addEventListener('click', (e) => {
//     let orden = e.target.dataset.orden;
//     console.log('Orden actual:', orden); // Verifica el estado actual

//     if (orden === 'asc') {
//         usuariosFiltrados = usuariosFiltrados.sort((a, b) => {
//             console.log('Comparando:', a.gravedad, b.gravedad); // Verifica los valores de gravedad
//             return gravedadOrden[a.gravedad_problema] - gravedadOrden[b.gravedad_problema];
//         });
//         e.target.dataset.orden = 'desc'; // Cambia a descendente
//     } else {
//         usuariosFiltrados = usuariosFiltrados.sort((a, b) => {
//             console.log('Comparando:', a.gravedad, b.gravedad); // Verifica los valores de gravedad
//             return gravedadOrden[b.gravedad_problema] - gravedadOrden[a.gravedad_problema];
//         });
//         e.target.dataset.orden = 'asc'; // Cambia a ascendente
//     }

//     // Actualiza la vista con los usuarios ordenados
//     mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
//     // Reaplicar eventos después de actualizar la vista
//     addEvents();
// });

document.addEventListener("DOMContentLoaded", function() {
  thFecha.addEventListener("click", (e) => {
    let orden = e.target.dataset.orden;

    const parseFecha = (fechaStr) => {
      const [dia, mes, anio] = fechaStr.split("/");
      return new Date(anio, mes - 1, dia);
    };

    usuariosFiltrados.sort((a, b) => {
      const fechaA = parseFecha(a.fecha_actualizado);
      const fechaB = parseFecha(b.fecha_actualizado);
      return orden === "asc" ? fechaA - fechaB : fechaB - fechaA;
    });

    e.target.dataset.orden = orden === "asc" ? "desc" : "asc";
    mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
    addEvents();
  });

  thReportNum.addEventListener("click", (e) => {
    let orden = e.target.dataset.orden;

    usuariosFiltrados.sort((a, b) => {
      const reportesA = a.num_reportes;
      const reportesB = b.num_reportes;
      return orden === "asc" ? reportesA - reportesB : reportesB - reportesA;
    });

    e.target.dataset.orden = orden === "asc" ? "desc" : "asc";
    mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
    addEvents();
  });
});


function filtrar() {
  btnProblemaSiguiente.classList.add("invisible");
  btnProblemaAnterior.classList.add("invisible");

  usuariosFiltrados = realizarBusqueda(busquedaGlobal.toLowerCase());

  // Obtener los checkboxes seleccionados
  // const estatusSeleccionados = [];
  // document.querySelectorAll('.form-check-input:checked').forEach(checkbox => {
  //     estatusSeleccionados.push(checkbox.value);
  // });

  // // Filtrar por estatus si no se seleccionan todos los checkboxes
  // if (estatusSeleccionados.length > 0 && estatusSeleccionados.length < 4) {
  //     usuariosFiltrados = usuariosFiltrados.filter(p => estatusSeleccionados.includes(p.estatus_problematica));
  // }

  // if (selectGravedad.value !== 'Todos') {
  //     usuariosFiltrados = usuariosFiltrados.filter(p => p.gravedad_problema === selectGravedad.value);
  // }
  // if (selectTipoProblema.value !== 'Todos') {
  //     usuariosFiltrados = usuariosFiltrados.filter(p => p.tipo_problema === selectTipoProblema.value);
  // }
  // if (selectTipoEdificio.value !== 'Todos') {
  //     usuariosFiltrados = usuariosFiltrados.filter(p => p.tipo_edificio === selectTipoEdificio.value);
  // }
  // if (selectFecha.value !== 'Todos') {
  //     usuariosFiltrados = usuariosFiltrados.filter(p => {
  //         const fechaActual = new Date();
  //         const partesFecha = p.fecha_actualizado.split('/');
  //         const dia = parseInt(partesFecha[0], 10);
  //         const mes = parseInt(partesFecha[1], 10) - 1;
  //         const anio = parseInt(partesFecha[2], 10);
  //         const fechaActualizacion = new Date(anio, mes, dia);

  //         const diferencia = fechaActual - fechaActualizacion;
  //         const diasDiferencia = Math.floor(diferencia / (1000 * 60 * 60 * 24));

  //         if (selectFecha.value === 'Hoy') return diasDiferencia === 0;
  //         if (selectFecha.value === 'Ayer') return diasDiferencia <= 1;
  //         if (selectFecha.value === '7 días') return diasDiferencia <= 7;
  //         if (selectFecha.value === 'Mes') return diasDiferencia <= 30;
  //         if (selectFecha.value === 'Año') return diasDiferencia <= 366;
  //         return true;
  //     });
  // }

  // numResultados.textContent = `${usuariosFiltrados.length} resultado` + (usuariosFiltrados.length !== 1 ? 's' : '') + // Mostrar el número de resultados
  //     ` encontrado` +  (usuariosFiltrados.length !== 1 ? 's' : '');

  // if(busquedaGlobal !== '') {
  //     if(usuariosFiltrados.length == 0){
  //         numResultados.textContent = "No se encontraron resultados para " + `${busquedaGlobal}`;
  //     } else {
  //         numResultados.textContent += " para  " + `${busquedaGlobal}`;
  //     }

  // }

  numPages = Math.ceil(
    usuariosFiltrados.length / selectReportesPorPagina.value
  );
  pagina = 1;
  if (numPages > 1) btnProblemaSiguiente.classList.remove("invisible");

  mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
  addEvents();
}

// Escuchar cambios en los checkboxes
document.querySelectorAll(".form-check-input").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const checkedBoxes = document.querySelectorAll(".form-check-input:checked");
    if (checkedBoxes.length === 0) {
      checkbox.checked = true; // Evitar que todos los checkboxes estén desmarcados
    }
    filtrar();
  });
});

document.querySelectorAll(".filtros .form-select").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    filtrar();
  });
});

// btnFiltrar.addEventListener('click', filtrar);

// Event listener para los botones siguiente pagina

btnProblemaSiguiente.addEventListener("click", () => {
  btnProblemaAnterior.classList.remove("invisible");
  pagina++;
  if (pagina == numPages) {
    btnProblemaSiguiente.classList.add("invisible");
  }
  mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
  addEvents();
});

btnProblemaAnterior.addEventListener("click", () => {
  btnProblemaSiguiente.classList.remove("invisible");
  pagina--;
  if (pagina <= 1) {
    btnProblemaAnterior.classList.add("invisible");
  }
  mostrarProblemas(pagina, usuariosFiltrados, selectReportesPorPagina.value);
  addEvents();
});

function addEvents() {
  // Manejo de eventos para el botón de seguimiento
  Array.from(document.getElementsByClassName("seguimiento_p")).forEach(
    function (element) {
      element.addEventListener("click", function () {
       
        let datosUser = this.closest("tr");
        let tipoUsuario = datosUser.querySelectorAll("td").item(1).textContent;
        const divAdminInfo = document.createElement("div");
        const divProblemaInfo = document.createElement("div");
        divAdminInfo.classList.add("AdminInfo", "col");
        divProblemaInfo.classList.add("ProblemaInfo", "col");
        

        let idUsuario = datosUser.querySelector("th").textContent; // Utilizamos let para evitar usuarios de alcance
        let tipoUser = statusColors[tipoUsuario] || "";
        const data = usuariosFiltrados.find((p) => p.id == idUsuario);
        const tipoClase = tipoUsuario === "Admin" ? "bg-dark text-white" : "bg-primary text-white";
        if (tipoUsuario === "Admin") {
          divAdminInfo.style.backgroundColor = "rgba(211, 211, 211, 0.3)"; // Gris claro transparente al 30%
          divAdminInfo.style.color = "#000000"; // Texto negro
          divAdminInfo.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Sombra difusa
          divAdminInfo.style.marginRight = "10px"; // Margen derecho de 10 píxeles
      } else if (tipoUsuario === "Usuario") {
          divAdminInfo.style.backgroundColor = "rgba(214, 228, 255, 0.3)"; // Azul pastel transparente al 30%
          divAdminInfo.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"; // Sombra difusa
          divAdminInfo.style.marginRight = "10px"; // Margen derecho de 10 píxeles
      }
      
      
        
        divAdminInfo.innerHTML = `
        <div class='text-center h2'><strong>Usuario ID#${idUsuario}</strong></div>
        <div class='row h3 text-center'>
            <span class='col border border-2'><strong>Tipo de Usuario</strong></span> 
            <span class='col border border-2 text-center ${tipoClase}'>${tipoUsuario}</span>
        </div>
      `;
        divProblemaInfo.innerHTML = `<div class='text-center h2'><strong>INFORMACION ENVIADA</strong></div>`;
      

        if (["Admin", "Usuario"].includes(tipoUsuario)) {
          BodyModal.innerHTML = `<div id="loading" class="loading-container">
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="visually-hidden">Loading...</span>
                                            </div>
                                        </div>`;

          if (tipoUsuario === "Admin") {
            divAdminInfo.innerHTML += `
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Nombre de Usuario</strong></span> 
                <span class='col border border-2 text-center'>${data.first_name} ${data.last_name}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Correo</strong></span> 
                <span class='col border border-2 text-center'>${data.email}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Número de Reportes</strong></span> 
                <span class='col border border-2 text-center'>${data.num_reportes}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Fecha de Creación</strong></span> 
                <span class='col border border-2 text-center'>${data.date_joined}</span>
              </div>
              <div class='row h3 text-start' id='btnEnviarNotificacion'>
                <button type="button" class="btn btn-warning col fs-5 me-2">
                  <i class="fas fa-bell"></i> Enviar notificación
                </button>
              </div>
              <div class='row h3 text-start' id='btnAdministrarUsuario'>
                <button type="button" class="btn btn-outline-dark col fs-5 me-2">
                  <i class="fas fa-cog"></i> Administrar usuario
                </button>
              </div>
              <div class='row h3 text-start' id='btnQuitarAdmin'>
                <button type="button" class="btn btn-secondary col fs-5 me-2">
                  <i class="fas fa-user-minus"></i> Quitar admin
                </button>
              </div>
              <div class='row h3 text-start' id='btnBloquearUsuario'>
                <button type="button" class="btn btn-danger col fs-5 me-2">
                  <i class="fas fa-ban"></i> Bloquear usuario
                </button>
              </div>
            `;
          } else if (tipoUsuario === "Usuario") {
            divAdminInfo.innerHTML += `
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Nombre</strong></span> 
                <span class='col border border-2 text-center'>${data.first_name} ${data.last_name}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Correo</strong></span> 
                <span class='col border border-2 text-center'>${data.email}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Número de Reportes</strong></span> 
                <span class='col border border-2 text-center'>${data.num_reportes}</span>
              </div>
              <div class='row h3 text-center'>
                <span class='col border border-2'><strong>Fecha de Creación</strong></span> 
                <span class='col border border-2 text-center'>${data.date_joined}</span>
              </div>
              <div class='row h3 text-start' id='btnEnviarNotificacion'>
                <button type="button" class="btn btn-warning col fs-5 me-2">
                  <i class="fas fa-bell"></i> Enviar notificación
                </button>
              </div>
              <div class='row h3 text-start' id='btnAdministrarUsuario'>
                <button type="button" class="btn btn-outline-dark col fs-5 me-2">
                  <i class="fas fa-cog"></i> Administrar usuario
                </button>
              </div>
              <div class='row h3 text-start' id='btnDarAdmin'>
                <button type="button" class="btn btn-info col fs-5 me-2">
                  <i class="fas fa-user-plus"></i> Hacer admin
                </button>
              </div>
              <div class='row h3 text-start' id='btnBloquearUsuario'>
                <button type="button" class="btn btn-danger col fs-5 me-2">
                  <i class="fas fa-ban"></i> Bloquear usuario
                </button>
              </div>
            `;
          }

        //   updateProblemInfo(divProblemaInfo, data);
          BodyModal.innerHTML = ""; // Limpiamos el contenido anterior
          BodyModal.insertAdjacentElement("afterbegin", divProblemaInfo);
          BodyModal.insertAdjacentElement("afterbegin", divAdminInfo);
          const btnEnviarNotificacion = document.getElementById("btnEnviarNotificacion");
          const btnAdministrarUsuario = document.getElementById("btnAdministrarUsuario");
          const btnDarAdmin = document.getElementById("btnDarAdmin");
          const btnQuitarAdmin = document.getElementById("btnQuitarAdmin");
          const btnBloquearUsuario = document.getElementById("btnBloquearUsuario");
          const problemaInfo = document.querySelector(".ProblemaInfo");
          
          btnEnviarNotificacion.addEventListener("click", function () {
            problemaInfo.innerHTML = `
                <div class='text-center h2 mb-4'>
                    <strong>Enviar notificación</strong>
                </div>
                <div class='row justify-content-center mb-3'>
                    <div class='col-md-6'>
                        <label for='tipoNotificacion' class='form-label fw-bold'>Tipo de Notificación</label>
                        <select id='tipoNotificacion' class='form-select mb-3' style='font-weight: bold;'>
                            <option value='Notificacion'>Notificación</option>
                            <option value='Alerta'>Alerta</option>
                            <option value='Advertencia'>Advertencia</option>
                            <option value='Anuncio'>Anuncio</option>
                            <option value='Confirmacion'>Confirmación</option>
                            <option value='Solicitud'>Solicitud de Información</option>
                            <option value='Instruccion'>Instrucción</option>
                            <option value='Felicitacion'>Felicitación</option>
                            <option value='Recomendacion'>Recomendación</option>
                        </select>
                    </div>
                </div>
                <div class='row justify-content-center'>
                    <textarea class='form-control text-center mb-3 p-3 shadow-sm fs-4' 
                              placeholder='Escribe un mensaje' 
                              rows='4'
                              style='resize: none; border-radius: 10px;'></textarea>
                </div>
                <div class='row justify-content-center'>
                    <button type="button" class="btn btn-primary col-4 fs-5 shadow-sm">
                        <i class="fas fa-paper-plane"></i> Enviar
                    </button>
                </div>
            `;
        
            const btnEnviar = problemaInfo.querySelector(".btn-primary");
        
            btnEnviar.addEventListener("click", function () {
                const mensaje = problemaInfo.querySelector("textarea");
                const tipo = problemaInfo.querySelector("#tipoNotificacion");
                const titulo = tipo.value + " Administrador";
        
                fetch(`/api_registros/notificacion/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": getCookie("csrftoken"),
                    },
                    body: JSON.stringify({
                        message: mensaje.value,
                        user: idUsuario,
                        type: tipo.value,
                        title: titulo,
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    mensaje.value = "";
                    tipo.value = "Notificacion";
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                });
            });
        });
          
        btnAdministrarUsuario.addEventListener("click", function () {
          problemaInfo.innerHTML = `
          <div class='text-center h2 mb-4'>
              <strong>Administrar usuario</strong>
          </div>
          <div class='row justify-content-center mb-4'>
              <div class="cursor-pointer text-dark mb-3" 
                   data-bs-toggle="collapse" 
                   data-bs-target="#collapseUsuario" 
                   aria-expanded="false" 
                   aria-controls="collapseUsuario" 
                   style="transition: color 0.3s ease; font-weight: bold;" 
                   onmouseover="this.style.color='#333';" 
                   onmouseout="this.style.color='black';">
                  Cambiar nombre de usuario
              </div>
              <div class="collapse" id="collapseUsuario">
                  <div class="input-group mb-4 shadow-sm">
                      <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                      <input maxLength="50" type="text" class="form-control no-radius-left" placeholder="Nombre">
                  </div>
                  <div class="input-group mb-4 shadow-sm">
                      <span class="input-group-text"><i class="fa-solid fa-user"></i></span>
                      <input maxLength="50" type="text" class="form-control no-radius-left" placeholder="Apellido">
                  </div>
              </div>
  
              <div class="cursor-pointer text-dark mb-3" 
                   data-bs-toggle="collapse" 
                   data-bs-target="#colapseContraseña" 
                   aria-expanded="false" 
                   aria-controls="colapseContraseña" 
                   style="transition: color 0.3s ease; font-weight: bold;" 
                   onmouseover="this.style.color='#333';" 
                   onmouseout="this.style.color='black';">
                  Modificar contraseña
              </div>
              <div class="collapse" id="colapseContraseña">
                  <div class="input-group mb-4 shadow-sm">
                      <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                      <input type="password" class="form-control no-radius-left" placeholder="Nueva contraseña">
                  </div>
                  <div class="input-group mb-4 shadow-sm">
                      <span class="input-group-text"><i class="fa-solid fa-key"></i></span>
                      <input type="password" class="form-control no-radius-left" placeholder="Confirmar nueva contraseña">
                  </div>
              </div>
  
              <div class="cursor-pointer text-dark mb-3" 
                   data-bs-toggle="collapse" 
                   data-bs-target="#collapseCorreo" 
                   aria-expanded="false" 
                   aria-controls="collapseCorreo" 
                   style="transition: color 0.3s ease; font-weight: bold;" 
                   onmouseover="this.style.color='#333';" 
                   onmouseout="this.style.color='black';">
                  Actualizar correo
              </div>
              <div class="collapse" id="collapseCorreo">
                  <div class="input-group mb-4 shadow-sm">
                      <span class="input-group-text">@</span>
                      <input type="email" class="form-control no-radius-left" maxLength="50" placeholder="Correo">
                  </div>
              </div>
          </div>
          <div class='row justify-content-center'>
              <button type="button" class="btn btn-dark col-4 fs-5 shadow-sm">
                  <i class="fas fa-save"></i> Guardar cambios
              </button>
          </div>
      `;

          const btnGuardarCambios = problemaInfo.querySelector(".btn-dark");

          btnGuardarCambios.addEventListener("click", function () {

              const nombre = problemaInfo.querySelectorAll("input")[0];
              const apellido = problemaInfo.querySelectorAll("input")[1];
              const nuevaContrasena = problemaInfo.querySelectorAll("input")[2];
              const confirmarContrasena = problemaInfo.querySelectorAll("input")[3];
              const correo = problemaInfo.querySelectorAll("input")[4];
              const inputs = problemaInfo.querySelectorAll("input");

              for(const input of inputs) {
                if (!input.checkValidity()) {
                  input.reportValidity();
                  return;
                }
              }
             
              if(nuevaContrasena.value !== confirmarContrasena.value) {
                  alert("Las contraseñas no coinciden");
                  return;
              }



              if(nuevaContrasena.value.length < 8  && confirmarContrasena.value.length != 0) {
                  alert("La contraseña debe tener al menos 8 caracteres");
                  return;
              }

              const requestObj = {};

              if(nombre.value) {
                  requestObj.first_name = nombre.value;
              }

              if(apellido.value) {
                  requestObj.last_name = apellido.value;
              }

              if(nuevaContrasena.value) {
                  requestObj.password = nuevaContrasena.value;
              }

              if(correo.value) {
                requestObj.email = correo.value;
              }


              fetch(`/api_registros/usuario/${idUsuario}/`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                      "X-CSRFToken": getCookie("csrftoken"),
                  },
                  body: JSON.stringify(requestObj),
              })
              .then((response) => {
                  if (!response.ok) {
                      throw new Error("Network response was not ok");
                  }
                  nombre.value = "";
                  apellido.value = "";
                  nuevaContrasena.value = "";
                  confirmarContrasena.value = "";
                  correo.value = "";
              })
              .catch((error) => {
                  console.error("There was a problem with the fetch operation:", error);
              });
          });

      });

      if(btnQuitarAdmin){
        btnQuitarAdmin.addEventListener("click", function () {
          problemaInfo.innerHTML = `
              <div class='text-center h2 mb-4'>
                  <strong>Quitar Administrador</strong>
              </div>
              <div class='row justify-content-center mb-3'>
                  <div class='text-center'>
                      <textarea class='form-control text-center mb-3 p-3 shadow-sm fs-4' 
                                placeholder='Razón de quitar admin (opcional)' 
                                rows='4'
                                style='resize: none; border-radius: 10px;'></textarea>
                  </div>
              </div>
              <div class='row justify-content-center'>
                  <button type="button" class="btn btn-outline-danger col-4 fs-5 shadow-sm">
                      <i class="fas fa-exclamation-triangle"></i> Confirmar
                  </button>
              </div>
          `;
        });
    }

    if(btnDarAdmin){
      btnDarAdmin.addEventListener("click", function () {
          problemaInfo.innerHTML = `
              <div class='text-center h2 mb-4'>
                  <strong>Dar Administrador</strong>
              </div>
              <div class='row justify-content-center mb-3'>
                  <div class='text-center'>
                      <textarea class='form-control text-center mb-3 p-3 shadow-sm fs-4' 
                                placeholder='Razón de dar admin (opcional)' 
                                rows='4'
                                style='resize: none; border-radius: 10px;'></textarea>
                  </div>
              </div>
              <div class='row justify-content-center'>
                  <button type="button" class="btn btn-outline-info col-4 fs-5 shadow-sm">
                      <i class="fas fa-exclamation-triangle"></i> Confirmar
                  </button>
              </div>
          `;
      });
  }
    btnBloquearUsuario.addEventListener("click", function () {
      problemaInfo.innerHTML = `
          <div class='text-center h2 mb-4'>
              <strong>Bloquear Usuario</strong>
          </div>
          <div class='row justify-content-center mb-3'>
              <div class='text-center'>
                  <select class='form-select mb-3 shadow-sm' style='border-radius: 10px; font-size: 1.25rem; font-weight: bold;'>
                      <option value='1d'>1 Día</option>
                      <option value='1w'>1 Semana</option>
                      <option value='1m'>1 Mes</option>
                      <option value='perm'>Permanente</option>
                  </select>
              </div>
          </div>
          <div class='row justify-content-center mb-3'>
              <div class='text-center'>
                  <textarea class='form-control text-center mb-3 p-3 shadow-sm fs-4' 
                            placeholder='Razón del baneo (opcional)' 
                            rows='4'
                            style='resize: none; border-radius: 10px; font-size: 1.25rem; font-weight: bold;'></textarea>
              </div>
          </div>
          <div class='row justify-content-center'>
              <button type="button" class="btn btn-outline-danger col-4 fs-5 shadow-sm">
                  <i class="fas fa-ban"></i> Bloquear
              </button>
          </div>
      `;
  });
  
  
    

  
      
      
      
        

          

        //   fetch(`/api_registros/problema_en_curso/${idProblema}/`)
        //     .then((response) => {
        //       if (!response.ok) {
        //         throw new Error("Network response was not ok");
        //       }
        //       return response.json();
        //     })
        //     .then((data) => {
        //       updateProblemInfo(divProblemaInfo, data.problema);
        //       BodyModal.innerHTML = ""; // Limpiamos el contenido anterior
        //       BodyModal.insertAdjacentElement("afterbegin", divProblemaInfo);
        //       BodyModal.insertAdjacentElement("afterbegin", divAdminInfo);

        //       // Asegúrate de que estas referencias sean correctas
        //       const btnStatusAceptar =
        //         document.getElementById("aceptar_problema");
        //       const btnStatusRechazar =
        //         document.getElementById("rechazar_problema");
        //       const btnStatusCompletado =
        //         document.getElementById("completar_problema");

        //       if (btnStatusAceptar) {
        //         btnStatusAceptar.addEventListener("click", function () {
        //           fetch(`/api_registros/problema/${idProblema}/`, {
        //             method: "PUT",
        //             headers: {
        //               "Content-Type": "application/json",
        //               "X-CSRFToken": getCookie("csrftoken"),
        //             },
        //             body: JSON.stringify({
        //               estatus: "Aceptado",
        //               info_adicional: document.querySelector("textarea").value,
        //               comentario_completado: "",
        //             }),
        //           })
        //             .then((response) => {
        //               if (!response.ok) {
        //                 throw new Error("Network response was not ok");
        //               }
        //               return response.json();
        //             })
        //             .then((data) => {
        //               const problemaAceptado = usuarios.find(
        //                 (p) => p.id == idProblema
        //               );
        //               if (problemaAceptado) {
        //                 problemaAceptado.estatus_problematica = "Aceptado";
        //                 actualizarFechaActualizada(problemaAceptado);
        //                 filtrar();
        //               }
        //             })
        //             .catch((error) => {
        //               console.error(
        //                 "Hubo un problema con la operación fetch:",
        //                 error
        //               );
        //             });
        //         });
        //       }

        //       if (btnStatusRechazar) {
        //         btnStatusRechazar.addEventListener("click", function () {
        //           fetch(`/api_registros/problema/${idProblema}/`, {
        //             method: "PUT",
        //             headers: {
        //               "Content-Type": "application/json",
        //               "X-CSRFToken": getCookie("csrftoken"),
        //             },
        //             body: JSON.stringify({
        //               estatus: "Rechazado",
        //               info_adicional: document.querySelector("textarea").value,
        //             }),
        //           })
        //             .then((response) => {
        //               if (!response.ok) {
        //                 throw new Error("Network response was not ok");
        //               }
        //               return response.json();
        //             })
        //             .then((data) => {
        //               const problemaRechazado = usuarios.find(
        //                 (p) => p.id == idProblema
        //               );
        //               if (problemaRechazado) {
        //                 problemaRechazado.estatus_problematica = "Rechazado";
        //                 actualizarFechaActualizada(problemaRechazado);
        //                 filtrar();
        //               }
        //             })
        //             .catch((error) => {
        //               console.error(
        //                 "Hubo un problema con la operación fetch:",
        //                 error
        //               );
        //             });
        //         });
        //       }
        //       if (btnStatusCompletado) {
        //         btnStatusCompletado.addEventListener("click", function () {
        //           fetch(`/api_registros/problema/${idProblema}/`, {
        //             method: "PUT",
        //             headers: {
        //               "Content-Type": "application/json",
        //               "X-CSRFToken": getCookie("csrftoken"),
        //             },
        //             body: JSON.stringify({
        //               estatus: "Completado",
        //               comentario_completado:
        //                 document.querySelector("textarea").value,
        //             }),
        //           })
        //             .then((response) => {
        //               if (!response.ok) {
        //                 throw new Error("Network response was not ok");
        //               }
        //               return response.json();
        //             })
        //             .then((data) => {
        //               const problemaCompletado = usuarios.find(
        //                 (p) => p.id == idProblema
        //               );
        //               if (problemaCompletado) {
        //                 problemaCompletado.estatus_problematica = "Completado";
        //                 actualizarFechaActualizada(problemaCompletado);
        //                 filtrar();
        //               }
        //             })
        //             .catch((error) => {
        //               console.error(
        //                 "Hubo un problema con la operación fetch:",
        //                 error
        //               );
        //             });
        //         });
        //       }

        //       function actualizarFechaActualizada(problema) {
        //         const fecha_actual = new Date();
        //         const dia = fecha_actual.getDate();
        //         const mes = (fecha_actual.getMonth() + 1)
        //           .toString()
        //           .padStart(2, "0");
        //         const anio = fecha_actual.getFullYear();
        //         const horas = fecha_actual
        //           .getHours()
        //           .toString()
        //           .padStart(2, "0");
        //         const minutos = fecha_actual
        //           .getMinutes()
        //           .toString()
        //           .padStart(2, "0");
        //         const segundos = fecha_actual
        //           .getSeconds()
        //           .toString()
        //           .padStart(2, "0");
        //         const fechaStr = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
        //         problema.fecha_actualizado = fechaStr;
        //       }
        //     })
        //     .catch((error) => {
        //       console.error(
        //         "There was a problem with the fetch operation:",
        //         error
        //       );
        //     });
        }
      });
    }
  );

  // Manejo de eventos para el select box
  document
    .getElementById("estatusSelect")
    .addEventListener("change", function () {
      textAreaInfoAdicional.value = "";
      spanNuevoEstatus.textContent = this.value;
      modal.show();
    });
}

// Event listener para el botón de Confirmar cambio de estatus

// btnCambiarEstatus.addEventListener('click', function() {
//             const selectedOption = document.getElementById('estatusSelect');

//             // let mensajeConfirmacion = '';
//             let nuevoEstatus = '';
//             let infoAdicional = textAreaInfoAdicional.value;

//             // Determinar el mensaje de confirmación y el nuevo estatus basado en la opción seleccionada
//             switch (selectedOption.value) {
//                 case 'Aceptar':
//                     nuevoEstatus = 'Aceptado';
//                     break;
//                 case 'Rechazar':
//                     nuevoEstatus = 'Rechazado';
//                     break;
//                 case 'Completar':
//                     nuevoEstatus = 'Completado';
//                     break;
//                 default:
//                     return; // Salir si la opción seleccionada no es válida
//             }

//             const selectedCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]:checked');
//             selectedCheckboxes.forEach(checkbox => {
//                 let row = checkbox.closest('tr');
//                 let idProblema = row.querySelector('th').textContent;

//                 fetch(`/api_registros/problema/${idProblema}/`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRFToken': getCookie('csrftoken')
//                     },
//                     body: JSON.stringify({
//                         estatus: nuevoEstatus,
//                         info_adicional: infoAdicional, // Aquí podrías recoger la información adicional si es necesario
//                     })
//                 })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     const problemaActualizado = usuarios.find(p => p.id == idProblema);
//                     console.log(problemaActualizado);
//                     if (problemaActualizado) {
//                         problemaActualizado.estatus_problematica = nuevoEstatus;
//                         const fecha_actual = new Date();
//                         const dia = fecha_actual.getDate();
//                         const mes = (fecha_actual.getMonth() + 1).toString().padStart(2, '0');
//                         const anio = fecha_actual.getFullYear();
//                         const horas = fecha_actual.getHours().toString().padStart(2, '0');
//                         const minutos = fecha_actual.getMinutes().toString().padStart(2, '0');
//                         const segundos = fecha_actual.getSeconds().toString().padStart(2, '0');
//                         const fechaStr = `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
//                         problemaActualizado.fecha_actualizado = fechaStr;
//                         filtrar(); // Actualizar la tabla o la vista según sea necesario
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Hubo un problema con la operación fetch:', error);
//                 });
//             });

//             // Restablecer el select box a la opción por defecto
//             selectedOption.value = '';

// });

// Cargar la información de los usuarios en la tabla
function cargarUsuarios() {
  const iconCargando = btnRecargarTabla.querySelector(".fa-solid");
  iconCargando.classList.add("fa-spin");
  fetch(`/api_registros/usuario/`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      usuarios = data;
      usuariosFiltrados = usuarios;
      // problemasBusqueda = usuarios;
      filtrar();
      addEvents();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    })
    .finally(() => {
      iconCargando.classList.remove("fa-spin");
    });
}

function mostrarProblemas(
  pagina = 1,
  usuarios = usuariosFiltrados,
  problemasPorPagina = 10
) {
  let problemasPagina = usuarios.slice(
    (pagina - 1) * problemasPorPagina,
    pagina * problemasPorPagina
  );
  contenedorProblemas.innerHTML = "";
  estatusCheckboxSeleccionado = "";
  problemasPagina.forEach((p) => {
    let tr = document.createElement("tr");
    let tipoUsuario;

    // Condiciones en JavaScript para asignar el valor a tipoUsuario
    if (p.is_staff) {
      tipoUsuario = "Admin";
    } else {
      tipoUsuario = "Usuario";
    }

    tr.classList.add(tipoUsuario);

    tr.innerHTML = `
              <th scope="row row-9">${p.id}</th>
              <td>${p.first_name} ${p.last_name} </td>
              <td>${tipoUsuario}</td>
              <td>${p.email}</td>
              <td>${p.num_reportes}</td>
              <td>${p.date_joined.split(" ")[0]}</td>
              <td>
                <button id="p.${
                  p.id
                }" class="seguimiento_p btn btn-secondary" href="#!" data-bs-toggle="modal" data-bs-target="#SeguimientoUsuario"> 
                  <i class="fa-solid fa-arrow-up-long"></i>
                </button>
              </td>
              <td>
                <input class="form-check-input" type="checkbox" name="option1" value="something">
                
              </td>
        `;

    tr.querySelector(".form-check-input").addEventListener(
      "change",
      function () {
        console.log("Checkbox seleccionado:", this.checked);
        let selectboxdisable = document.getElementById("estatusSelect");
        if (estatusCheckboxSeleccionado === "") {
          estatusCheckboxSeleccionado = p.estatus_problematica;
          // Estamos seleccionando por numero donde 0 es Seleccionar accion y 3 completado
          switch (estatusCheckboxSeleccionado) {
            case "Procesando":
              selectboxdisable.children.item(3).disabled = true;
              break;
            case "Aceptado":
              selectboxdisable.children.item(1).disabled = true;
              break;
            case "Rechazado":
              selectboxdisable.children.item(2).disabled = true;
              selectboxdisable.children.item(3).disabled = true;
              break;
            case "Completado":
              selectboxdisable.children.item(1).disabled = true;
              selectboxdisable.children.item(2).disabled = true;
              selectboxdisable.children.item(3).disabled = true;
              break;
          }
          document.querySelectorAll("table tbody tr").forEach((tr) => {
            estatus_problematica = tr.querySelector(
              ".estatus_problematica"
            ).textContent;
            checkbox = tr.querySelector(".form-check-input");
            if (estatus_problematica !== estatusCheckboxSeleccionado) {
              // console.log(estatus_problematica, estatusCheckboxSeleccionado);
              checkbox.disabled = true;
            } else {
              // checkbox.classList.remove('disabled');
              checkbox.disabled = false;
            }
          });
        } else {
          let checkboxSeleccionados = document.querySelectorAll(
            "table .form-check-input:checked"
          );
          if (checkboxSeleccionados.length === 0) {
            selectboxdisable.children.item(1).disabled = false;
            selectboxdisable.children.item(2).disabled = false;
            selectboxdisable.children.item(3).disabled = false;
            estatusCheckboxSeleccionado = "";
            document.querySelectorAll("table tbody tr").forEach((tr) => {
              tr.querySelector(".form-check-input").disabled = false;
            });
          }
        }
      }
    );
    contenedorProblemas.appendChild(tr);
  });
}

// function updateProblemInfo(divProblemaInfo, problema) {
//   problema.id = null;
//   problema.estatus_problematica = null;
//   problema.id_usuario = null;

//   // Diccionario para renombrar las claves
//   const clavesRenombradas = {
//     tipo_edificio: "Tipo de Edificio",
//     fecha_creacion: "Fecha de Creación",
//     fecha_actualizado: "Ultima Actualización",
//     letra_edificio: "Letra del edificio",
//     numero_salon: "Numero de salon",
//     piso_baño: "Piso del Baño",
//     tipo_baño: "Tipo de Baño",
//     edificio_baño: "Edificio del Baño",
//     tipo_area: "Tipo de area",
//     ubicacion_area: "Ubicación del area",
//     tipo_departamento: "Tipo departamento",
//     tipo_edificio_departamento: "Nombre del departamento",
//     ubicacion_departamento: "Ubicación departamento",
//     tipo_problema: "Tipo de Problema",
//     gravedad_problema: "Gravedad",
//     descripcion_problema: "Descripción",
//     ubicacion_exacta: "Ubicación Exacta",
//   };

//   Object.entries(problema).forEach(([clave, valor]) => {
//     if (valor != null) {
//       let claveRenombrada = clavesRenombradas[clave] || clave;
//       let tipoColorTexto = "";
//       if (clave == "tipo_problema") {
//         switch (valor) {
//           case "Físico":
//             tipoColorTexto = "text-brown";
//             break;
//           case "Eléctrico":
//             tipoColorTexto = "text-warning";
//             break;
//           default:
//             tipoColorTexto = "";
//         }
//       } else if (clave == "gravedad_problema") {
//         let colorTexto = "";
//         let tiempoEstimado = "";
//         switch (valor) {
//           case "Menor":
//             colorTexto = "text-success";
//             tiempoEstimado = "3-4 semanas";
//             break;
//           case "Moderado":
//             colorTexto = "text-warning";
//             tiempoEstimado = "2-3 semanas";
//             break;
//           case "Serio":
//             colorTexto = "text-primary";
//             tiempoEstimado = "5-12 días";
//             break;
//           case "Crítico":
//             colorTexto = "text-danger";
//             tiempoEstimado = "1-3 días";
//             break;
//           default:
//             colorTexto = "";
//             tiempoEstimado = "";
//         }
//         divProblemaInfo.innerHTML += `<div class='row h3'><span class='col border border-2'><strong>${claveRenombrada}</strong></span> <span class='col border border-2 text-center ${colorTexto}'>${valor} | ${tiempoEstimado} |</span></div>`;
//         return;
//       }
//       divProblemaInfo.innerHTML += `<div class='row h3'><span class='col border border-2'><strong>${claveRenombrada}</strong></span> <span class='col border border-2 text-center ${tipoColorTexto}'>${valor}</span></div>`;
//     }
//   });
// }

// document.getElementById('btnCerrarModal').addEventListener('click',()=>{
//     const selectedOption = document.getElementById('estatusSelect');
//     selectedOption.value = '';
// });

addEvents();
cargarUsuarios();