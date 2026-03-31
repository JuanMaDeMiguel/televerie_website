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

  function getTodayKey() {
    return toDateKey(new Date());
  }

  function compareDateKeys(a, b) {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  }

  function isCurrentOrFutureDate(dateKey) {
    return compareDateKeys(dateKey, getTodayKey()) >= 0;
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

  function formatDateLabel(dateKey) {
    return capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(dateKeyToDate(dateKey))
    );
  }

  function formatCompactDate(dateKey) {
    return capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(dateKeyToDate(dateKey))
    );
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

  function formatSummaryDate(dateKey, time, machine) {
    const date = dateKeyToDate(dateKey);
    return `${capitalize(
      new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(date)
    )}, ${time} - ${machine}`;
  }

  function getDemandMap() {
    const map = new Map();

    state.db.demand.forEach((item) => {
      map.set(item.date, item.value);
    });

    return map;
  }

  function getDemandSeries() {
    const today = new Date();
    const demandMap = getDemandMap();
    const series = [];

    for (let index = 0; index < 7; index += 1) {
      const date = addDays(today, index);
      const dateKey = toDateKey(date);

      series.push({
        dateKey,
        dayNumber: date.getDate(),
        value: demandMap.get(dateKey) || 0
      });
    }

    return series;
  }

  function getCalendarStatus(dateKey) {
    const demandMap = getDemandMap();
    const value = demandMap.get(dateKey);

    if (compareDateKeys(dateKey, getTodayKey()) < 0) {
      return "past";
    }

    if (typeof value !== "number") {
      return "available";
    }

    if (value >= 10) {
      return "unavailable";
    }

    if (value > 0 && value <= 4) {
      return "recommended";
    }

    return "available";
  }

  function getInitialSelectedDateKey() {
    if (state.db.nextReservation) {
      return state.db.nextReservation.date;
    }

    return getTodayKey();
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

    const slotDateTime = new Date(`${reservation.date}T${reservation.time}:00`);
    const diff = Math.max(slotDateTime.getTime() - Date.now(), 0);
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    refs.countdownValue.textContent = `${pad(hours)}:${pad(minutes)}`;
    refs.nextInfo.textContent = formatSummaryDate(
      reservation.date,
      reservation.time,
      reservation.machine
    );
  }

  function renderPreviewCalendar() {
    const monthDate = state.previewMonthDate;
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
    const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    refs.calendarMonth.textContent = formatMonthYear(monthDate);

    const cells = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push('<div class="reservations-calendar__empty" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= lastDay; day += 1) {
      const cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      const dateKey = toDateKey(cellDate);
      const status = getCalendarStatus(dateKey);
      const isSelected = state.selectedDateKey === dateKey;

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

      if (isSelected && status === "available") {
        classes.push("is-selected");
      }

      cells.push(`
        <button
          type="button"
          class="${classes.join(" ")}"
          data-preview-date="${dateKey}"
          ${status === "past" ? "disabled" : ""}
          aria-label="Ouvrir la réservation pour le ${day}"
        >
          ${day}
        </button>
      `);
    }

    refs.calendarGrid.innerHTML = cells.join("");
  }

  function renderDemandChart() {
    const series = getDemandSeries();
    const values = series.map((item) => item.value);
    const maxValue = Math.max(...values, 1);

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
            <div
              class="reservations-demand__bar ${isPeak ? "is-peak" : ""}"
              style="height: ${height}%"
            ></div>
          </div>
          <div class="reservations-demand__label">${item.dayNumber}</div>
        </div>
      `;
    }).join("");
  }

  function renderHistory() {
    refs.historyList.innerHTML = state.db.history.map((item) => {
      const statusLabel = item.status === "cancelled" ? "Annulé" : "Terminé";
      const statusClass = item.status === "cancelled" ? "is-cancelled" : "is-done";

      return `
        <article class="reservations-history__item">
          <div class="reservations-history__icon" aria-hidden="true">
            ${getPaymentIcon(item.payment)}
          </div>

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
          <p class="reservations-detail__empty-text">
            Vous n'avez pas de prochain tour réservé pour le moment.
          </p>
        </div>
      `;

      refs.detailActions.innerHTML = "";
      return;
    }

    refs.detailContent.innerHTML = `
      <div class="reservations-detail__card">
        <p class="reservations-detail__headline">${reservation.machine}</p>
        <p class="reservations-detail__subheadline">
          ${formatDateLabel(reservation.date)} à ${reservation.time}
        </p>
      </div>

      <div class="reservations-detail__rows">
        <div class="reservations-detail__row">
          <span class="reservations-detail__label">Date</span>
          <span class="reservations-detail__value">${formatCompactDate(reservation.date)}</span>
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

    const cancelButton = document.getElementById("reservation-cancel-button");

    cancelButton.addEventListener("click", async () => {
      const result = await window.ReservationsService.cancelNextReservation();

      if (!result.ok) {
        window.alert(result.message);
        return;
      }

      closeModal();
      await refreshData();
      renderMainView();
    });
  }

  async function updateBookingSlots() {
    if (!state.selectedDateKey || !isCurrentOrFutureDate(state.selectedDateKey)) {
      state.bookingSlots = [];
      state.selectedTime = null;
      return;
    }

    state.bookingSlots = await window.ReservationsService.getTimeSlotsForDate(state.selectedDateKey);

    if (state.selectedTime) {
      const match = state.bookingSlots.find((slot) => slot.time === state.selectedTime && !slot.isBooked && !slot.isPast);

      if (!match) {
        state.selectedTime = null;
      }
    }
  }

  function renderBookingCalendar() {
    const visibleMonth = state.bookingMonthDate;
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1).getDay();
    const lastDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
    const todayKey = getTodayKey();

    refs.bookingMonthLabel.textContent = formatMonthYear(visibleMonth);
    refs.bookingPrevMonth.disabled = startOfMonth(visibleMonth).getTime() <= startOfMonth(new Date()).getTime();

    const cells = [];

    for (let index = 0; index < firstDay; index += 1) {
      cells.push('<div class="reservations-picker__calendar-empty" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= lastDay; day += 1) {
      const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
      const dateKey = toDateKey(date);
      const isDisabled = compareDateKeys(dateKey, todayKey) < 0;
      const isSelected = state.selectedDateKey === dateKey;
      const isToday = dateKey === todayKey;

      const classes = ["reservations-picker__day"];

      if (isToday && !isSelected) {
        classes.push("is-today");
      }

      if (isSelected) {
        classes.push("is-selected");
      }

      if (isDisabled) {
        classes.push("is-disabled");
      }

      cells.push(`
        <button
          type="button"
          class="${classes.join(" ")}"
          data-booking-date="${dateKey}"
          ${isDisabled ? "disabled" : ""}
        >
          ${day}
        </button>
      `);
    }

    refs.bookingCalendarGrid.innerHTML = cells.join("");
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
    renderBookingCalendar();
    await updateBookingSlots();
    renderBookingSlots();
  }

  function renderMainView() {
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

  function openModal(modalName) {
    state.activeModal = modalName;
    refs.modalLayer.hidden = false;
    document.body.classList.add("reservations-modal-open");

    refs.detailModal.hidden = modalName !== "detail";
    refs.bookingModal.hidden = modalName !== "booking";
  }

  function closeModal() {
    state.activeModal = null;
    refs.modalLayer.hidden = true;
    refs.detailModal.hidden = true;
    refs.bookingModal.hidden = true;
    document.body.classList.remove("reservations-modal-open");
  }

  async function openDetailModal() {
    renderDetailModal();
    openModal("detail");
  }

  async function openBookingModal(dateKey) {
    if (dateKey && isCurrentOrFutureDate(dateKey)) {
      state.selectedDateKey = dateKey;
    } else if (!state.selectedDateKey || !isCurrentOrFutureDate(state.selectedDateKey)) {
      state.selectedDateKey = getTodayKey();
    }

    state.selectedTime = null;
    state.bookingMonthDate = startOfMonth(dateKeyToDate(state.selectedDateKey));

    if (state.bookingMonthDate.getTime() < startOfMonth(new Date()).getTime()) {
      state.bookingMonthDate = startOfMonth(new Date());
    }

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

  async function handleBookingDateSelection(dateKey) {
    if (!isCurrentOrFutureDate(dateKey)) {
      return;
    }

    state.selectedDateKey = dateKey;
    state.selectedTime = null;
    await renderBookingModal();
  }

  function handleBookingTimeSelection(time) {
    const selectedSlot = state.bookingSlots.find(
      (slot) => slot.time === time && !slot.isBooked && !slot.isPast
    );

    if (!selectedSlot) {
      return;
    }

    state.selectedTime = time;
    renderBookingSlots();
  }

  async function confirmBooking() {
    if (!state.selectedDateKey || !state.selectedTime) {
      return;
    }

    const result = await window.ReservationsService.reserveSlot(state.selectedDateKey, state.selectedTime);

    if (!result.ok) {
      window.alert(result.message);
      await refreshData();
      renderMainView();
      await renderBookingModal();
      return;
    }

    closeModal();
    await refreshData();
    renderMainView();
  }

  function handlePreviewCalendarClick(event) {
    const button = event.target.closest("[data-preview-date]");

    if (button) {
      openBookingModal(button.dataset.previewDate);
      return;
    }

    openBookingModal(state.selectedDateKey);
  }

  function handleKeyboardNavigation(event) {
    if (state.activeModal !== "booking") {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeBookingMonth(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeBookingMonth(1);
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
    }
  }

  function setupSwipeNavigation() {
    let startX = 0;
    let isPointerActive = false;

    refs.bookingSwipeSurface.addEventListener("pointerdown", (event) => {
      isPointerActive = true;
      startX = event.clientX;
    });

    refs.bookingSwipeSurface.addEventListener("pointerup", (event) => {
      if (!isPointerActive || state.activeModal !== "booking") {
        return;
      }

      const deltaX = event.clientX - startX;
      isPointerActive = false;

      if (Math.abs(deltaX) < 45) {
        return;
      }

      if (deltaX < 0) {
        changeBookingMonth(1);
      } else {
        changeBookingMonth(-1);
      }
    });

    refs.bookingSwipeSurface.addEventListener("pointercancel", () => {
      isPointerActive = false;
    });
  }

  function bindEvents() {
    refs.summaryTrigger.addEventListener("click", openDetailModal);
    refs.summaryTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openDetailModal();
      }
    });

    refs.calendarTrigger.addEventListener("click", handlePreviewCalendarClick);
    refs.calendarTrigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openBookingModal(state.selectedDateKey);
      }
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

    refs.bookingCalendarGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-booking-date]");

      if (!button) {
        return;
      }

      handleBookingDateSelection(button.dataset.bookingDate);
    });

    refs.bookingTimeSlots.addEventListener("click", (event) => {
      const button = event.target.closest("[data-booking-time]");

      if (!button) {
        return;
      }

      handleBookingTimeSelection(button.dataset.bookingTime);
    });

    refs.bookingConfirmButton.addEventListener("click", confirmBooking);

    if (window.reservationsKeydownHandler) {
      document.removeEventListener("keydown", window.reservationsKeydownHandler);
    }

    window.reservationsKeydownHandler = handleKeyboardNavigation;
    document.addEventListener("keydown", window.reservationsKeydownHandler);

    setupSwipeNavigation();
  }

  async function initReservationsView() {
    const view = document.getElementById("reservations-view");

    if (!view) {
      return;
    }

    cacheElements();

    if (window.reservationsCountdownInterval) {
      clearInterval(window.reservationsCountdownInterval);
    }

    await window.ReservationsService.init();
    await refreshData();

    state.previewMonthDate = startOfMonth(new Date());
    state.bookingMonthDate = startOfMonth(new Date());
    state.selectedDateKey = getInitialSelectedDateKey();
    state.selectedTime = null;
    state.bookingSlots = [];

    bindEvents();
    renderMainView();

    window.reservationsCountdownInterval = setInterval(() => {
      if (!document.getElementById("reservations-view")) {
        clearInterval(window.reservationsCountdownInterval);
        return;
      }

      renderSummaryCard();
    }, 1000);
  }

  window.initReservationsView = initReservationsView;
})();