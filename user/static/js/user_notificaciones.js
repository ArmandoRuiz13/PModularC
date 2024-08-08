const currentUrl = window.location.href;
const url = new URL(currentUrl);
<<<<<<< HEAD
const modal_Eliminar = document.querySelector('#notificaciones_eliminar');
const btnEliminar = modal_Eliminar.querySelector('.eliminando_notificacion');
let idnotificacionglobal = 0;

Array.from(
    document.getElementsByClassName('eliminar_notificacion')).forEach(
        function (element) {
            element.addEventListener('click', function () {
                idnotificacionglobal = this.id;
                btnEliminar.dataset.id = idnotificacionglobal;
            });
        });

btnEliminar.addEventListener('click', function () {
    let idNotificacion = idnotificacionglobal;
    const registro_actual = document.querySelector(`button[id="${idNotificacion}"]`).closest('tr');
    fetch(`/api_registros/notificacion/${idNotificacion}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            registro_actual.remove();
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
});

const modal_mostrar = document.querySelector('#notificaciones_vista'); 
Array.from(document.querySelectorAll('tr')).forEach(function (element) {
    element.addEventListener('click', function () {
        // Mandar solicitud para convertir la notificación a leída   /notification/id/ el método debe ser PUT
        idnotificacionglobal = this.querySelector('button').id; // Asumiendo que el botón tiene el ID de la notificación

        fetch(`/api_registros/notificacion/${idnotificacionglobal}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Notificación marcada como leída:', data);
            
            // Cambiar la clase de la fila a estatus-leido
            this.classList.remove('estatus-no-leido');
            this.classList.add('estatus-leido');
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });

        modal_mostrar.querySelector('.modal-title-mostrar').innerHTML = '<strong>Título:</strong> ' + this.querySelector('th').innerHTML;
        // Obtener el contenido de la celda
        const mensajeCompleto = this.querySelector('td').innerHTML; // Suponiendo que todos los datos están en la única columna

        // Extraer información usando expresiones regulares
        const regex = /Su problema (.+?) \| (.+?) con el ID#(\d+) fue (.+?) por el administrador (.+?)\. El mensaje enviado fue: "(.*)"/;
        const match = mensajeCompleto.match(regex);

        if (match) {
            const tipoEdificio = match[1]; // Tipo de edificio
            const tipoProblema = match[2]; // Tipo de problema
            const id = match[3]; // ID
            const estado = match[4]; // Estado
            const administrador = match[5]; // Administrador
            const mensajeEnviado = match[6]; // Mensaje enviado

            // Definir el color según el estado
            let color;
            switch (estado) {
                case 'Completado':
                    color = 'blue';
                    break;
                case 'Aceptado':
                    color = 'green';
                    break;
                case 'Rechazado':
                    color = 'red';
                    break;
                default:
                    color = 'black'; // Color por defecto
            }

            // Crear el mensaje formateado
            const contenido = `
                <div>
                    <p><strong> Mensaje: </strong><br> Su problema <strong>${tipoEdificio}</strong> | <strong>${tipoProblema}</strong> con el <strong>ID#${id}</strong> fue <strong style="color: ${color};">${estado}</strong> por el administrador <strong>${administrador}</strong>.<br> El mensaje enviado fue: "<em>${mensajeEnviado}</em>"</p>
                </div>`;

            // Asignar el mensaje al cuerpo del modal
            modal_mostrar.querySelector('.modal-body-mostrar').innerHTML = contenido;
        } else {
            // Manejar el caso donde no se encontró el formato esperado
            modal_mostrar.querySelector('.modal-body-mostrar').innerHTML = mensajeCompleto;
        }
    });
});

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var qValue = urlParams.get('id');

=======
const modal_Eliminar = document.querySelector("#notificaciones_eliminar");
const btnEliminar = modal_Eliminar.querySelector(".eliminando_notificacion");
let idnotificacionglobal = 0;
Array.from(document.getElementsByClassName("eliminar_notificacion")).forEach(
  function (element) {
    element.addEventListener("click", function () {
      idnotificacionglobal = this.id;
      btnEliminar.dataset.id = idnotificacionglobal;
    });
  }
);

btnEliminar.addEventListener("click", function () {
  let idNotificacion = idnotificacionglobal;
  const registro_actual = document
    .querySelector(`button[id="${idNotificacion}"]`)
    .closest("tr");
  fetch(`/api_registros/notificacion/${idNotificacion}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      registro_actual.remove();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

const modal_mostrar = document.querySelector("#notificaciones_vista");
Array.from(document.querySelectorAll("tr")).forEach(function (element) {
  element.addEventListener("click", function () {
    modal_mostrar.querySelector(".modal-title-mostrar").textContent =
      "Titulo: " + this.querySelector("th").innerHTML;
    const mensaje = "Mensaje: " + this.querySelectorAll("td").item(0).innerHTML;
    const tipoMensaje =
      "Tipo Mensaje: " + this.querySelectorAll("td").item(1).innerHTML;
    const fecha =
      "Fecha de recibido: " + this.querySelectorAll("td").item(2).innerHTML;
    const hora = "Hora: " + this.querySelectorAll("td").item(3).innerHTML;

    const contenido = `  <div>
                                    ${mensaje}
                                    ${tipoMensaje}
                                    ${fecha}
                                    ${hora}
                                    </div>`;
    modal_mostrar.querySelector(".modal-body-mostrar").innerHTML = contenido;
  });
});
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var qValue = urlParams.get("id");
>>>>>>> 16f5f329af9d069ae79e48e22a6c3071354db8e9
function isNumber(value) {
  return !isNaN(value) && value.trim() !== "";
}
<<<<<<< HEAD

if (qValue && isNumber(qValue)) {
    document.querySelector('.vista' + qValue).click();
}

=======
if (qValue && isNumber(qValue)) {
  document.querySelector(".vista" + qValue).click();
}

>>>>>>> 16f5f329af9d069ae79e48e22a6c3071354db8e9
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
<<<<<<< HEAD
    return cookieValue;
}

document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table');
    const header = table.querySelector('#th_fecha');
    const tbody = table.querySelector('tbody');

    header.addEventListener('click', () => {
        const order = header.dataset.orden;
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const sortedRows = rows.sort((a, b) => {
            const aDateText = a.cells[4].textContent; // La fecha está en la quinta celda (índice 4)
            const bDateText = b.cells[4].textContent;

            const aDate = new Date(aDateText);
            const bDate = new Date(bDateText);

            return order === 'asc' ? aDate - bDate : bDate - aDate;
        });

        // Limpiar el tbody y agregar las filas ordenadas
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        sortedRows.forEach(row => tbody.appendChild(row));

        // Alternar el orden para la próxima vez que se haga clic
        header.dataset.orden = order === 'asc' ? 'desc' : 'asc';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('mostrarNoLeidas');
    const tbody = document.querySelector('tbody');
    const totalResultados = document.getElementById('totalResultados');

    // Función para filtrar las notificaciones y actualizar el total
    function filtrarNotificaciones() {
        const filas = tbody.querySelectorAll('tr');
        let total = 0; // Contador para el total de resultados

        filas.forEach(fila => {
            if (checkbox.checked) {
                // Mostrar solo las no leídas
                if (fila.classList.contains('estatus-leido')) {
                    fila.style.display = 'none';
                } else {
                    fila.style.display = '';
                    total++; // Incrementar el contador
                }
            } else {
                // Mostrar todas las notificaciones
                fila.style.display = '';
                total++; // Incrementar el contador
            }
        });

        // Actualizar el total de resultados en el HTML
        totalResultados.textContent = `Total de resultados: ${total}`;
    }

    // Llamar a la función al cargar la página
    filtrarNotificaciones();

    // Agregar un event listener para el checkbox
    checkbox.addEventListener('change', filtrarNotificaciones);
});
=======
  }
  return cookieValue;
}
>>>>>>> 16f5f329af9d069ae79e48e22a6c3071354db8e9
