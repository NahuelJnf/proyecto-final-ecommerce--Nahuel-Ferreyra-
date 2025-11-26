// BUSCADOR DE PRODUCTOS
const buscador = document.getElementById("buscador");
const productos = document.querySelectorAll(".producto");

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase();

    productos.forEach(prod => {
        const nombre = prod.querySelector(".nombre b").textContent.toLowerCase();
        const descripcion = prod.querySelector(".descripcion").textContent.toLowerCase();

        // Si coincide con nombre o descripción → mostrar
        if (nombre.includes(texto) || descripcion.includes(texto)) {
            prod.parentElement.style.display = "block"; // <div class="divX">
        } else {
            prod.parentElement.style.display = "none";
        }
    });
});

// Elementos del carrito
const carritoBtn = document.getElementById("carritoBtn");
const carritoPanel = document.getElementById("carritoPanel");
const carritoCount = document.getElementById("carrito-count");
const carritoItems = document.getElementById("carrito-items");
const vaciarBtn = document.getElementById("vaciarCarrito");

// Crear botón "Comprar todo" si no existe
let comprarTodoBtn = document.getElementById("comprarTodo");
if (!comprarTodoBtn) {
    comprarTodoBtn = document.createElement("button");
    comprarTodoBtn.id = "comprarTodo";
    comprarTodoBtn.textContent = "Comprar todo";
    comprarTodoBtn.style.cssText = vaciarBtn.style.cssText;
    vaciarBtn.insertAdjacentElement("afterend", comprarTodoBtn);
}

// Modal de compra
const modalPago = document.getElementById("modalPago");
const cerrarModal = document.getElementById("cerrarModal");
const resumenCompra = document.getElementById("resumenCompra");
const confirmarCompra = document.getElementById("confirmarPago");

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Actualizar contador del carrito
function actualizarContador() {
    carritoCount.textContent = carrito.length;
}

// Mostrar productos en el panel
function mostrarCarrito() {
    carritoItems.innerHTML = "";

    carrito.forEach((prod, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `<b>${prod.nombre}</b><br>Precio: ${prod.precio}`;

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "X";
        btnEliminar.classList.add("btn-eliminar"); // Usar CSS
        btnEliminar.addEventListener("click", () => eliminarItem(index));

        itemDiv.appendChild(btnEliminar);
        carritoItems.appendChild(itemDiv);
    });
}

// Guardar en localStorage
function guardar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar mensaje temporal
function mostrarMensaje(texto) {
    const mensaje = document.createElement("div");
    mensaje.textContent = texto;
    mensaje.style.position = "fixed";
    mensaje.style.top = "120px";
    mensaje.style.right = "320px"; // Se mueve a la izquierda del carrito
    mensaje.style.background = "orange";
    mensaje.style.color = "black";
    mensaje.style.padding = "10px 15px";
    mensaje.style.borderRadius = "8px";
    mensaje.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    mensaje.style.zIndex = "10000";
    mensaje.style.fontWeight = "bold";
    document.body.appendChild(mensaje);

    setTimeout(() => mensaje.remove(), 2000);
}

// Agregar producto al carrito
function agregarProducto(nombre, precio) {
    if (carrito.some(p => p.nombre === nombre)) {
        mostrarMensaje(`${nombre} ya está en el carrito`);
    }

    carrito.push({ nombre, precio });
    guardar();
    actualizarContador();
    mostrarCarrito();

    // ---- Animación del contador ----
    carritoCount.classList.remove("rebote");
    void carritoCount.offsetWidth;
    carritoCount.classList.add("rebote");

    mostrarMensaje(`${nombre} agregado al carrito`);
}


// Eliminar producto individual
function eliminarItem(i) {
    carrito.splice(i, 1);
    guardar();
    actualizarContador();
    mostrarCarrito();
}

// Vaciar carrito
vaciarBtn.addEventListener("click", () => {
    carrito = [];
    guardar();
    actualizarContador();
    mostrarCarrito();
});

// Abrir/cerrar panel
carritoBtn.addEventListener("click", () => {
    carritoPanel.classList.toggle("open");
});

// Botones “Agregar al carrito”
document.querySelectorAll(".add-carrito").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = boton.dataset.precio;
        agregarProducto(nombre, precio);
    });
});

// Botones "Comprar" individuales
document.querySelectorAll(".botonc").forEach(boton => {
    boton.addEventListener("click", () => {
        const producto = boton.closest(".producto");
        const nombre = producto.querySelector(".nombre b").textContent;
        const precio = producto.querySelector(".precio").textContent;
        resumenCompra.innerHTML = `<div>${nombre} - ${precio}</div>`;
        modalPago.style.display = "flex";
    });
});

// Comprar todo
comprarTodoBtn.addEventListener("click", () => {
    if (carrito.length === 0) {
        mostrarMensaje("El carrito está vacío");
        return;
    }

    resumenCompra.innerHTML = "";
    carrito.forEach(prod => {
        const item = document.createElement("div");
        item.textContent = `${prod.nombre} - ${prod.precio}`;
        resumenCompra.appendChild(item);
    });

    modalPago.style.display = "flex";
});

// Cerrar modal
cerrarModal.addEventListener("click", () => {
    modalPago.style.display = "none";
});

// Cerrar modal al hacer click fuera
window.addEventListener("click", e => {
    if (e.target == modalPago) modalPago.style.display = "none";
});

// Confirmar compra (redirigir)
confirmarCompra.addEventListener("click", () => {
    let productos = Array.from(resumenCompra.children).map(p => p.textContent);
    window.location.href = `https://ejemplo-pago.com/?productos=${encodeURIComponent(productos.join(", "))}`;
});

// Inicializar
actualizarContador();
mostrarCarrito();