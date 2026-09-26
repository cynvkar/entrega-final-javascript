//Elementos del Dom

const contenedorProductos = document.getElementById("contenedor-productos");

const contenedorCarrito = document.getElementById("contenedor-carrito");

const botonVaciar = document.getElementById("btn-vaciar");

const botonFinalizar = document.getElementById("btn-finalizar");

// Recupera el carrito guardado o crea uno vacío si no existe
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


//Muestra los productos agregados al carrito y calcula el total
function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";

    carrito.forEach((producto) => {
        const itemCarrito = document.createElement("div");
        itemCarrito.classList.add("item-carrito");
        

        itemCarrito.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <button class="btn-sumar">+</button>
            <button class="btn-restar">-</button>
            <p>Subtotal: $${producto.precio * producto.cantidad}</p>
            <button class="btn-eliminar">Eliminar</button>
        `;

        contenedorCarrito.appendChild(itemCarrito);

        const botonSumar = itemCarrito.querySelector(".btn-sumar");

        botonSumar.addEventListener("click", () => {
            producto.cantidad++;

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();
        });

        const botonRestar = itemCarrito.querySelector(".btn-restar");

        botonRestar.addEventListener("click", () => {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                carrito = carrito.filter((item) => item.id !== producto.id);
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
        });

        const botonEliminar = itemCarrito.querySelector(".btn-eliminar");

        botonEliminar.addEventListener("click", () => {
            carrito = carrito.filter((item) => item.id !== producto.id);

            localStorage.setItem("carrito", JSON.stringify(carrito));

            mostrarCarrito();
        });

    });

    const total = carrito.reduce(
            (acumulador, producto) => acumulador + producto.precio * producto.cantidad,
            0
        );

        const totalCarrito = document.createElement("h3");
        totalCarrito.innerHTML = `Total: $${total}`;

        contenedorCarrito.appendChild(totalCarrito);

}


//Obtiene los productos desde el archivo JSON y los muestra en pantalla
async function cargarProductos() {

    try{

        const respuesta = await fetch(RUTA_PRODUCTOS);
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los productos");
        }

        const productos = await respuesta.json();

        productos.forEach((producto) => {

            const { nombre, precio, stock, imagen } = producto;
            const estadoStock = stock > 0 ? "Disponible" : "Sin stock";
        
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("producto-card");

        tarjeta.innerHTML = `
            <img src="${imagen}" alt="${nombre}" class="producto-img">
            <h2>${nombre}</h2>
            <p>Precio: $${precio}</p>
            <p>Stock: ${stock}</p>
            <p>Estado: ${estadoStock}</p>
            <button class="btn-agregar">Agregar al carrito</button>
        `;

        contenedorProductos.appendChild(tarjeta);
        
        const botonAgregar = tarjeta.querySelector(".btn-agregar");
        
        botonAgregar.addEventListener("click", () => {
            const productoEnCarrito = carrito.find((item) => item.id === producto.id);
             
            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({ ...producto, cantidad: 1 });
            }

            localStorage.setItem("carrito", JSON.stringify(carrito));
            
            mostrarCarrito();

});

});

} catch (error) {
    console.error("Error al cargar los productos:", error);

    contenedorProductos.innerHTML = `
        <p>No se pudieron cargar los productos. Intente nuevamente más tarde.</p>
    `;

} finally {
        console.info("Carga de productos finalizada");
}
}

//Vacía el carrito y elimina los datos guardados
botonVaciar.addEventListener("click", () => {
    Swal.fire({
        title: "¿Vaciar carrito?",
        text: "Se eliminarán todos los productos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, vaciar",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            carrito = [];
            localStorage.removeItem("carrito");
            mostrarCarrito();
        }
    });
});

botonFinalizar.addEventListener("click", () => {

    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agregá productos antes de finalizar la compra.",
            icon: "info"
        });
    } else {
    Swal.fire({
        title: "¿Finalizar compra?",
        text: "¿Confirmás tu compra?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, comprar",
        cancelButtonText: "Cancelar"
    }).then((resultado) => {

        if (resultado.isConfirmed) {
            carrito = [];
            localStorage.removeItem("carrito");
            mostrarCarrito();

            Swal.fire({
                title: "¡Compra realizada!",
                text: "Gracias por comprar en OK Lencería.",
                icon: "success"
            });
        }

    });
}

});

cargarProductos();
mostrarCarrito();