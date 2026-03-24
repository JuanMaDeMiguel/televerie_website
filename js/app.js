document.addEventListener("DOMContentLoaded", () => {
  fetch('src/bottom-nav.html')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar la barra de navegación');
      return response.text();
    })
    .then(html => {
      document.getElementById('bottom-nav-placeholder').innerHTML = html;
    })
    .catch(error => console.error(error));
});
