const resumen = document.getElementById("resumen-checkout");
const form = document.getElementById("form-checkout");
const mensaje = document.getElementById("mensaje");
const btnVolver = document.getElementById("btn-volver");
const btnPagar = document.getElementById("btn-pagar");

const inputTarjeta = document.getElementById("tarjeta");
const inputVencimiento = document.getElementById("vencimiento");
const inputCvv = document.getElementById("cvv");

const data = JSON.parse(
    localStorage.getItem("pedidoHortensias") || "{}"
);


// Formatear valores en pesos colombianos
function formatearCOP(valor) {
    return "$" + Number(valor || 0).toLocaleString("es-CO");
}


// Mostrar mensajes de éxito o error
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;

    mensaje.classList.remove("ok", "error");

    if (tipo) {
        mensaje.classList.add(tipo);
    }
}


// Mostrar el resumen del pedido
function mostrarResumen() {

    if (!data.items || data.items.length === 0) {
        resumen.innerHTML =
            "<p>No hay productos pendientes por pagar.</p>";

        btnPagar.disabled = true;
        return;
    }

    let contenido = "<h2>Resumen del pedido</h2>";
    contenido += "<ul>";

    data.items.forEach(function (item) {

        contenido += `
            <li>
                <span>${item.nombre} x${item.cantidad}</span>
                <strong>${formatearCOP(item.subtotal)}</strong>
            </li>
        `;
    });

    contenido += "</ul>";

    contenido += `
        <p>
            <strong>Total:</strong>
            ${formatearCOP(data.total)}
        </p>

        <p>
            <strong>Donación solidaria:</strong>
            ${formatearCOP(data.donacion)}
        </p>

        <p>
            <strong>Arreglos a donar:</strong>
            ${data.arreglosSolidarios || 0}
        </p>
    `;

    resumen.innerHTML = contenido;
}


// Validar la fecha de vencimiento
function validarVencimiento(valor) {

    const partes = valor.split("/");

    if (partes.length !== 2) {
        return false;
    }

    const mes = Number(partes[0]);
    const anio = Number("20" + partes[1]);

    if (
        mes < 1 ||
        mes > 12 ||
        partes[0].length !== 2 ||
        partes[1].length !== 2
    ) {
        return false;
    }

    const fechaActual = new Date();

    
    const fechaVencimiento = new Date(anio, mes);

    return fechaVencimiento > fechaActual;
}


// Organizar automáticamente el número de tarjeta
inputTarjeta.addEventListener("input", function () {

    let numeros = inputTarjeta.value
        .replace(/\D/g, "")
        .slice(0, 16);

    inputTarjeta.value = numeros
        .replace(/(.{4})/g, "$1 ")
        .trim();
});


// Organizar el vencimiento como MM/AA
inputVencimiento.addEventListener("input", function () {

    let numeros = inputVencimiento.value
        .replace(/\D/g, "")
        .slice(0, 4);

    if (numeros.length > 2) {
        numeros =
            numeros.slice(0, 2) +
            "/" +
            numeros.slice(2);
    }

    inputVencimiento.value = numeros;
});


// Permitir únicamente números en el CVV
inputCvv.addEventListener("input", function () {

    inputCvv.value = inputCvv.value
        .replace(/\D/g, "")
        .slice(0, 4);
});


// Volver a la página de productos
btnVolver.addEventListener("click", function () {

    window.location.href = "CuerpoPagina.html";
});


// Procesar el formulario
form.addEventListener("submit", function (evento) {

    evento.preventDefault();

    mostrarMensaje("", "");


    // Validar que exista un pedido
    if (!data.items || data.items.length === 0) {

        mostrarMensaje(
            "No hay productos para pagar.",
            "error"
        );

        return;
    }


    // Validar campos obligatorios
    if (!form.checkValidity()) {

        form.reportValidity();

        mostrarMensaje(
            "Completa todos los campos obligatorios.",
            "error"
        );

        return;
    }


    const numeroTarjeta =
        inputTarjeta.value.replace(/\s/g, "");

    const vencimiento =
        inputVencimiento.value;

    const cvv =
        inputCvv.value;


    // Validar número de tarjeta
    if (numeroTarjeta.length !== 16) {

        mostrarMensaje(
            "El número de tarjeta debe tener 16 dígitos.",
            "error"
        );

        inputTarjeta.focus();
        return;
    }


    // Validar fecha de vencimiento
    if (!validarVencimiento(vencimiento)) {

        mostrarMensaje(
            "La fecha de vencimiento no es válida.",
            "error"
        );

        inputVencimiento.focus();
        return;
    }


    // Validar CVV
    if (cvv.length < 3 || cvv.length > 4) {

        mostrarMensaje(
            "El CVV debe tener 3 o 4 dígitos.",
            "error"
        );

        inputCvv.focus();
        return;
    }


    // Simulación del pago
    btnPagar.disabled = true;
    btnPagar.textContent = "Procesando...";

    mostrarMensaje(
        "Procesando pago de forma simulada...",
        "ok"
    );


    setTimeout(function () {

        const codigoPedido =
            "HP-" +
            Date.now().toString().slice(-6);


        mostrarMensaje(
            "Pedido pagado correctamente. Código: " +
            codigoPedido,
            "ok"
        );


        // Borrar el pedido después del pago
        localStorage.removeItem("pedidoHortensias");


        // Limpiar el formulario
        form.reset();

        
        btnPagar.textContent = "Pedido pagado";


        // Mostrar confirmación
        resumen.innerHTML = `
            <h2>Compra confirmada</h2>

            <p>
                Gracias por apoyar a
                <strong>Hortensias con Propósito</strong>.
            </p>

            <p>
                <strong>Código del pedido:</strong>
                ${codigoPedido}
            </p>

            <p>
                Tu compra contribuye a nuestras
                campañas solidarias y al apoyo de
                cultivadores locales.
            </p>
        `;

    }, 1200);
});

mostrarResumen();