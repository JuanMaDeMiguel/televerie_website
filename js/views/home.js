let homeTimerInterval;

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

  // reiniciamos timers de máquinas ocupadas con valores aleatorios al cargar la vista
  const occupiedMachines = document.querySelectorAll('.machine-card.en-cours');
  occupiedMachines.forEach(machine => {
    const randomDurationMs = getRandomInitialDurationMs();
    machine.dataset.endTime = new Date(Date.now() + randomDurationMs).toISOString();
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

    // boton de reserva que simula click en la pestaña de reservas
    const reserveBtn = document.querySelector('.btn-primary-pill');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            const navItems = document.querySelectorAll('.bottom-nav__item');
            if(navItems.length > 2) navItems[2].click();
        });
    }
}