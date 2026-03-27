var catalogo = [];

function renderizarMenu() { 
    var contenedor = document.getElementById('contenedor-menu'); 
    var html = ''; 
    for (var i = 0; i < catalogo.length; i++) { 
        var item = catalogo[i]; 
        // Le quitamos el onload que estaba causando el problema
        html += '<div class="item" data-categoria="' + item.categoria + '" onclick="abrirLightbox(' + i + ')"><img src="' + item.imagen + '" alt="' + item.nombre + '" loading="lazy"><div class="overlay"><div class="calificacion-mini"><i class="fa-solid fa-star"></i> ' + item.calificacion + '</div><div class="fila-info"><span class="nombre-producto">' + item.nombre + '</span><span class="precio">$' + item.precio + '</span></div></div></div>'; 
    } 
    contenedor.innerHTML = html; 

}
var ordenCarrito = []; var totalGlobal = 0; var indexProductoActual = -1;

window.onload = function() { if (localStorage.getItem('carritoCafeteria')) { ordenCarrito = JSON.parse(localStorage.getItem('carritoCafeteria')); actualizarInterfazCarrito(); } if (localStorage.getItem('temaCafeteria') === 'oscuro') { toggleTemaForzado(); } };

function toggleTemaForzado() { document.body.classList.add('dark-mode'); document.getElementById('icono-tema').classList.replace('fa-moon', 'fa-sun'); }

function toggleTema() { var body = document.body; var icono = document.getElementById('icono-tema'); body.classList.toggle('dark-mode'); if (body.classList.contains('dark-mode')) { icono.classList.replace('fa-moon', 'fa-sun'); localStorage.setItem('temaCafeteria', 'oscuro'); } else { icono.classList.replace('fa-sun', 'fa-moon'); localStorage.setItem('temaCafeteria', 'claro'); } }

function buscarProducto() { var textoIngresado = document.getElementById('buscador').value.toLowerCase(); var items = document.querySelectorAll('.item'); items.forEach(function(item) { var nombreProducto = item.querySelector('.nombre-producto').innerText.toLowerCase(); if (nombreProducto.includes(textoIngresado)) { item.classList.remove('oculto'); } else { item.classList.add('oculto'); } }); document.querySelectorAll('.btn-filtro').forEach(function(btn) { btn.classList.remove('activo'); }); }

function filtrar(categoria) { var items = document.querySelectorAll('.item'); var botones = document.querySelectorAll('.btn-filtro'); document.getElementById('buscador').value = ""; botones.forEach(function(btn) { btn.classList.remove('activo'); }); event.target.classList.add('activo'); items.forEach(function(item) { if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) { item.classList.remove('oculto'); } else { item.classList.add('oculto'); } }); }

function abrirLightbox(index) { indexProductoActual = index; var item = catalogo[index]; document.getElementById('lightbox-img').src = item.imagen; document.getElementById('lightbox-texto').innerText = item.nombre; document.getElementById('lightbox-precio').innerText = "$" + item.precio; var estrellasHTML = '<i class="fa-solid fa-star"></i> ' + item.calificacion + ' <span class="resenas-lightbox">(' + item.resenas + ' reseñas)</span>'; document.getElementById('lightbox-estrellas').innerHTML = estrellasHTML; var contenedorOpciones = document.getElementById('contenedor-opciones'); contenedorOpciones.innerHTML = ''; if (item.opciones && item.opciones.length > 0) { var htmlOpciones = '<div class="opciones-contenedor">'; for (var i = 0; i < item.opciones.length; i++) { var grupo = item.opciones[i]; htmlOpciones += '<div class="grupo-opcion"><label>' + grupo.nombreFiltro + '</label><select class="select-personalizado" onchange="recalcularPrecio()">'; for (var j = 0; j < grupo.variaciones.length; j++) { var variante = grupo.variaciones[j]; var textoExtra = variante.extra > 0 ? ' (+$' + variante.extra + ')' : ''; htmlOpciones += '<option value="' + variante.extra + '" data-etiqueta="' + variante.etiqueta + '">' + variante.etiqueta + textoExtra + '</option>'; } htmlOpciones += '</select></div>'; } htmlOpciones += '</div>'; contenedorOpciones.innerHTML = htmlOpciones; } document.getElementById('lightbox').style.display = 'flex'; document.body.style.overflow = 'hidden'; }

function recalcularPrecio() { var item = catalogo[indexProductoActual]; var precioBase = item.precio; var extrasTotal = 0; var selects = document.querySelectorAll('.select-personalizado'); selects.forEach(function(select) { extrasTotal += parseInt(select.value); }); var precioFinal = precioBase + extrasTotal; document.getElementById('lightbox-precio').innerText = "$" + precioFinal; }

function cerrarLightbox() { document.getElementById('lightbox').style.display = 'none'; document.body.style.overflow = 'auto'; }

document.addEventListener('keydown', function(event) { if (event.key === "Escape") { cerrarLightbox(); var panel = document.getElementById('panelCarrito'); if (panel.classList.contains('abierto')) { toggleCarrito(); } } });

function mostrarToast(mensaje) { var toast = document.getElementById("toast"); toast.innerText = mensaje; toast.className = "toast mostrar"; setTimeout(function(){ toast.className = toast.className.replace("mostrar", ""); }, 3000); }

function toggleCarrito() { var panel = document.getElementById('panelCarrito'); panel.classList.toggle('abierto'); }

function agregarAlCarrito() { var item = catalogo[indexProductoActual]; var precioBase = item.precio; var extrasTotal = 0; var detallesTexto = []; var selects = document.querySelectorAll('.select-personalizado'); selects.forEach(function(select) { var costoExtra = parseInt(select.value); extrasTotal += costoExtra; var etiquetaSeleccionada = select.options[select.selectedIndex].getAttribute('data-etiqueta'); if (costoExtra > 0 || etiquetaSeleccionada.includes("Leche")) { detallesTexto.push(etiquetaSeleccionada); } }); var precioFinal = precioBase + extrasTotal; var productoAComprar = { nombre: item.nombre, precio: precioFinal, detalles: detallesTexto.join(", ") }; ordenCarrito.push(productoAComprar); localStorage.setItem('carritoCafeteria', JSON.stringify(ordenCarrito)); actualizarInterfazCarrito(); cerrarLightbox(); mostrarToast("✅ " + item.nombre + " añadido al carrito"); }

function eliminarDelCarrito(index) { ordenCarrito.splice(index, 1); localStorage.setItem('carritoCafeteria', JSON.stringify(ordenCarrito)); actualizarInterfazCarrito(); }

function actualizarInterfazCarrito() { var divLista = document.getElementById('listaCarrito'); var spanTotal = document.getElementById('totalCarrito'); var spanContador = document.getElementById('contador'); spanContador.innerText = ordenCarrito.length; if (ordenCarrito.length === 0) { divLista.innerHTML = '<p style="text-align: center; color: gray; margin-top: 50px;">Tu carrito está vacío</p>'; spanTotal.innerText = '0'; totalGlobal = 0; return; } var html = ''; totalGlobal = 0; for (var i = 0; i < ordenCarrito.length; i++) { html += '<div class="item-carrito"><div class="item-carrito-top"><span>' + ordenCarrito[i].nombre + '</span><span>$' + ordenCarrito[i].precio + ' <i class="fa-solid fa-trash" style="color:#e74c3c; cursor:pointer; margin-left:10px;" onclick="eliminarDelCarrito(' + i + ')"></i></span></div>'; if (ordenCarrito[i].detalles !== "") { html += '<div class="item-carrito-detalles">Con: ' + ordenCarrito[i].detalles + '</div>'; } html += '</div>'; totalGlobal += ordenCarrito[i].precio; } divLista.innerHTML = html; spanTotal.innerText = totalGlobal; }

function enviarWhatsApp() { 
    if (ordenCarrito.length === 0) { 
        mostrarToast("❌ Agrega productos primero"); 
        return; 
    } 

    // 1. Validamos que el cliente haya puesto su nombre
    var nombreInput = document.getElementById('nombreCliente').value.trim();
    if (nombreInput === "") {
        mostrarToast("⚠️ Por favor, ingresa tu nombre");
        // Hacemos que el cuadro parpadee o se enfoque para llamar la atención
        document.getElementById('nombreCliente').focus();
        return;
    }

    // 2. Armamos el mensaje para WhatsApp
    var mensaje = "☕ *¡Hola! Soy " + nombreInput + " y paso a recoger esta orden:* \n\n"; 
    
    // 3. Armamos un mini-resumen de texto oculto para meterlo adentro del QR
    var resumenQR = "Cliente: " + nombreInput + " | Orden: "; 

    for (var i = 0; i < ordenCarrito.length; i++) { 
        mensaje += "🔸 1x " + ordenCarrito[i].nombre; 
        resumenQR += "1x " + ordenCarrito[i].nombre;

        if (ordenCarrito[i].detalles !== "") { 
            mensaje += " _(" + ordenCarrito[i].detalles + ")_"; 
            resumenQR += " (" + ordenCarrito[i].detalles + ")";
        } 
        mensaje += " - $" + ordenCarrito[i].precio + "\n"; 
        resumenQR += ", ";
    } 

    mensaje += "\n💰 *Total a pagar: $" + totalGlobal + "*\n\nLlego en un momento."; 
    resumenQR += " Total: $" + totalGlobal;

    // 4. Generamos el Código QR usando la API
    var urlQR = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(resumenQR);
    document.getElementById('codigoQR').src = urlQR;
    
    // Hacemos visible el código en la pantalla
    document.getElementById('contenedorQR').style.display = "block";

    // 5. Abrimos WhatsApp
    var numeroTelefono = "526641811247"; 
    var urlWhatsApp = "https://wa.me/" + numeroTelefono + "?text=" + encodeURIComponent(mensaje); 
    window.open(urlWhatsApp, "_blank"); 

    // 6. Vaciamos el carrito en la memoria (pero dejamos la lista a la vista para que el cliente vea su QR junto a su orden)
    ordenCarrito = []; 
    localStorage.setItem('carritoCafeteria', JSON.stringify(ordenCarrito)); 
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registrado con éxito:', registration.scope);
            })
            .catch(error => {
                console.log('Fallo al registrar el Service Worker:', error);
            });
    });
}