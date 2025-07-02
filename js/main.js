/* scripts.js - Unificación de app.js, ensalarmelo.js, script.js, e instalar.js con correcciones y eliminación de ítems */

let deferredPrompt;
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            console.log("✅ Service Worker registrado:", reg);
            reg.onupdatefound = () => {
                const newSW = reg.installing;
                newSW.onstatechange = () => {
                    if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                        mostrarBannerDeActualización();
                    }
                };
            };
        })
        .catch(err => console.error("❌ Error al registrar el Service Worker:", err));
}

function mostrarBannerDeActualización() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div style="position:fixed; bottom:0; left:0; right:0; background:#222; color:#fff; padding:12px; text-align:center; z-index:9999; font-family:sans-serif;">
            🔄 Hay una nueva versión disponible.
            <button onclick="location.reload()" style="margin-left:10px; padding:6px 12px; border:none; background:#d4af37; color:#000; font-weight:bold; cursor:pointer;">
                Actualizar
            </button>
        </div>
    `;
    document.body.appendChild(banner);
}

// Notificaciones
function pedirPermisoNotificaciones() {
    if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones.");
        return;
    }

    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            const ahora = Date.now();
            const ultimaVez = localStorage.getItem('noti-ultima');

            if (!ultimaVez || ahora - ultimaVez > 6 * 60 * 60 * 1000) {
                mostrarNotificacion("¡Nuevo sabor disponible!", {
                    body: "Probá el licuado de maracuyá con ron. Solo por hoy 🍹",
                    icon: "/icons/icon-192x192.png"
                });
                localStorage.setItem('noti-ultima', ahora);
            }
        }
    });
}

function mostrarNotificacion(titulo, opciones) {
    if ("Notification" in window) {
        new Notification(titulo, opciones);
    }
}

// Carrito
function agregarAlCarrito(item, precio) {
    cart.push({ item, precio });
    cartCount++;
    cartTotal += precio;
    document.getElementById('cart-count').textContent = cartCount;
    alert(`${item} agregado al carrito ($${precio})`);
}

function eliminarDelCarrito(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart.splice(index, 1)[0];
        cartCount--;
        cartTotal -= removedItem.precio;
        document.getElementById('cart-count').textContent = cartCount;
        mostrarModalCarrito();
        alert(`${removedItem.item} eliminado del carrito`);
        console.log('Ítem eliminado:', removedItem, 'Carrito actual:', cart); // Depuración
    } else {
        console.error('Índice inválido:', index); // Depuración
    }
}

function agregarEnsaladaPersonalizada() {
    const form = document.getElementById('custom-salad-form');
    const base = form.querySelector('[name="base"]').value;
    const protein = form.querySelector('[name="protein"]').value;
    const toppings = Array.from(form.querySelectorAll('[name="topping"]:checked')).map(t => t.value);
    const dressing = form.querySelector('[name="dressing"]').value;

    if (!base || !dressing) {
        alert('Por favor, selecciona una base y un aderezo.');
        return;
    }
    if (toppings.length > 3) {
        alert('Por favor, selecciona hasta 3 toppings.');
        return;
    }

    let precio = 1500;
    if (protein) precio += 500;
    precio += toppings.length * 200;

    const customSalad = `Ensalada Personalizada: Base: ${base}, Proteína: ${protein || 'Ninguna'}, Toppings: ${toppings.join(', ') || 'Ninguno'}, Aderezo: ${dressing}`;
    agregarAlCarrito(customSalad, precio);
}

function mostrarModalCarrito() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotalEl || !modal) {
        console.error('Elementos del modal no encontrados');
        return;
    }

    cartItems.innerHTML = cart.length ? 
        cart.map(({ item, precio }, index) => `
            <div class="cart-item">
                <span>${item} - $${precio}</span>
                <button class="delete-btn" onclick="eliminarDelCarrito(${index})">Eliminar</button>
            </div>
        `).join('') : 
        '<p>El carrito está vacío.</p>';
    
    cartTotalEl.textContent = `Total: $${cartTotal}`;
    modal.style.display = 'flex';
    console.log('Modal renderizado con', cart.length, 'ítems'); // Depuración
}

function vaciarCarrito() {
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    document.getElementById('cart-count').textContent = cartCount;
    mostrarModalCarrito();
    alert('Carrito vaciado');
}

function cerrarModalCarrito() {
    document.getElementById('cart-modal').style.display = 'none';
}

function enviarPedidoWhatsApp() {
    const nombre = document.getElementById('nombreCliente').value;
    const telefono = document.getElementById('telefonoCliente').value;
    if (!nombre || !telefono) {
        alert('Por favor, completa tu nombre y teléfono.');
        return;
    }
    const items = cart.map(({ item, precio }) => `${item} ($${precio})`).join(', ');
    const mensaje = `Hola, soy ${nombre}. Quiero pedir: ${items}. Total: $${cartTotal}. Teléfono: ${telefono}`;
    const encodedMensaje = encodeURIComponent(mensaje);
    window.open(`https://wa.me/+5491123456789?text=${encodedMensaje}`, '_blank');
    cart = [];
    cartCount = 0;
    cartTotal = 0;
    document.getElementById('cart-count').textContent = cartCount;
    cerrarModalCarrito();
}

// Contacto
function enviarMensajeContacto() {
    const nombre = document.getElementById('contact-name').value;
    const telefono = document.getElementById('contact-phone').value;
    const tipo = document.getElementById('contact-type').value;
    const mensaje = document.getElementById('contact-message').value;

    if (!nombre || !telefono || !tipo || !mensaje) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const mensajeWhatsApp = `Mensaje de ${nombre} (${tipo}): ${mensaje}. Teléfono: ${telefono}`;
    const encodedMensaje = encodeURIComponent(mensajeWhatsApp);
    window.open(`https://wa.me/+5491123456789?text=${encodedMensaje}`, '_blank');
    document.getElementById('contact-form').reset();
    alert('Mensaje enviado. ¡Gracias por contactarnos!');
}

// Chatbot
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
    const whatsappNumber = '5491157194796';
    const text = `Hola, soy ${name} y quiero consultar: ${message}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    document.getElementById('user-name').value = '';
    document.getElementById('user-message').value = '';
    toggleChatbot();
    return false;
}

// Instalación de PWA
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('installBtnTradicional').style.display = 'inline-block';

    document.getElementById('installBtnTradicional').addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('Ensal\'Armelo instalada');
            }
            deferredPrompt = null;
        });
    });
});

// Eventos adicionales
window.addEventListener('load', () => {
    pedirPermisoNotificaciones();
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.transition = 'opacity 0.7s ease';
            splash.style.opacity = '0';
            setTimeout(() => splash.style.display = 'none', 700);
        }
    }, 3500);
});

window.addEventListener('scroll', function() {
    const logo = document.querySelector('.logo');
    const navs = document.querySelectorAll('.left-nav, .right-nav');
    const scrollPosition = window.scrollY;
    const logoScale = Math.max(1 - scrollPosition / 1000, 0.7);
    const navScale = Math.max(1 - scrollPosition / 1500, 0.85);
    logo.style.transform = `scale(${logoScale})`;
    navs.forEach(nav => nav.style.transform = `scale(${navScale})`);
});

// Limitar toppings a 3 y soporte táctil
document.querySelectorAll('[name="topping"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checkedToppings = document.querySelectorAll('[name="topping"]:checked');
        if (checkedToppings.length > 3) {
            checkbox.checked = false;
            alert('Solo puedes seleccionar hasta 3 toppings.');
        }
    });
    checkbox.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        checkbox.click();
    });
});

// Soporte táctil para el carrito
document.querySelectorAll('.cart-icon').forEach(icon => {
    icon.addEventListener('touchstart', (e) => {
        e.preventDefault();
        mostrarModalCarrito();
    });
});

// Cerrar modal al tocar fuera
document.getElementById('cart-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('cart-modal')) {
        cerrarModalCarrito();
    }
});

// Depuración del input de nombre
document.getElementById('nombreCliente').addEventListener('input', (e) => {
    console.log('Nombre ingresado:', e.target.value);
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarMensajeContacto();
    });
}