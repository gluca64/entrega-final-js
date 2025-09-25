// cosas de la interfaz

// cerrar carrito
function closeBtn(){
    document.getElementById("productos-id").style.display = "none";
}

// mostrar carrito
function showCart(x){
    document.getElementById("productos-id").style.display = "block";
}

// mostrar alertas
function showAlert(tipo, titulo, mensaje) {
    var ventana = document.getElementById('customAlert');
    var icono = document.getElementById('alertIcon');
    var tituloElemento = document.getElementById('alertTitle');
    var mensajeElemento = document.getElementById('alertMessage');
    var iconoDiv = icono.parentElement;
    
    iconoDiv.className = 'alert-icon';
    
    if (tipo === 'success') {
        iconoDiv.classList.add('success');
        icono.textContent = 'OK';
    } else if (tipo === 'error') {
        iconoDiv.classList.add('error');
        icono.textContent = 'ERROR';
    } else if (tipo === 'warning') {
        iconoDiv.classList.add('warning');
        icono.textContent = 'AVISO';
    }
    
    tituloElemento.textContent = titulo;
    mensajeElemento.textContent = mensaje;
    ventana.style.display = 'block';
}

// cerrar alertas
function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
    
    // limpiar botones de confirmacion si existen
    var contenedorBotones = document.querySelector('.confirm-buttons');
    if (contenedorBotones) {
        contenedorBotones.remove();
    }
    
    // mostrar boton original
    var botonOriginal = document.querySelector('.alert-btn:not(.confirm):not(.cancel)');
    if (botonOriginal) {
        botonOriginal.style.display = 'inline-block';
    }
}

// inicializar cuando carga todo
function inicializarUI() {
    // cerrar alerta si haces click afuera
    window.onclick = function(event) {
        var alertModal = document.getElementById('customAlert');
        
        if (event.target === alertModal) {
            closeAlert();
        }
    }
    
    // hacer showAlert global
    window.showAlert = showAlert;
    
    // funcion para borrar todo (usar en consola)
    window.limpiarTodo = function() {
        localStorage.clear();
        location.reload();
    };
}

// inicializar cuando el DOM este listo
document.addEventListener('DOMContentLoaded', inicializarUI);
