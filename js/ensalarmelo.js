// js/ensalarmelo.js
let cart = [];
let cartCount = 0;
let cartTotal = 0;

function agregarAlCarrito(item, precio) {
    cart.push({ item, precio });
    cartCount++;
    cartTotal += precio;
    document.getElementById('cart-count').textContent = cartCount;
    alert(`${item} agregado al carrito ($${precio})`);
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

    let precio = 1500; // Precio base
    if (protein) precio += 500; // Precio proteína
    precio += toppings.length * 200; // Precio toppings

    const customSalad = `Ensalada Personalizada: Base: ${base}, Proteína: ${protein || 'Ninguna'}, Toppings: ${toppings.join(', ') || 'Ninguno'}, Aderezo: ${dressing}`;
    agregarAlCarrito(customSalad, precio);
}

function mostrarModalCarrito() {
    const modal = document.getElementById('cart-modal');
    const cartItems = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    cartItems.innerHTML = cart.length ? 
        cart.map(({ item, precio }) => `<p>${item} - $${precio}</p>`).join('') : 
        '<p>El carrito está vacío.</p>';
    cartTotalEl.textContent = `Total: $${cartTotal}`;
    modal.style.display = 'flex';
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

// Limitar toppings a 3
document.querySelectorAll('[name="topping"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checkedToppings = document.querySelectorAll('[name="topping"]:checked');
        if (checkedToppings.length > 3) {
            checkbox.checked = false;
            alert('Solo puedes seleccionar hasta 3 toppings.');
        }
    });
});

// Manejar envío del formulario de contacto
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        enviarMensajeContacto();
    });
}

window.addEventListener('scroll', function() {
    const logo = document.querySelector('.logo');
    const navs = document.querySelectorAll('.left-nav, .right-nav');
    const scrollPosition = window.scrollY;
    const logoScale = Math.max(1 - scrollPosition / 1000, 0.7); // Logo scales down to 70%
    const navScale = Math.max(1 - scrollPosition / 1500, 0.85); // Nav scales down to 85%
    logo.style.transform = `scale(${logoScale})`;
    navs.forEach(nav => nav.style.transform = `scale(${navScale})`);
});
