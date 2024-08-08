document.addEventListener('DOMContentLoaded', (event) => {
    fetchNotifications();

    // Iniciar el polling para nuevas notificaciones
    setInterval(fetchNotifications, 5000); // Verifica cada 5 segundos
});

function fetchNotifications() {
    fetch('/api_registros/notificacion/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayNotifications(data);
            updateBell(data); // Actualizar campana al recibir nuevas notificaciones
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function displayNotifications(notifications) {
    const notificationsContainer = document.getElementById('notifications-container');
    notifications = notifications.filter(input => !input.read_status);

    // Limpiar el contenedor de notificaciones
    notificationsContainer.innerHTML = '';

    if (notifications.length === 0) {
        const notificationElement = document.createElement('li');
        notificationElement.classList.add('notification', 'list-group-item');
        notificationElement.innerHTML = `
            <a href='#'>
                <h3 class='fs-4'>No hay notificaciones</h3>
            </a>`;
        notificationsContainer.appendChild(notificationElement);
        return;
    }

    notifications.forEach(notification => {
        const notificationElement = document.createElement('li');
        const alertBell = document.querySelector('.bell');
        alertBell.classList.add('notifications');
        notificationElement.classList.add('notification', 'list-group-item');
        notificationElement.innerHTML = `
            <a href='#' id="">
                <h3 class='fs-4'>${notification.type}: ${notification.title}</h3>
                <p class='fs-5'>${notification.message.slice(0, 25)}...</p>
            </a>`;
       
        notificationsContainer.appendChild(notificationElement);

        notificationElement.addEventListener('click', () => {
            notificationsContainer.removeChild(notificationElement);
            if (notificationsContainer.children.length === 0) {
                const notificationElement = document.createElement('li');
                const alertBell = document.querySelector('.bell');

                alertBell.classList.remove('notifications');
                notificationElement.classList.add('notification', 'list-group-item');
                notificationElement.innerHTML = `
                    <a href='#'>
                        <h3 class='fs-4'>No hay notificaciones</h3>
                    </a>`;
                notificationsContainer.appendChild(notificationElement);
            }
            fetch(`/api_registros/notificacion/${notification.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')  // Agrega esta línea
                },
            })
                .then(response => {
                    window.location = "/user/notificaciones?id=" + notification.id;
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Notification read:', data);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        });
    });
}

function updateBell(notifications) {
    const alertBell = document.querySelector('.bell');
    const unreadCount = notifications.filter(notification => !notification.read_status).length;

    if (unreadCount > 0) {
        alertBell.classList.add('notifications'); // Agregar clase si hay notificaciones no leídas
        // Opcional: puedes mostrar el conteo de notificaciones no leídas en la campana
        alertBell.innerHTML = `🔔 (${unreadCount})`; // Muestra el conteo en la campana
    } else {
        alertBell.classList.remove('notifications'); // Remover clase si no hay notificaciones no leídas
        alertBell.innerHTML = '🔔'; // Solo mostrar la campana sin conteo
    }
}


// El codigo actual es este no quites codigo solo agrega el setInterval, ademas agregale que tambien actualize la campana cuando hay una notificacion

// document.addEventListener('DOMContentLoaded', (event) => {
//     fetch('/api_registros/notificacion/')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             displayNotifications(data);
//         })
//         .catch(error => {
//             console.error('There was a problem with the fetch operation:', error);
//         });
  
// });

 
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// function displayNotifications(notifications) {
//     const notificationsContainer = document.getElementById('notifications-container');
//     notifications = notifications.filter(input => !input.read_status);

//     if(notifications.length === 0) {
//         const notificationElement = document.createElement('li');
//         notificationElement.classList.add('notification', 'list-group-item');
//         notificationElement.innerHTML = 
//             <a href='#'>
//                 <h3 class='fs-4'>No hay notificaciones</h3>
//             </a>;
//         notificationsContainer.appendChild(notificationElement);
//         return;
//     }

//     notifications.forEach(notification => {
//         const notificationElement = document.createElement('li');
//         const alertBell = document.querySelector('.bell');
//         alertBell.classList.add('notifications');
//         notificationElement.classList.add('notification', 'list-group-item');
//         notificationElement.innerHTML = 
//             <a href='#' id="">
//                 <h3 class='fs-4'>${notification.type}: ${notification.title}</h3>
//                 <p class='fs-5'>${notification.message.slice(0, 25)}...</p>
//             </a>;
       
//         notificationsContainer.appendChild(notificationElement);

//         notificationElement.addEventListener('click', () => {
//             notificationsContainer.removeChild(notificationElement);
//             if(notificationsContainer.children.length === 0) {
//                 const notificationElement = document.createElement('li');
//                 const alertBell = document.querySelector('.bell');

//                 alertBell.classList.remove('notifications');
//                 notificationElement.classList.add('notification', 'list-group-item');
//                 notificationElement.innerHTML = 
//                     <a href='#'>
//                         <h3 class='fs-4'>No hay notificaciones</h3>
//                     </a>;
//                 notificationsContainer.appendChild(notificationElement);
//             }
//             fetch(/api_registros/notificacion/${notification.id}/, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken')  // Add this line
//                 },
//             })
//                 .then(response => {
//                     window.location = "/user/notificaciones?id="+notification.id;
//                     if (!response.ok) {
//                         throw new Error('Network response was not ok');
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     console.log('Notification read:', data);
//                 })
//                 .catch(error => {
//                     console.error('There was a problem with the fetch operation:', error);
//                 });
//         });
//     });
// }
