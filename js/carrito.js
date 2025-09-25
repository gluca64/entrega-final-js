//variables del carrito
var todosLosProductos = document.querySelector('.productos');
var contenedorCarrito = document.querySelector('.card-items');
var precioTotal = document.querySelector('.price-total')
var cantidadProducto = document.querySelector('.count-product');

var perfumes = [];
var total = 0;
var cantidad = 0;

//empezar todo
empezar();

function empezar(){
    // cargar productos primero
    cargarProductos();
    
    // cargar datos guardados
    cargarCarrito();
    
    // eventos
    todosLosProductos.addEventListener('click', agregarPerfume);
    contenedorCarrito.addEventListener('click', quitarPerfume);
}

// agregar perfume
function agregarPerfume(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-agregar-cart')) {
        // limite de productos
        if (cantidad >= 10) {
            window.showAlert('error', 'Carrito Lleno', 'Has alcanzado el limite de productos');
            return;
        }
        
        var idProducto = e.target.getAttribute('data-id');
        var cantidadInput = document.getElementById('cantidad-' + idProducto);
        var cantidadDeseada = parseInt(cantidadInput.value) || 1;
        
        // validar cantidad
        if (cantidadDeseada <= 0 || cantidadDeseada > 5) {
            window.showAlert('warning', 'Cantidad no válida', 'La cantidad debe ser entre 1 y 5');
            cantidadInput.value = 1;
            return;
        }
        
        var producto = buscarProducto(idProducto);
        
        if (!producto) {
            window.showAlert('error', 'Error', 'Producto no encontrado');
            return;
        }
        
        if (!verificarStock(idProducto)) {
            window.showAlert('error', 'Sin Stock', 'No hay suficiente stock disponible');
            return;
        }
        
        // agregar todo
        for (var i = 0; i < cantidadDeseada; i++) {
            agregarAlCarrito(producto);
        }
        
        // resetear input
        cantidadInput.value = 1;
    }
}

// quitar perfume
function quitarPerfume(e) {
    if (e.target.classList.contains('delete-product')) {
        var id = e.target.getAttribute('data-id');
        eliminarProducto(id);
    }
    
    // botones + y -
    if (e.target.classList.contains('increase-qty')) {
        var id = e.target.getAttribute('data-id');
        aumentarCantidad(id);
    }
    
    if (e.target.classList.contains('decrease-qty')) {
        var id = e.target.getAttribute('data-id');
        disminuirCantidad(id);
    }
}

// agregar al carrito
function agregarAlCarrito(producto) {
    // ver si ya existe
    var productoExistente = null;
    for (var i = 0; i < perfumes.length; i++) {
        if (perfumes[i].id === producto.id) {
            productoExistente = perfumes[i];
            break;
        }
    }
    
    if (productoExistente) {
        productoExistente.cantidad = productoExistente.cantidad + 1;
    } else {
        perfumes.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
            imagen: producto.imagen
        });
    }
    
    // actualizar todo
    calcularTotales();
    mostrarCarrito();
    guardarCarrito();
}

// calcular totales
function calcularTotales() {
    total = 0;
    cantidad = 0;
    
    for (var i = 0; i < perfumes.length; i++) {
        total += perfumes[i].precio * perfumes[i].cantidad;
        cantidad += perfumes[i].cantidad;
    }
}

// sacar producto
function eliminarProducto(id) {
    var nombreEliminado = '';
    
    for(var i = 0; i < perfumes.length; i++){
        if (perfumes[i].id == id) {
            nombreEliminado = perfumes[i].nombre;
            perfumes.splice(i, 1);
            break;
        }
    }
    
    // si esta vacio
    if (perfumes.length === 0) {
        total = 0;
        cantidad = 0;
        precioTotal.innerHTML = '0';
        cantidadProducto.innerHTML = 0;
    }
    
    calcularTotales();
    mostrarCarrito();
    guardarCarrito();
}

// sumar cantidad
function aumentarCantidad(id) {
    for(var i = 0; i < perfumes.length; i++){
        if (perfumes[i].id == id) {
            perfumes[i].cantidad = perfumes[i].cantidad + 1;
            break;
        }
    }
    calcularTotales();
    mostrarCarrito();
    guardarCarrito();
}

// restar cantidad
function disminuirCantidad(id) {
    for(var i = 0; i < perfumes.length; i++){
        if (perfumes[i].id == id) {
            if (perfumes[i].cantidad > 1) {
                perfumes[i].cantidad = perfumes[i].cantidad - 1;
            } else {
                eliminarProducto(id);
                return;
            }
            break;
        }
    }
    calcularTotales();
    mostrarCarrito();
    guardarCarrito();
}

// mostrar carrito
function mostrarCarrito(){
    limpiarCarrito();
    
    // calcular de nuevo
    calcularTotales();
    
    for(var i = 0; i < perfumes.length; i++){
        var perfume = perfumes[i];
        
        // revisar que tenga imagen
        if (!perfume.imagen) {
            var productoCompleto = buscarProducto(perfume.id);
            if (productoCompleto) {
                perfume.imagen = productoCompleto.imagen;
            }
        }
        
        var fila = document.createElement('div');
        fila.classList.add('item');
        
        // crear contenido
        var imagenSrc = perfume.imagen || './images/perfumes/default.jpg';
        var contenidoHTML = '<div class="item-image">';
        contenidoHTML += '<img src="' + imagenSrc + '" alt="' + perfume.nombre + '">';
        contenidoHTML += '</div>';
        contenidoHTML += '<div class="item-content">';
        contenidoHTML += '<h5>' + perfume.nombre + '</h5>';
        contenidoHTML += '<div class="item-price">$' + perfume.precio.toLocaleString('es-CL') + ' c/u</div>';
        contenidoHTML += '</div>';
        contenidoHTML += '<div class="quantity-controls">';
        contenidoHTML += '<div class="quantity-row">';
        contenidoHTML += '<button class="decrease-qty" data-id="' + perfume.id + '">-</button>';
        contenidoHTML += '<span class="quantity-display">' + perfume.cantidad + '</span>';
        contenidoHTML += '<button class="increase-qty" data-id="' + perfume.id + '">+</button>';
        contenidoHTML += '</div>';
        contenidoHTML += '<div class="delete-product" data-id="' + perfume.id + '">🗑️ Eliminar</div>';
        contenidoHTML += '</div>';
        
        fila.innerHTML = contenidoHTML;
        contenedorCarrito.appendChild(fila);
    }
    precioTotal.innerHTML = total.toLocaleString('es-CL');
    cantidadProducto.innerHTML = cantidad;
}

// limpiar carrito
function limpiarCarrito(){
    contenedorCarrito.innerHTML = '';
}

// borrar todo el carrito
function limpiarTodoElCarrito() {
    perfumes = [];
    total = 0;
    cantidad = 0;
    
    limpiarCarrito();
    precioTotal.innerHTML = '0';
    cantidadProducto.innerHTML = 0;
    
    limpiarStorage();
}

// info del carrito
function mostrarReporte() {
    return {
        perfumes: perfumes,
        total: total,
        cantidad: cantidad
    };
}

// finalizar compra
function finalizarCompra() {
    if (perfumes.length === 0) {
        window.showAlert('warning', 'Carrito Vacío', 'Agrega productos antes de comprar');
        return;
    }
    
    var totalFormateado = total.toLocaleString('es-CL');
    
    // crear confirmacion personalizada directamente
    mostrarConfirmacionPersonalizada(totalFormateado);
}

// mostrar confirmacion personalizada
function mostrarConfirmacionPersonalizada(totalFormateado) {
    var ventana = document.getElementById('customAlert');
    var icono = document.getElementById('alertIcon');
    var tituloElemento = document.getElementById('alertTitle');
    var mensajeElemento = document.getElementById('alertMessage');
    var iconoDiv = icono.parentElement;
    var contenidoAlerta = document.querySelector('.alert-content');
    
    // configurar como pregunta
    iconoDiv.className = 'alert-icon question';
    icono.textContent = '?';
    tituloElemento.textContent = '¿Confirmar compra?';
    mensajeElemento.textContent = 'Total a pagar: $' + totalFormateado;
    
    // ocultar boton original
    var botonOriginal = document.querySelector('.alert-btn:not(.confirm):not(.cancel)');
    if (botonOriginal) {
        botonOriginal.style.display = 'none';
    }
    
    // crear botones de confirmacion
    var contenedorBotones = document.createElement('div');
    contenedorBotones.className = 'confirm-buttons';
    
    var botonSi = document.createElement('button');
    botonSi.className = 'alert-btn confirm';
    botonSi.textContent = 'Sí';
    botonSi.onclick = function() {
        confirmarCompraDirect(totalFormateado);
    };
    
    var botonNo = document.createElement('button');
    botonNo.className = 'alert-btn cancel';
    botonNo.textContent = 'No';
    botonNo.onclick = function() {
        closeAlert();
    };
    
    contenedorBotones.appendChild(botonSi);
    contenedorBotones.appendChild(botonNo);
    contenidoAlerta.appendChild(contenedorBotones);
    
    ventana.style.display = 'block';
}

// confirmar compra directa
function confirmarCompraDirect(totalFormateado) {
    // cerrar la confirmacion
    closeAlert();
    
    // limpiar carrito y cerrar
    limpiarTodoElCarrito();
    closeBtn();
    
    // mostrar compra exitosa despues de un momento
    setTimeout(function() {
        window.showAlert('success', 'Compra Exitosa!', 'Gracias por tu compra de $' + totalFormateado);
    }, 300);
}

// procesar compra confirmada
function procesarCompra(totalFormateado) {
    // primero limpiar carrito y cerrar
    limpiarTodoElCarrito();
    closeBtn();
    
    // luego mostrar confirmacion de compra exitosa
    setTimeout(function() {
        window.showAlert('success', 'Compra Exitosa!', 'Gracias por tu compra de $' + totalFormateado);
    }, 300);
}

