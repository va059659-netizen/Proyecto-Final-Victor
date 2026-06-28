const resumen = document.getElementById("resumen-checkout");
const form = document.getElementById("form-checkout");
const mensaje = document.getElementById("mensaje");
const btnVolver = document.getElementById("btn-volver");

const data = JSON.parse(localStorage.getItem("pedidoHortensias") || "{}");

function money(v){
  return "$" + Number(v || 0).toLocaleString("es-CO");
}

function pintarResumen(){
  const items = data.items || [];
  if(items.length === 0){
    resumen.innerHTML = "<p>No hay productos en el pedido. Vuelve y agrega productos al carrito.</p>";
    return;
  }

  let html = "<ul>";
  items.forEach((it) => {
    html += `<li><span>${it.nombre} x${it.cantidad}</span><strong>${money(it.subtotal)}</strong></li>`;
  });
  html += `</ul><p><strong>Total:</strong> ${money(data.total)} | <strong>Donación:</strong> ${money(data.donacion)}</p>`;
  resumen.innerHTML = html;
}

function invalid(msg){
  mensaje.textContent = msg;
  mensaje.className = "mensaje error";
}

btnVolver.addEventListener("click", () => {
  window.location.href = "CuerpoPagina.html";
});

document.getElementById("tarjeta").addEventListener("input", function(e){
  let v = e.target.value.replace(/\D/g, "").slice(0,16);
  v = v.replace(/(\d{4})(?=\d)/g, "$1 ");
  e.target.value = v;
});

document.getElementById("vencimiento").addEventListener("input", function(e){
  let v = e.target.value.replace(/\D/g, "").slice(0,4);
  if(v.length > 2) v = v.slice(0,2) + "/" + v.slice(2);
  e.target.value = v;
});

form.addEventListener("submit", function(e){
  e.preventDefault();

  const campos = ["nombre","correo","documento","telefono","direccion","titular","tarjeta","vencimiento","cvv","tipo"];
  for(const id of campos){
    const el = document.getElementById(id);
    if(!el.value.trim()){
      invalid("Completa todos los campos obligatorios.");
      return;
    }
  }

  const tarjeta = document.getElementById("tarjeta").value.replace(/\s/g,"");
  if(tarjeta.length < 16){
    invalid("El número de tarjeta debe tener 16 dígitos.");
    return;
  }

  const venc = document.getElementById("vencimiento").value;
  if(!/^\d{2}\/\d{2}$/.test(venc)){
    invalid("Fecha de vencimiento inválida. Usa MM/AA.");
    return;
  }

  const cvv = document.getElementById("cvv").value;
  if(!/^\d{3,4}$/.test(cvv)){
    invalid("CVV inválido.");
    return;
  }

  mensaje.textContent = "Pago aprobado (simulación). ¡Gracias por apoyar a Hortensias con Propósito!";
  mensaje.className = "mensaje ok";
  localStorage.removeItem("pedidoHortensias");

  setTimeout(() => {
    window.location.href = "CuerpoPagina.html";
  }, 1800);
});

pintarResumen();
