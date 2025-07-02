 function createFloatingFruit() {
            const fruit = document.createElement('img');
            fruit.src = './img/logo-sin-fondo-ensalarmelo.png'; // Imagen de una fresa (puedes cambiar la URL)
            fruit.className = 'floating-fruit';

            // Posición inicial aleatoria
            const startX = Math.random() * (window.innerWidth - 80);
            const startY = Math.random() * (window.innerHeight - 80);
            fruit.style.left = `${startX}px`;
            fruit.style.top = `${startY}px`;

            document.body.appendChild(fruit);

            // Eliminar la imagen después de que termine la animación
            setTimeout(() => {
                fruit.remove();
            }, 5000); // 5 segundos
        }

        // Crear una fruta al cargar la página
        window.onload = () => {
            createFloatingFruit();
            // Opcional: Crear más frutas cada cierto tiempo
            setInterval(createFloatingFruit, 7000); // Cada 7 segundos
        };
