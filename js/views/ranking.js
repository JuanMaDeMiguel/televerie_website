// Esta función debe ser llamada por tu app.js una vez que el HTML haya sido inyectado
function initRanking() {
  
  // 1. Datos encapsulados localmente (Evita el SyntaxError de redeclaración)
  const leaderboardData = [
    { rank: 1, name: 'Sophie Martin', residence: 'Résidence Océan', score: 12450, avatar: './img/profile_pics/01.png' },
    { rank: 2, name: 'Thomas Dubois', residence: 'Résidence Plage', score: 11320, avatar: './img/profile_pics/02.png' },
    { rank: 3, name: 'Marie Chen', residence: 'Résidence Campus', score: 10890, avatar: './img/profile_pics/03.png' },
    { rank: 4, name: 'Lucas Bernard', residence: 'Résidence Sud', score: 9560, avatar: './img/profile_pics/04.png' },
    { rank: 5, name: 'Emma Garcia', residence: 'Résidence Nord', score: 9120, avatar: './img/profile_pics/05.png' },
    { rank: 6, name: 'Pierre Leroy', residence: 'Résidence Est', score: 8760, avatar: './img/profile_pics/06.png' },
    { rank: 7, name: 'Amina Rahmani', residence: 'Résidence Kergoat', score: 8450, avatar: './img/profile_pics/07.png', isCurrentUser: true }, // <-- Ruta de imagen corregida
    { rank: 8, name: 'Julie Rousseau', residence: 'Résidence Ouest', score: 8120, avatar: './img/profile_pics/08.png' },
    { rank: 9, name: 'Alexandre Moreau', residence: 'Résidence Centre', score: 7890, avatar: './img/profile_pics/09.png' },
    { rank: 10, name: 'Camille Laurent', residence: 'Résidence Horizon', score: 7560, avatar: './img/profile_pics/10.png' },
  ];

  const lucideIcons = {
    trophy: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    medal: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12l5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><polyline points="12 18 10.9 15.2 8 15 10 13 9.4 10 12 11.2 14.6 10 14 13 16 15 13.1 15.2 12 18"/></svg>`,
    award: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`
  };

  // 2. Lógica de renderizado
  const currentUserScore = 8450;
  const maxScore = 10000; 
  const percentage = (currentUserScore / maxScore) * 100;
  
  const progressCircle = document.getElementById('ranking-progress-circle');
  const scoreValue = document.getElementById('ranking-user-score');
  
  if (progressCircle && scoreValue) {
    setTimeout(() => {
      progressCircle.style.strokeDasharray = `${percentage * 5.34} 534`;
    }, 50);
    animateScoreValue(scoreValue, 0, currentUserScore, 1000);
  }

  const listContainer = document.getElementById('ranking-list');
  if (listContainer) {
    listContainer.innerHTML = ''; 
    
    leaderboardData.forEach(user => {
      let badgeContent = `#${user.rank}`;
      let badgeModifier = '';
      
      if (user.rank === 1) { badgeContent = lucideIcons.trophy; badgeModifier = 'ranking__item-badge--1'; }
      else if (user.rank === 2) { badgeContent = lucideIcons.medal; badgeModifier = 'ranking__item-badge--2'; }
      else if (user.rank === 3) { badgeContent = lucideIcons.award; badgeModifier = 'ranking__item-badge--3'; }
      else if (user.isCurrentUser) { badgeModifier = 'ranking__item-badge--current'; }

      const currentModifier = user.isCurrentUser ? 'ranking__item--current' : '';
      
      const itemHTML = `
        <div class="ranking__item ${currentModifier}">
          <div class="ranking__item-badge ${badgeModifier}">
            ${badgeContent}
          </div>
          <div class="ranking__item-avatar-wrapper">
            <img src="${user.avatar}" alt="${user.name}" class="ranking__item-avatar" onerror="this.src='./img/default-avatar.png'">
          </div>
          <div class="ranking__item-info">
            <div class="ranking__item-name">${user.name}</div>
            <div class="ranking__item-residence">${user.residence}</div>
          </div>
          <div class="ranking__item-score">
            ${user.score.toLocaleString('fr-FR')}
          </div>
        </div>
      `;
      listContainer.insertAdjacentHTML('beforeend', itemHTML);
    });
  }
}

// Función auxiliar para efecto de conteo
function animateScoreValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString('fr-FR');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}