let total = 0;
let cantidad = 0;
const carrito = {};

const botonesAgregar = document.querySelectorAll(".agregar-carrito");
const totalCarrito = document.getElementById("total-carrito");
const donacion = document.getElementById("donacion");
const arreglosDonar = document.getElementById("arreglos-donar");
const cultivadores = document.getElementById("cultivadores");
const listaCarrito = document.getElementById("lista-carrito");
const mensajeEstado = document.getElementById("mensaje-estado");

const btnImpacto = document.getElementById("btn-ir-impacto");
const btnCultivadores = document.getElementById("btn-ir-cultivadores");
const btnConfirmar = document.getElementById("btn-confirmar");
const btnVaciar = document.getElementById("btn-vaciar");
const btnCarrito = document.querySelector(".btn-carrito");

function formatearCOP(valor){
  return "$" + valor.toLocaleString("es-CO");
}

function mostrarMensaje(texto, tipo){
  mensajeEstado.textContent = texto;
  mensajeEstado.classList.remove("exito", "error");
  if(tipo){
    mensajeEstado.classList.add(tipo);
  }
}

function renderCarrito(){
  listaCarrito.innerHTML = "";

  const nombres = Object.keys(carrito);
  if(nombres.length === 0){
    listaCarrito.innerHTML = '<li class="vacio">Aún no has agregado productos.</li>';
    return;
  }

  nombres.forEach(function(nombre){
    const item = carrito[nombre];
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${nombre} x${item.cantidad}</span>
      <strong>${formatearCOP(item.subtotal)}</strong>
    `;
    listaCarrito.appendChild(li);
  });
}

function actualizarIndicadores(){
  const valorDonacion = Math.floor(total * 0.10);
  const arreglosSolidarios = Math.floor(cantidad / 2);
  const familias = Math.max(1, Math.floor(cantidad / 3));

  totalCarrito.textContent = formatearCOP(total);
  donacion.textContent = formatearCOP(valorDonacion);
  arreglosDonar.textContent = arreglosSolidarios;
  cultivadores.textContent = cantidad > 0 ? familias : 0;
}

function agregarProducto(nombre, precio){
  total += precio;
  cantidad += 1;

  if(!carrito[nombre]){
    carrito[nombre] = {
      precio: precio,
      cantidad: 0,
      subtotal: 0
    };
  }

  carrito[nombre].cantidad += 1;
  carrito[nombre].subtotal += precio;

  actualizarIndicadores();
  renderCarrito();
  mostrarMensaje(`Agregaste "${nombre}" al carrito.`, "exito");
}

function vaciarCarrito(){
  total = 0;
  cantidad = 0;

  Object.keys(carrito).forEach(function(nombre){
    delete carrito[nombre];
  });

  actualizarIndicadores();
  renderCarrito();
}

botonesAgregar.forEach(function(boton){
  boton.addEventListener("click", function(){
    const nombre = boton.dataset.nombre;
    const precio = Number(boton.dataset.precio);
    agregarProducto(nombre, precio);
  });
});

btnImpacto.addEventListener("click", function(){
  document.getElementById("seccion-impacto").scrollIntoView({ behavior: "smooth" });
});

btnCultivadores.addEventListener("click", function(){
  document.getElementById("seccion-cultivadores").scrollIntoView({ behavior: "smooth" });
});

btnCarrito.addEventListener("click", function(){
  document.getElementById("seccion-carrito").scrollIntoView({ behavior: "smooth" });
});

btnVaciar.addEventListener("click", function(){
  if(cantidad === 0){
    mostrarMensaje("El carrito ya está vacío.", "error");
    return;
  }
  vaciarCarrito();
  mostrarMensaje("Carrito vaciado correctamente.", "exito");
});

btnConfirmar.addEventListener("click", function(){
  if(cantidad === 0){
    mostrarMensaje("Debes agregar al menos un producto antes de confirmar.", "error");
    return;
  }

  const items = Object.keys(carrito).map(function(nombre){
    return {
      nombre: nombre,
      cantidad: carrito[nombre].cantidad,
      subtotal: carrito[nombre].subtotal
    };
  });

  const pedido = {
    items: items,
    total: total,
    donacion: Math.floor(total * 0.10),
    arreglosSolidarios: Math.floor(cantidad / 2),
    fecha: new Date().toISOString()
  };

  localStorage.setItem("pedidoHortensias", JSON.stringify(pedido));
  mostrarMensaje("Redirigiendo al ZonaPago para finalizar la compra...", "exito");

  setTimeout(function(){
    window.location.href = "ZonaPago.html";
  }, 700);
});
