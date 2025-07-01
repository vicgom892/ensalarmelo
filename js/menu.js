// Número de destino (TU número de WhatsApp)
let numeroDestino = "5491157194796"; // Reemplazar con tu número real

// Variable global para el mensaje que se armará
let mensajeFinal = "";

// Actualiza el precio en vivo según cantidad de ingredientes seleccionados
const form = document.getElementById('custom-form');
const precioEl = document.getElementById('precio');

form.addEventListener('change', () => {
  const ingredientes = form.querySelectorAll('input[type="checkbox"]:checked');
  const cantidad = ingredientes.length;

  let precio = 0;
  if (cantidad === 2) precio = 1300;
  else if (cantidad === 3) precio = 1600;
  else if (cantidad >= 4) precio = 1900;
  else precio = 1000;

  precioEl.textContent = `$${precio}`;
});

// Abre el modal de confirmación con el resumen del pedido
function abrirModal(mensaje) {
  mensajeFinal = mensaje;
  document.getElementById('resumenPedido').innerHTML =
    `<strong>Resumen:</strong><br>${mensaje.replace(/\n/g, '<br>')}`;
  document.getElementById('pedido-modal').classList.remove('hidden');
}

// Cierra el modal
function cerrarModal() {
  document.getElementById('pedido-modal').classList.add('hidden');
}

// Enviar mensaje final a WhatsApp
function confirmarPedido() {
  const nombreInput = document.getElementById('nombreCliente');
  const telefonoInput = document.getElementById('telefonoCliente');
  const nombre = nombreInput.value.trim();
  const numeroCliente = telefonoInput.value.trim();

  let valido = true;

  if (!nombre) {
    nombreInput.classList.add('error');
    valido = false;
  } else {
    nombreInput.classList.remove('error');
  }

  if (!numeroCliente || !/^\d{6,15}$/.test(numeroCliente.replace(/\s+/g, ''))) {
    telefonoInput.classList.add('error');
    valido = false;
  } else {
    telefonoInput.classList.remove('error');
  }

  if (!valido) {
    alert("Por favor, completá bien tu nombre y número.");
    return;
  }

  const mensajeConDatos = `👋 Hola! Soy ${nombre} (${numeroCliente}) y quiero pedir:\n\n${mensajeFinal}`;
  const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensajeConDatos)}`;
  window.open(url, '_blank');
  cerrarModal();
}

// Función para pedidos personalizados (formulario "Armá el tuyo")
function enviarPedido(e) {
  e.preventDefault();

  const base = document.getElementById('baseLicuado').value;
  const ingredientes = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
  const precio = document.getElementById('precio').textContent;

  if (!base || ingredientes.length === 0) {
    alert("Por favor, elegí al menos una base y un ingrediente.");
    return;
  }

  const mensaje = `🍶 Base: ${base}\n🍓 Ingredientes: ${ingredientes.join(', ')}\n💰 Precio: ${precio}`;
  abrirModal(mensaje);
}

// Función para combos (por botón directo)
function pedirCombo(nombreCombo, ingredientes, precio) {
  const mensaje = `🥤 ${nombreCombo}\n🍓 Ingredientes: ${ingredientes}\n💰 Precio: $${precio}`;
  abrirModal(mensaje);
}