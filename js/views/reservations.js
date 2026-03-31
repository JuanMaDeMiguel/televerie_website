(function () {
  const state = {
    db: null,
    previewMonthDate: null,
    bookingMonthDate: null,
    selectedDateKey: null,
    selectedTime: null,
    bookingSlots: [],
    activeModal: null
  };

  const refs = {};

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function dateKeyToDate(dateKey) {
    return new Date(`${dateKey}T00:00:00`);
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
  }

  function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function compareDateKeys(a, b) {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  }

  function capitalize(text) {
    if (!text) {
      return "";
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatMonthYear(date) {
    return capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric"
      }).format(date)
    );
  }

  function formatTime(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatSummaryDate(dateKey, time, machine) {
    return `${capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(dateKeyToDate(dateKey))
    )}, ${time} - ${machine}`;
  }

  function formatHistoryDate(dateString) {
    const date = new Date(dateString);

    return `${capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date)
    )} à ${formatTime(date)}`;
  }

  function cacheElements() {
    refs.view = document.getElementById("reservations-view");
    refs.summaryTrigger = document.getElementById("reservation-summary-trigger");
    refs.summaryLabel = document.getElementById("reservations-summary-label");
    refs.countdown = document.getElementById("reservations-countdown");
    refs.countdownValue = document.getElementById("reservations-countdown-value");
    refs.countdownUnit = document.getElementById("reservations-countdown-unit");
    refs.nextInfo = document.getElementById("reservations-next-info");

    refs.calendarTrigger = document.getElementById("reservation-calendar-trigger");
    refs.calendarMonth = document.getElementById("reservations-calendar-month");
    refs.calendarGrid = document.getElementById("reservations-calendar-grid");

    refs.demandRange = document.getElementById("reservations-demand-range");
    refs.demandChart = document.getElementById("reservations-demand-chart");
    refs.historyList = document.getElementById("reservations-history-list");

    refs.modalLayer = document.getElementById("reservations-modal-layer");
    refs.detailModal = document.getElementById("reservation-detail-modal");
    refs.detailContent = document.getElementById("reservations-detail-content");
    refs.detailActions = document.getElementById("reservations-detail-actions");

    refs.bookingModal = document.getElementById("reservation-booking-modal");
    refs.bookingMonthLabel = document.getElementById("booking-month-label");
    refs.bookingCalendarGrid = document.getElementById("booking-calendar-grid");
    refs.bookingTimeSlots = document.getElementById("booking-time-slots");
    refs.bookingConfirmButton = document.getElementById("booking-confirm-button");
    refs.bookingPrevMonth = document.getElementById("booking-prev-month");
    refs.bookingNextMonth = document.getElementById("booking-next-month");
    refs.bookingSwipeSurface = document.getElementById("reservation-booking-swipe-surface");
  }

  async function refreshData() {
    state.db = await window.ReservationsService.getReservationsData();
  }

  function getDemandMap() {
    const map = new Map();

    state.db.demand.forEach((item) => {
      map.set(item.date, item.value);
    });

    return map;
  }

  function getCalendarStatus(dateKey) {
    const demandValue = getDemandMap().get(dateKey);

    if (compareDateKeys(dateKey, window.ReservationsService.todayKey()) < 0) {
      return "past";
    }

    if (typeof demandValue !== "number") {
      return "available";
    }

    if (demandValue >= 10) {
      return "unavailable";
    }

    if (demandValue > 0 && demandValue <= 4) {
      return "recommended";
    }

    return "available";
  }

  function getDemandSeries() {
    const demandMap = getDemandMap();
    const today = new Date();
    const series = [];

    for (let i = 0; i < 7; i += 1) {
      const date = addDays(today, i);
      const dateKey = toDateKey(date);

      series.push({
        dateKey,
        dayNumber: date.getDate(),
        value: demandMap.get(dateKey) || 0
      });
    }

    return series;
  }

  function closeModal() {
    state.activeModal = null;

    if (refs.modalLayer) {
      refs.modalLayer.hidden = true;
    }

    if (refs.detailModal) {
      refs.detailModal.hidden = true;
    }

    if (refs.bookingModal) {
      refs.bookingModal.hidden = true;
    }

    document.body.classList.remove("reservations-modal-open");
  }

  function openModal(name) {
    state.activeModal = name;
    refs.modalLayer.hidden = false;
    refs.detailModal.hidden = name !== "detail";
    refs.bookingModal.hidden = name !== "booking";
    document.body.classList.add("reservations-modal-open");
  }

  function renderSummaryCard() {
    const reservation = state.db.nextReservation;

    if (!reservation) {
      refs.summaryLabel.textContent = "Aucune réservation active";
      refs.countdown.classList.add("is-empty");
      refs.countdownValue.textContent = "Aucune réservation";
      refs.countdownUnit.hidden = true;
      refs.nextInfo.textContent = "Touchez le calendrier pour réserver un créneau.";
      return;
    }

    refs.summaryLabel.textContent = "Ton prochain tour dans";
    refs.countdown.classList.remove("is-empty");
    refs.countdownUnit.hidden = false;
    refs.countdownUnit.textContent = "heures";

    const dateTime = new Date(`${reservation.date}T${reservation.time}:00`);
    const diff = Math.max(dateTime.getTime() - Date.now(), 0);
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    refs.countdownValue.textContent = `${pad(hours)}:${pad(minutes)}`;
    refs.nextInfo.textContent = formatSummaryDate(reservation.date, reservation.time, reservation.machine);
  }

  function renderPreviewCalendar() {
    const firstDay = new Date(state.previewMonthDate.getFullYear(), state.previewMonthDate.getMonth(), 1).getDay();
    const lastDay = new Date(state.previewMonthDate.getFullYear(), state.previewMonthDate.getMonth() + 1, 0).getDate();

    refs.calendarMonth.textContent = formatMonthYear(state.previewMonthDate);

    const html = [];

    for (let i = 0; i < firstDay; i += 1) {
      html.push('<div class="reservations-calendar__empty" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= lastDay; day += 1) {
      const date = new Date(state.previewMonthDate.getFullYear(), state.previewMonthDate.getMonth(), day);
      const dateKey = toDateKey(date);
      const status = getCalendarStatus(dateKey);
      const classes = ["reservations-calendar__day"];

      if (status === "recommended") {
        classes.push("is-recommended");
      }

      if (status === "unavailable") {
        classes.push("is-unavailable");
      }

      if (status === "past") {
        classes.push("is-past");
      }

      if (state.selectedDateKey === dateKey && status === "available") {
        classes.push("is-selected");
      }

      html.push(`
        <button
          type="button"
          class="${classes.join(" ")}"
          data-preview-date="${dateKey}"
          ${status === "past" ? "disabled" : ""}
        >
          ${day}
        </button>
      `);
    }

    refs.calendarGrid.innerHTML = html.join("");
  }

  function renderDemandChart() {
    const series = getDemandSeries();
    const maxValue = Math.max(...series.map((item) => item.value), 1);

    refs.demandRange.textContent = `${series[0].dayNumber}–${series[series.length - 1].dayNumber} ${capitalize(
      new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(dateKeyToDate(series[0].dateKey))
    )}`;

    refs.demandChart.innerHTML = series.map((item) => {
      const height = Math.max((item.value / maxValue) * 100, 14);
      const isPeak = item.value === maxValue && item.value > 0;

      return `
        <div class="reservations-demand__column">
          <div class="reservations-demand__value">${item.value}</div>
          <div class="reservations-demand__bar-wrap">
            <div class="reservations-demand__bar ${isPeak ? "is-peak" : ""}" style="height: ${height}%"></div>
          </div>
          <div class="reservations-demand__label">${item.dayNumber}</div>
        </div>
      `;
    }).join("");
  }

  function getPaymentIcon(method) {
    if (method === "qr") {
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
          <rect x="14" y="4" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
          <rect x="4" y="14" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect>
          <path d="M14 14H16V16H14V14Z" fill="currentColor"></path>
          <path d="M18 14H20V20H14V18H18V14Z" fill="currentColor"></path>
        </svg>
      `;
    }

    if (method === "cash") {
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="6" width="17" height="12" rx="2.5" stroke="currentColor" stroke-width="1.8"></rect>
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.8"></circle>
          <path d="M6 9H6.1" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>
          <path d="M18 15H18.1" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"></path>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" stroke="currentColor" stroke-width="1.8"></rect>
        <path d="M3.5 10H20.5" stroke="currentColor" stroke-width="1.8"></path>
        <path d="M7 14.2H10.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path>
      </svg>
    `;
  }

  function getStatusIcon(status) {
    if (status === "cancelled") {
      return `
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="7.3" stroke="currentColor" stroke-width="2"></circle>
          <path d="M7 7L13 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
          <path d="M13 7L7 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
        </svg>
      `;
    }

    return `
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.3" stroke="currentColor" stroke-width="2"></circle>
        <path d="M6.8 10.3L9 12.5L13.3 8.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
  }

  function renderHistory() {
    refs.historyList.innerHTML = state.db.history.map((item) => {
      const statusLabel = item.status === "cancelled" ? "Annulé" : "Terminé";
      const statusClass = item.status === "cancelled" ? "is-cancelled" : "is-done";

      return `
        <article class="reservations-history__item">
          <div class="reservations-history__icon" aria-hidden="true">${getPaymentIcon(item.payment)}</div>
          <div class="reservations-history__main">
            <div class="reservations-history__title-row">
              <span class="reservations-history__machine">${item.machine}</span>
              <span class="reservations-history__duration">• ${item.duration} min</span>
            </div>
            <p class="reservations-history__date">${formatHistoryDate(item.date)}</p>
          </div>
          <div class="reservations-history__side">
            <div class="reservations-history__price">${item.price.toFixed(2)}€</div>
            <div class="reservations-history__status ${statusClass}">
              ${getStatusIcon(item.status)}
              <span>${statusLabel}</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderDetailModal() {
    const reservation = state.db.nextReservation;

    if (!reservation) {
      refs.detailContent.innerHTML = `
        <div class="reservations-detail__empty">
          <p class="reservations-detail__empty-title">Aucune réservation</p>
          <p class="reservations-detail__empty-text">Vous n'avez pas de prochain tour réservé pour le moment.</p>
        </div>
      `;
      refs.detailActions.innerHTML = "";
      return;
    }

    refs.detailContent.innerHTML = `
      <div class="reservations-detail__card">
        <p class="reservations-detail__headline">${reservation.machine}</p>
        <p class="reservations-detail__subheadline">${formatSummaryDate(reservation.date, reservation.time, reservation.machine)}</p>
      </div>

      <div class="reservations-detail__rows">
        <div class="reservations-detail__row">
          <span class="reservations-detail__label">Date</span>
          <span class="reservations-detail__value">${capitalize(
            new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(dateKeyToDate(reservation.date))
          )}</span>
        </div>
        <div class="reservations-detail__row">
          <span class="reservations-detail__label">Heure</span>
          <span class="reservations-detail__value">${reservation.time}</span>
        </div>
        <div class="reservations-detail__row">
          <span class="reservations-detail__label">Durée</span>
          <span class="reservations-detail__value">${reservation.durationMinutes} min</span>
        </div>
        <div class="reservations-detail__row">
          <span class="reservations-detail__label">Prix</span>
          <span class="reservations-detail__value">${reservation.price.toFixed(2)}€</span>
        </div>
      </div>
    `;

    refs.detailActions.innerHTML = `
      <button class="reservations-button reservations-button--danger" type="button" id="reservation-cancel-button">
        Annuler la réservation
      </button>
    `;

    document.getElementById("reservation-cancel-button").addEventListener("click", async () => {
      const result = await window.ReservationsService.cancelNextReservation();

      if (!result.ok) {
        window.alert(result.message);
        return;
      }

      closeModal();
      await refreshData();
      renderAll();
    });
  }

  async function renderBookingCalendar() {
    const month = state.bookingMonthDate;
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const currentMonth = startOfMonth(new Date());

    refs.bookingMonthLabel.textContent = formatMonthYear(month);
    refs.bookingPrevMonth.disabled = month.getTime() <= currentMonth.getTime();

    const html = [];

    for (let i = 0; i < firstDay; i += 1) {
      html.push('<div class="reservations-picker__calendar-empty" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= lastDay; day += 1) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const dateKey = toDateKey(date);
      const isPast = compareDateKeys(dateKey, window.ReservationsService.todayKey()) < 0;
      const isSelected = state.selectedDateKey === dateKey;
      const isToday = dateKey === window.ReservationsService.todayKey();

      const classes = ["reservations-picker__day"];

      if (isToday && !isSelected) {
        classes.push("is-today");
      }

      if (isSelected) {
        classes.push("is-selected");
      }

      if (isPast) {
        classes.push("is-disabled");
      }

      html.push(`
        <button
          type="button"
          class="${classes.join(" ")}"
          data-booking-date="${dateKey}"
          ${isPast ? "disabled" : ""}
        >
          ${day}
        </button>
      `);
    }

    refs.bookingCalendarGrid.innerHTML = html.join("");
  }

  async function updateBookingSlots() {
    if (!state.selectedDateKey) {
      state.bookingSlots = [];
      state.selectedTime = null;
      return;
    }

    state.bookingSlots = await window.ReservationsService.getTimeSlotsForDate(state.selectedDateKey);

    if (!state.bookingSlots.some((slot) => slot.time === state.selectedTime && !slot.isBooked && !slot.isPast)) {
      state.selectedTime = null;
    }
  }

  function renderBookingSlots() {
    if (!state.selectedDateKey) {
      refs.bookingTimeSlots.innerHTML = `
        <div class="reservations-time-slots__empty">
          Sélectionnez une date pour voir les horaires disponibles.
        </div>
      `;
      refs.bookingConfirmButton.disabled = true;
      return;
    }

    refs.bookingTimeSlots.innerHTML = state.bookingSlots.map((slot) => {
      const classes = ["reservations-time-slots__item"];

      if (slot.isBooked) {
        classes.push("is-booked");
      } else if (slot.isPast) {
        classes.push("is-disabled");
      } else if (state.selectedTime === slot.time) {
        classes.push("is-selected");
      }

      return `
        <button
          type="button"
          class="${classes.join(" ")}"
          data-booking-time="${slot.time}"
          ${slot.isBooked || slot.isPast ? "disabled" : ""}
        >
          ${slot.time}
        </button>
      `;
    }).join("");

    refs.bookingConfirmButton.disabled = !state.selectedTime;
  }

  async function renderBookingModal() {
    await renderBookingCalendar();
    await updateBookingSlots();
    renderBookingSlots();
  }

  function renderAll() {
    renderSummaryCard();
    renderPreviewCalendar();
    renderDemandChart();
    renderHistory();

    if (state.activeModal === "detail") {
      renderDetailModal();
    }

    if (state.activeModal === "booking") {
      renderBookingModal();
    }
  }

  async function openDetailModal() {
    renderDetailModal();
    openModal("detail");
  }

  async function openBookingModal(dateKey) {
    const today = window.ReservationsService.todayKey();

    state.selectedDateKey = dateKey && compareDateKeys(dateKey, today) >= 0 ? dateKey : today;
    state.selectedTime = null;
    state.bookingMonthDate = startOfMonth(dateKeyToDate(state.selectedDateKey));

    openModal("booking");
    await renderBookingModal();
  }

  async function changeBookingMonth(delta) {
    const nextMonth = addMonths(state.bookingMonthDate, delta);
    const currentMonth = startOfMonth(new Date());

    if (nextMonth.getTime() < currentMonth.getTime()) {
      return;
    }

    state.bookingMonthDate = nextMonth;
    await renderBookingModal();
  }

  function bindEvents() {
    refs.summaryTrigger.addEventListener("click", openDetailModal);
    refs.summaryTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetailModal();
      }
    });

    refs.calendarTrigger.addEventListener("click", () => {
      openBookingModal(state.selectedDateKey);
    });

    refs.calendarTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBookingModal(state.selectedDateKey);
      }
    });

    refs.calendarGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-preview-date]");
      if (!button) {
        return;
      }

      openBookingModal(button.dataset.previewDate);
    });

    refs.modalLayer.addEventListener("click", (event) => {
      if (event.target.matches("[data-close-modal]")) {
        closeModal();
      }
    });

    refs.bookingPrevMonth.addEventListener("click", () => {
      changeBookingMonth(-1);
    });

    refs.bookingNextMonth.addEventListener("click", () => {
      changeBookingMonth(1);
    });

    refs.bookingCalendarGrid.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-booking-date]");

      if (!button) {
        return;
      }

      state.selectedDateKey = button.dataset.bookingDate;
      state.selectedTime = null;

      await renderBookingModal();
    });

    refs.bookingTimeSlots.addEventListener("click", (event) => {
      const button = event.target.closest("[data-booking-time]");

      if (!button) {
        return;
      }

      const time = button.dataset.bookingTime;
      const slot = state.bookingSlots.find((item) => item.time === time);

      if (!slot || slot.isBooked || slot.isPast) {
        return;
      }

      state.selectedTime = time;
      renderBookingSlots();
    });

    refs.bookingConfirmButton.addEventListener("click", async () => {
      if (!state.selectedDateKey || !state.selectedTime) {
        return;
      }

      const result = await window.ReservationsService.reserveSlot(state.selectedDateKey, state.selectedTime);

      if (!result.ok) {
        window.alert(result.message);
        await refreshData();
        renderAll();
        return;
      }

      closeModal();
      await refreshData();
      renderAll();
    });

    let swipeStartX = null;

    refs.bookingSwipeSurface.addEventListener("pointerdown", (event) => {
      swipeStartX = event.clientX;
    });

    refs.bookingSwipeSurface.addEventListener("pointerup", (event) => {
      if (swipeStartX === null) {
        return;
      }

      const deltaX = event.clientX - swipeStartX;
      swipeStartX = null;

      if (Math.abs(deltaX) < 45) {
        return;
      }

      if (deltaX < 0) {
        changeBookingMonth(1);
      } else {
        changeBookingMonth(-1);
      }
    });

    if (window.reservationsKeydownHandler) {
      document.removeEventListener("keydown", window.reservationsKeydownHandler);
    }

    window.reservationsKeydownHandler = async function (event) {
      if (state.activeModal !== "booking") {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        await changeBookingMonth(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        await changeBookingMonth(1);
      }
    };

    document.addEventListener("keydown", window.reservationsKeydownHandler);
  }

  async function initReservationsView() {
    if (!document.getElementById("reservations-view")) {
      return;
    }

    cacheElements();
    closeModal();

    if (window.reservationsCountdownInterval) {
      clearInterval(window.reservationsCountdownInterval);
    }

    await window.ReservationsService.init();
    await refreshData();

    state.previewMonthDate = startOfMonth(new Date());
    state.bookingMonthDate = startOfMonth(new Date());
    state.selectedDateKey = state.db.nextReservation
      ? state.db.nextReservation.date
      : window.ReservationsService.todayKey();
    state.selectedTime = null;
    state.bookingSlots = [];
    state.activeModal = null;

    bindEvents();
    renderAll();

    if (window.openBookingModalFromHome) {
      // open modal with today's date
      openBookingModal(window.ReservationsService.todayKey());
      
      // turn off flag to avoid opening the modal if we click on reservations
      window.openBookingModalFromHome = false; 
    }

    window.reservationsCountdownInterval = setInterval(() => {
      if (!document.getElementById("reservations-view")) {
        clearInterval(window.reservationsCountdownInterval);
        window.reservationsCountdownInterval = null;
        return;
      }

      renderSummaryCard();
    }, 1000);
  }

  window.initReservationsView = initReservationsView;
})();