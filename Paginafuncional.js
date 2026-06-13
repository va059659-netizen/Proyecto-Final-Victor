let total = 0;
let cantidad = 0;

const botones = document.querySelectorAll(".agregar-carrito");
const totalCarrito = document.getElementById("total-carrito");
const donacion = document.getElementById("donacion");
const arreglosDonar = document.getElementById("arreglos-donar");
const cultivadores = document.getElementById("cultivadores");

botones.forEach(function(boton){
  boton.addEventListener("click", function(){
    const precio = Number(boton.dataset.precio);
    total = total + precio;
    cantidad = cantidad + 1;

    const valorDonacion = Math.floor(total * 0.10);
    const familias = Math.floor(cantidad / 2);

    totalCarrito.textContent = "$" + total.toLocaleString("es-CO");
    donacion.textContent = "$" + valorDonacion.toLocaleString("es-CO");
    arreglosDonar.textContent = cantidad;
    cultivadores.textContent = familias;
  });
});
