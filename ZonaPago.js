const resumen = document.getElementById("resumen-checkout");
const form = document.getElementById("form-checkout");
const mensaje = document.getElementById("mensaje");
const btnVolver = document.getElementById("btn-volver");

const data = JSON.parse(localStorage.getItem("pedidoHortensias") || "{}");

