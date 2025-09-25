// perfumes que hay en la tienda
var productos = [];

// cargar productos desde archivo json
function cargarProductos() {
    fetch('./data/productos.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            productos = data;
            // crear html cuando termina de cargar
            crearProductosHTML();
        })
        .catch(function(error) {
            window.showAlert('error', 'Error', 'No se pudieron cargar los productos');
        });
}

// crear html de productos
function crearProductosHTML() {
    var contenedor = document.querySelector('.productos');
    contenedor.innerHTML = '';
    
    // crear cada tarjeta de producto
    for (var i = 0; i < productos.length; i++) {
        var producto = productos[i];
        
        var tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjetas');
        
        // armar el html de la tarjeta
        var html = '<div class="producto-imagen">';
        html += '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
        html += '<div class="precio-overlay">$' + producto.precio.toLocaleString('es-CL') + '</div>';
        html += '</div>';
        html += '<p class="marca">' + producto.marca + '</p>';
        html += '<p class="titulo">' + producto.nombre + '</p>';
        html += '<p class="descripcion">' + producto.descripcion + '</p>';
        html += '<div class="input-cantidad">';
        html += '<input type="number" min="1" max="5" value="1" id="cantidad-' + producto.id + '">';
        html += '</div>';
        html += '<a href="" data-id="' + producto.id + '" class="btn-agregar-cart">Agregar al Carrito</a>';
        
        tarjeta.innerHTML = html;
        contenedor.appendChild(tarjeta);
    }
}

// buscar producto por id
function buscarProducto(id) {
    for (var i = 0; i < productos.length; i++) {
        if (productos[i].id == parseInt(id)) {
            return productos[i];
        }
    }
    return null;
}

// ver si hay stock
function verificarStock(id) {
    var producto = buscarProducto(id);
    if (producto && producto.stock > 0) {
        return true;
    } else {
        return false;
    }
}

// restar stock cuando se compra
function actualizarStock(id, cantidad) {
    var producto = buscarProducto(id);
    if (producto) {
        producto.stock = producto.stock - cantidad;
        return true;
    }
    return false;
}
