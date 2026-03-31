function initProfileView() {
  // 1. Contenedores de las vistas
  const profileMain = document.getElementById('profile-main');
  const panelDonnees = document.getElementById('panel-donnees');

  // 2. Botones de navegación interna
  const btnDonnees = document.getElementById('btn-donnees');
  const btnBackDonnees = document.getElementById('btn-back-donnees');

  // Funciones auxiliares para cambiar de vista
  const showPanel = (panelToShow) => {
    profileMain.classList.add('profile-view--hidden');
    panelToShow.classList.remove('profile-view--hidden');
  };

  const hidePanel = (panelToHide) => {
    panelToHide.classList.add('profile-view--hidden');
    profileMain.classList.remove('profile-view--hidden');
  };

  // 3. Eventos: Données personnelles
  if (btnDonnees && panelDonnees) {
    btnDonnees.addEventListener('click', () => showPanel(panelDonnees));
  }
  if (btnBackDonnees && panelDonnees) {
    btnBackDonnees.addEventListener('click', () => hidePanel(panelDonnees));
  }

  // 4. Lógica de Desconexión
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      console.log("Cerrando sesión...");
      // Lógica para limpiar tokens y redirigir al login
    });
  }
}
