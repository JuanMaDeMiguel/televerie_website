// js/views/profile.js
function initProfileView() {
  console.log("Vista de perfil inicializada");

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      console.log("Ejecutando lógica de desconexión...");
      // Aquí irá tu lógica de cierre de sesión
    });
  }
}
