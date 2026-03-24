// Diccionario para actuar como caché en memoria
const viewCache = {};

// Mapeo de los índices de los botones a sus respectivos archivos HTML
const routes = {
  0: 'src/accueil.html',
  1: 'src/classement.html',
  2: 'src/reservations.html',
  3: 'src/profil.html'
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar el menú de navegación primero
  fetch('src/bottom-nav.html')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar la barra de navegación');
      return response.text();
    })
    .then(html => {
      document.getElementById('bottom-nav-placeholder').innerHTML = html;
      initRouter();
    })
    .catch(error => console.error('Fallo en la carga del componente:', error));
});

function initRouter() {
  const navItems = document.querySelectorAll('.bottom-nav__item');
  const activeClass = 'bottom-nav__item--active';

  // Asignar eventos a cada botón
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Evitar recargar si ya estamos en esta vista
      if (item.classList.contains(activeClass)) return;

      // Actualizar UI del menú
      navItems.forEach(nav => nav.classList.remove(activeClass));
      item.classList.add(activeClass);
      
      // Cargar la vista correspondiente
      loadView(routes[index]);
    });
  });

  // Cargar la vista inicial por defecto (Accueil)
  loadView(routes[0]);
}

function loadView(path) {
  const viewContainer = document.getElementById('app-view-placeholder');
  
  // Revisar si la vista ya está en la caché
  if (viewCache[path]) {
    viewContainer.innerHTML = viewCache[path];
    return;
  }

  // Si no está en caché, hacemos el fetch
  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error(`Error al cargar la vista: ${path}`);
      return response.text();
    })
    .then(html => {
      // Guardar en caché y mostrar
      viewCache[path] = html;
      viewContainer.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      viewContainer.innerHTML = '<h2>Erreur de chargement</h2>';
    });
}