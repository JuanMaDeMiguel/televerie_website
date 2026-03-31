const viewCache = {};

const routes = [
  "src/views/home.html",
  "src/views/ranking.html",
  "src/views/reservations.html",
  "src/views/profile.html"
];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("src/bottom-nav.html");

    if (!response.ok) {
      throw new Error("Error loading bottom navigation");
    }

    const html = await response.text();
    document.getElementById("bottom-nav-placeholder").innerHTML = html;

    initRouter();
    await loadView(routes[0]);
    setActiveNav(0);
  } catch (error) {
    console.error(error);
    document.getElementById("app-view-placeholder").innerHTML = "<h2>Erreur de chargement</h2>";
  }
});

function initRouter() {
  const navItems = document.querySelectorAll(".bottom-nav__item");

  navItems.forEach((item, index) => {
    item.addEventListener("click", async () => {
      if (item.classList.contains("bottom-nav__item--active")) {
        return;
      }

      setActiveNav(index);
      await loadView(routes[index]);
    });
  });
}

function setActiveNav(activeIndex) {
  const navItems = document.querySelectorAll(".bottom-nav__item");

  navItems.forEach((item, index) => {
    item.classList.toggle("bottom-nav__item--active", index === activeIndex);
  });
}

async function loadView(path) {
  const viewContainer = document.getElementById("app-view-placeholder");

  cleanupBeforeViewChange();

  try {
    if (!viewCache[path]) {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`Error loading view: ${path}`);
      }

      viewCache[path] = await response.text();
    }

    viewContainer.innerHTML = viewCache[path];
    triggerViewInit(path);
  } catch (error) {
    console.error(error);
    viewContainer.innerHTML = "<h2>Erreur de chargement</h2>";
  }
}

function cleanupBeforeViewChange() {
  document.body.classList.remove("reservations-modal-open");

  if (window.reservationsCountdownInterval) {
    clearInterval(window.reservationsCountdownInterval);
    window.reservationsCountdownInterval = null;
  }

  if (window.reservationsKeydownHandler) {
    document.removeEventListener("keydown", window.reservationsKeydownHandler);
    window.reservationsKeydownHandler = null;
  }
}

function triggerViewInit(path) {
  if (path === "src/views/home.html" && typeof initHomeView === "function") {
    initHomeView();
  }

  if (path === "src/views/ranking.html" && typeof initRankingView === "function") {
    initRankingView();
  }

  if (path === "src/views/profile.html" && typeof initProfileView === "function") {
    initProfileView();
  }

  if (path === "src/views/reservations.html" && typeof initReservationsView === "function") {
    initReservationsView();
  }
}