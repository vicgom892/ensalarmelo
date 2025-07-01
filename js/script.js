function toggleChatbot() {
  const body = document.getElementById('chatbot-body');
  body.style.display = (body.style.display === 'none') ? 'block' : 'none';
}

function sendPredefinedMsg(text) {
  addUserMessage(text);
  botReply(getBotResponse(text));
}

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.classList.add('user-message');
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function botReply(text) {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.classList.add('bot-message');
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function getBotResponse(userText) {
  const responses = {
    '¿Cuáles son los combos disponibles?': 'Tenemos combos para jardines, cumpleaños y eventos, desde licuados clásicos hasta la línea +18. ¿Querés que te envíe el catálogo por WhatsApp?',
    '¿Hacen envíos sin cargo?': 'Sí, hacemos delivery gratuito en zonas cercanas con moto, bici o auto.',
    '¿Cuál es el horario de atención?': 'Atendemos de lunes a viernes de 08:00 a 20:00 y sábados de 08:00 a 14:00.',
    '¿Tienen licuados con alcohol?': 'Sí, contamos con una línea exclusiva +18 con vodka, ron y gin. ¡Perfectos para tus eventos especiales!'
  };
  return responses[userText] || 'Disculpá, no entendí tu consulta. Por favor, escribila abajo y te responderemos por WhatsApp.';
}

function sendUserMessage(event) {
  event.preventDefault();
  const name = document.getElementById('user-name').value.trim();
  const message = document.getElementById('user-message').value.trim();
  if (!name || !message) {
    alert('Por favor completá tu nombre y consulta.');
    return false;
  }
  const whatsappNumber = '5491157194796'; // tu número con código de país sin signos (+)
  const text = `Hola, soy ${name} y quiero consultar: ${message}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
  // Opcional: limpiar formulario y mensajes
  document.getElementById('user-name').value = '';
  document.getElementById('user-message').value = '';
  toggleChatbot();
  return false;
}