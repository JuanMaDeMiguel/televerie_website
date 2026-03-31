async function initProfileView() {
  const profileMain = document.getElementById('profile-main');

  // Navegación de paneles
  const setupNavigation = (btnId, panelId) => {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (btn && panel) {
      btn.addEventListener('click', () => {
        profileMain.classList.add('profile-view--hidden');
        panel.classList.remove('profile-view--hidden');
      });
    }
  };

  setupNavigation('btn-donnees', 'panel-donnees');
  setupNavigation('btn-paiement', 'panel-paiement');
  setupNavigation('btn-historique', 'panel-historique');

  // Botones de "Atrás"
  document.querySelectorAll('.profile-back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const panelId = e.currentTarget.getAttribute('data-back');
      document.getElementById(panelId).classList.add('profile-view--hidden');
      profileMain.classList.remove('profile-view--hidden');
    });
  });

  try {
    const [profileRes, reservationsRes] = await Promise.all([
      fetch('ressources/data/profile.json'),
      fetch('ressources/data/reservations.json')
    ]);

    const profileData = await profileRes.json();
    const reservationsData = await reservationsRes.json();
    const user = profileData.user;

    // Renderizar Vista Principal
    document.getElementById('user-avatar').src = user.avatar;
    document.getElementById('user-name').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-phone').textContent = user.phone;

    // Renderizar Panel: Données personnelles (Información Expandida)
    const donneesHtml = `
            <div class="profile-user__field"><b>Nom:</b> ${user.lastName}</div>
            <div class="profile-user__field"><b>Prénom:</b> ${user.firstName}</div>
            <div class="profile-user__field"><b>E-mail:</b> ${user.email}</div>
            <div class="profile-user__field"><b>Téléphone:</b> ${user.phone}</div>
            <div class="profile-user__field"><b>Date de naissance:</b> ${user.birthDate}</div>
            <div class="profile-user__field"><b>Genre:</b> ${user.gender}</div>
            <div class="profile-user__field"><b>Adresse:</b> ${user.address}</div>
            <div class="profile-user__field"><b>Membre depuis:</b> ${user.joinDate}</div>
        `;
    document.getElementById('data-donnees-container').innerHTML = donneesHtml;

    // Renderizar Panel: Moyens de paiement (Tarjetas Enmascaradas)
    const paiementHtml = user.paymentMethods.map(card => {
      const masked = card.number.substring(0, 4) + ' •••• •••• ' + card.number.substring(card.number.length - 4);
      return `
                <div class="payment-card">
                    <div class="payment-card__header">
                        <span class="payment-card__brand">${card.brand}</span>
                        ${card.isDefault ? '<span class="payment-card__badge">Par défaut</span>' : ''}
                    </div>
                    <div class="payment-card__number">${masked}</div>
                    <div class="payment-card__footer">Expire: ${card.expiry}</div>
                </div>
            `;
    }).join('');
    document.getElementById('data-paiement-container').innerHTML = paiementHtml;

    // Renderizar Panel: Historique (24 Entradas)
    const historiqueHtml = reservationsData.history.map(item => {
      const dateObj = new Date(item.date);
      const formattedDate = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const statusColor = item.status === 'done' ? 'var(--color-success)' : 'var(--color-danger)';
      const statusText = item.status === 'done' ? 'Terminé' : 'Annulé';

      return `
                <div class="history-item">
                    <div class="history-item__left">
                        <div class="history-item__machine">${item.machine} <span class="history-item__duration">• ${item.duration} min</span></div>
                        <div class="history-item__date">${formattedDate}</div>
                    </div>
                    <div class="history-item__right">
                        <div class="history-item__price">${item.price.toFixed(2)} €</div>
                        <div class="history-item__status" style="color: ${statusColor};">${statusText}</div>
                    </div>
                </div>
            `;
    }).join('');
    document.getElementById('data-historique-container').innerHTML = historiqueHtml;

  } catch (error) {
    console.error("Erreur lors du chargement des données du profil:", error);
  }
}
