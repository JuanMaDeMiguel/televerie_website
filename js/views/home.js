let homeTimerInterval;
const homeMachineEndTimes = new Map();

function getMachineKey(machine, index) {
  const machineName = machine.querySelector('.machine-name')?.textContent?.trim();
  return machineName || `machine-${index}`;
}

function getRandomInitialDurationMs() {
  const randomMinutes = Math.floor(Math.random() * 120) + 1; // 1-120 minutos
  const randomSeconds = Math.floor(Math.random() * 60); // 0-59 segundos

  return (randomMinutes * 60 + randomSeconds) * 1000;
}

// Format milliseconds into mm:ss
function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// update all timers for occupied machines
function updateTimers() {
  // buscamos solo las máquinas que tengan la clase 'en-cours'
  const machines = document.querySelectorAll('.machine-card.en-cours');

  machines.forEach(machine => {
    // buscamos el <text> del SVG y los elementos de estado
    const timerElement = machine.querySelector('.timer-text');
    const statusText = machine.querySelector('.status-text');
    const statusDot = machine.querySelector('.status-dot');
    const progressRing = machine.querySelector('.progress-ring');

    // leemos el tiempo final desde el atributo data-end-time
    const endTimeAttr = machine.dataset.endTime;
    if (!endTimeAttr) return; 
    
    const endTime = new Date(endTimeAttr).getTime();
    const now = Date.now();
    const remaining = endTime - now;

    if (remaining > 0) {
      // actualizamos el tiempo restante en el SVG
      if (timerElement) timerElement.textContent = formatTime(remaining);
    } else {
      // actualizo la ui a libre
      if (timerElement) timerElement.textContent = "00:00";

      machine.classList.remove('en-cours');

      // cambio el texto 
      if (statusText) statusText.textContent = "Libre";
      if (statusDot) {
        statusDot.classList.remove('dot-orange');
        statusDot.classList.add('dot-green');
      }
      
      // blanqueamos el anillo de progreso y lo ponemos verde para indicar que ya terminó
      if (progressRing) {
          progressRing.style.strokeDashoffset = '75.39'; 
          progressRing.style.stroke = 'var(--color-success)'; 
      }
    }
  });
}

// esta función es llamada desde js/app.js cuando se inyecta home.html
function initHomeView() {
    console.log("Home view initialized!");

  // mantenemos los timers al navegar entre pestañas y solo creamos uno nuevo
  // cuando la máquina no tenga un end-time guardado en memoria para esta sesión
  const occupiedMachines = document.querySelectorAll('.machine-card.en-cours');
  occupiedMachines.forEach((machine, index) => {
    const machineKey = getMachineKey(machine, index);
    const savedEndTime = homeMachineEndTimes.get(machineKey);

    if (savedEndTime) {
      machine.dataset.endTime = new Date(savedEndTime).toISOString();
      return;
    }

    const randomDurationMs = getRandomInitialDurationMs();
    const newEndTime = Date.now() + randomDurationMs;
    homeMachineEndTimes.set(machineKey, newEndTime);
    machine.dataset.endTime = new Date(newEndTime).toISOString();
  });

    // animación de los anillos de progreso al cargar la vista
    const progressRings = document.querySelectorAll('.progress-ring');
    progressRings.forEach(ring => {
        const targetOffset = ring.getAttribute('stroke-dashoffset') || '30';
        ring.style.strokeDashoffset = '75.39';
        ring.style.transition = 'stroke-dashoffset 1s ease-out';
        setTimeout(() => {
            ring.style.strokeDashoffset = targetOffset;
        }, 100);
    });

    // logica de timers
    
    // limpio intervalo anterior para evitar duplicados si volvemos a home desde otra pestaña 
    if (homeTimerInterval) clearInterval(homeTimerInterval);
    
    // ejecuto una vez al inicio para mostrar tiempos correctos al cargar la vista, y luego cada segundo para actualizar
    updateTimers();
    homeTimerInterval = setInterval(updateTimers, 1000);

    // reserve button
    const reserveBtn = document.querySelector('.btn-primary-pill');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            // global flag a reservations.js para saber que venimos de home y mostrar el modal de reserva automáticamente
            window.openBookingModalFromHome = true;

            // simulacion de click en la seccion de reservas
            const navItems = document.querySelectorAll('.bottom-nav__item');
            if(navItems.length > 2) navItems[2].click();
        });
    }

    // pop up del mapa
    const mapBtn = document.querySelector('.location-map');
    const mapModal = document.getElementById('map-modal');
    const mapCloseBtn = document.getElementById('map-modal-close-btn');
    const mapCloseBg = document.getElementById('map-modal-close-bg');

    if (mapBtn && mapModal) {
        // abrir modal
        mapBtn.addEventListener('click', (e) => {
            e.preventDefault(); // evita que el enlace navegue a otra página
            mapModal.hidden = false;
        });

        // función para cerrar el modal
        const closeMap = () => { mapModal.hidden = true; };
        
        // cerrar modal al hacer click en el botón de cerrar o en el fondo
        if (mapCloseBtn) mapCloseBtn.addEventListener('click', closeMap);
        if (mapCloseBg) mapCloseBg.addEventListener('click', closeMap);
    }

    // pop up del perfil
    const avatarImgBtn = document.querySelector('.header-user .avatar');
    const profileModal = document.getElementById('profile-modal');
    const profileModalBg = document.getElementById('profile-modal-bg');
    const goToProfileBtn = document.getElementById('go-to-profile-btn');

    if (avatarImgBtn && profileModal) {
        // cursor pointer para indicar que es clickeable
        avatarImgBtn.style.cursor = 'pointer';

        // abro el modal al hacer click en el avatar
        avatarImgBtn.addEventListener('click', () => {
            profileModal.hidden = false;
        });

        // cierro el modal al hacer click en el fondo
        if (profileModalBg) {
            profileModalBg.addEventListener('click', () => {
                profileModal.hidden = true;
            });
        }

        // boton ver mi perfil dentro del modal, que cierra el modal y simula click en la sección de perfil
        if (goToProfileBtn) {
            goToProfileBtn.addEventListener('click', () => {
                // cierro el modal
                profileModal.hidden = true;
                
                // simulo click en la sección de perfil
                const navItems = document.querySelectorAll('.bottom-nav__item');
                if (navItems.length > 3) {
                    navItems[3].click();
                }
            });
        }
    }
}