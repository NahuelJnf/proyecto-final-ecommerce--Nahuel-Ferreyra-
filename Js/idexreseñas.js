const API_KEY = 'c3982858ccee1175a777510ba2e85aff';
const weatherDiv = document.getElementById('weather');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const temp = Math.round(data.main.temp);
                    const desc = data.weather[0].description;
                    const icon = data.weather[0].icon;
                    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

                    weatherDiv.innerHTML = `
<img src="${iconUrl}" alt="${desc}">
<span>${temp}°C - ${desc.charAt(0).toUpperCase() + desc.slice(1)}</span>
`;
                    weatherDiv.classList.add('weather');


                    // Cambiar color de fondo según el clima
                    const mainWeather = data.weather[0].main.toLowerCase();
                    if (mainWeather.includes('cloud')) {
                        weatherDiv.style.backgroundColor = '#6c757d';
                    } else if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
                        weatherDiv.style.backgroundColor = '#007bff';
                    } else if (mainWeather.includes('snow')) {
                        weatherDiv.style.backgroundColor = '#17a2b8';
                    } else if (mainWeather.includes('clear')) {
                        weatherDiv.style.backgroundColor = '#1f9ac7ff';
                    } else if (mainWeather.includes('storm') || mainWeather.includes('thunder')) {
                        weatherDiv.style.backgroundColor = '#343a40';
                    } else {
                        weatherDiv.style.backgroundColor = '#28a745';
                    }
                })
                .catch(err => {
                    weatherDiv.textContent = 'No se pudo obtener el clima';
                    console.error(err);
                });
        },
        (err) => {
            weatherDiv.textContent = 'Permiso de ubicación denegado';
            console.error(err);
        }
    );
} else {
    weatherDiv.textContent = 'Geolocalización no soportada';
}

// ---------------------
// Easter Egg "JNF"
// ---------------------
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

// Crear contenedor del mensaje sorpresa
let surpriseDiv = document.createElement('div');
surpriseDiv.style.position = 'fixed';
surpriseDiv.style.top = '50%';
surpriseDiv.style.left = '50%';
surpriseDiv.style.transform = 'translate(-50%, -50%) scale(0)';
surpriseDiv.style.padding = '20px 35px';
surpriseDiv.style.color = 'white';
surpriseDiv.style.backgroundColor = 'orange';
surpriseDiv.style.fontSize = '24px';
surpriseDiv.style.borderRadius = '15px';
surpriseDiv.style.boxShadow = '2px 2px 15px rgba(0,0,0,0.4)';
surpriseDiv.style.display = 'none';
surpriseDiv.style.zIndex = '1000';
surpriseDiv.style.textAlign = 'center';
surpriseDiv.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
surpriseDiv.innerHTML = `
    🎉 ¡Bienvenido a JNF Company! 🎉<br>
    <button id="closeBtn" style="margin-top:10px; padding:5px 10px; font-size:16px; border:none; border-radius:5px; cursor:pointer;">
        🎉Ganaste un 20% off🎉
    </button>
`;
document.body.appendChild(surpriseDiv);

// Generar confeti
function createConfetti() {
    const confetti = document.createElement('div');
    const emojis = ['🎊', '✨', '🎈', '🌟', '💻', '🖱️', '⌨️'];
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    confetti.style.position = 'fixed';
    confetti.style.fontSize = Math.random() * 30 + 20 + 'px';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-50px';
    confetti.style.zIndex = '999';
    confetti.style.opacity = Math.random();
    document.body.appendChild(confetti);

    const fall = setInterval(() => {
        confetti.style.top = parseFloat(confetti.style.top) + Math.random() * 5 + 'px';
        confetti.style.left = parseFloat(confetti.style.left) + Math.random() * 2 - 1 + 'px';
        if (parseFloat(confetti.style.top) > window.innerHeight) {
            confetti.remove();
            clearInterval(fall);
        }
    }, 20);
}

// Mostrar Easter Egg
function showEasterEgg() {
    surpriseDiv.style.display = 'block';
    setTimeout(() => {
        surpriseDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);

    document.body.style.backgroundColor = '#fff3e0';

    for (let i = 0; i < 40; i++) {
        createConfetti();
    }
}

// Evento botón de búsqueda
searchButton.addEventListener('click', () => {
    const value = searchInput.value.trim().toLowerCase();
    if (value === 'jnf') {
        showEasterEgg();
    }
});

// Cerrar mensaje y volver al inicio
document.body.addEventListener('click', e => {
    if (e.target.id === 'closeBtn') {
        surpriseDiv.style.transform = 'translate(-50%, -50%) scale(0)';
        document.body.style.backgroundColor = '';
        setTimeout(() => window.location.href = 'index.html', 500);
    }
});