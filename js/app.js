if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js') // asegúrate de que sw.js esté en la raíz
    .then(reg => {
      console.log("✅ Service Worker registrado:", reg);

      // Detecta si hay una actualización del SW
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

// Función para mostrar el banner cuando hay nueva versión
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

// Solicita permiso para notificaciones y controla la frecuencia
function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) {
    alert("Este navegador no soporta notificaciones.");
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      const ahora = Date.now();
      const ultimaVez = localStorage.getItem('noti-ultima');

      // Mostrar solo si pasaron más de 6 horas desde la última notificación
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

// Mostrar una notificación nativa
function mostrarNotificacion(titulo, opciones) {
  if ("Notification" in window) {
    new Notification(titulo, opciones);
  }
}

// Ejecutar al cargar la página
window.addEventListener("load", () => {
  pedirPermisoNotificaciones();
});