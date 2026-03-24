// Format milliseconds into mm:ss
function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Update all timers for occupied machines
function updateTimers() {
  const machines = document.querySelectorAll('.machine-card.occupied');

  machines.forEach(machine => {
    const timerElement = machine.querySelector('.timer');

    // Read end time from data attribute
    const endTime = new Date(machine.dataset.endTime).getTime();
    const now = Date.now();
    const remaining = endTime - now;

    if (remaining > 0) {
      // Update remaining time display
      timerElement.textContent = formatTime(remaining);
    } else {
      // When time is over, update UI state
      timerElement.textContent = "Finished";

      machine.classList.remove('occupied');
      machine.classList.add('available');

      const status = machine.querySelector('.status');
      if (status) status.textContent = "Libre";
    }
  });
}

// Initialize timers when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  updateTimers();
  setInterval(updateTimers, 1000); // refresh every second
});