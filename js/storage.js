// guardar carrito
function guardarCarrito() {
    localStorage.setItem('carritoCompras', JSON.stringify(perfumes));
    localStorage.setItem('totalCarrito', total.toString());
    localStorage.setItem('cantidadCarrito', cantidad.toString());
}

// cargar carrito guardado
function cargarCarrito() {
    var carritoGuardado = localStorage.getItem('carritoCompras');
    var totalGuardado = localStorage.getItem('totalCarrito');
    var cantidadGuardada = localStorage.getItem('cantidadCarrito');
    
    if (carritoGuardado) {
        perfumes = JSON.parse(carritoGuardado);
        total = parseFloat(totalGuardado) || 0;
        cantidad = parseInt(cantidadGuardada) || 0;
        
        // revisar que tengan imagenes
        for (var i = 0; i < perfumes.length; i++) {
            var productoCompleto = buscarProducto(perfumes[i].id);
            if (productoCompleto) {
                perfumes[i].imagen = productoCompleto.imagen;
            }
        }
        
        // guardar todo de nuevo
        guardarCarrito();
        
        // mostrar en pantalla
        mostrarCarrito();
    }
}

// borrar todo
function limpiarStorage() {
    localStorage.removeItem('carritoCompras');
    localStorage.removeItem('totalCarrito'); 
    localStorage.removeItem('cantidadCarrito');
}

// ver si hay datos
function hayDatosGuardados() {
    return localStorage.getItem('carritoCompras') !== null;
}
