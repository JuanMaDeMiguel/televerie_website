(function () {
  let reservationsState = null;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
  }

  function setTime(date, hours, minutes) {
    const copy = new Date(date);
    copy.setHours(hours, minutes, 0, 0);
    return copy;
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatTime(date) {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatMonthYear(date) {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function formatNextReservation(date, machine) {
    const dayLabel = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(date);

    const normalizedDayLabel = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);
    return `${normalizedDayLabel}, ${formatTime(date)} - ${machine}`;
  }

  function formatHistoryDate(date) {
    const dayLabel = new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);

    return `${dayLabel} à ${formatTime(date)}`;
  }

  function formatRangeLabel(data) {
    if (!data.length) {
      return "";
    }

    const first = data[0].date;
    const last = data[data.length - 1].date;
    const firstMonth = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(first);
    const lastMonth = new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(last);

    if (first.getMonth() === last.getMonth() && first.getFullYear() === last.getFullYear()) {
      return `${first.getDate()}–${last.getDate()} ${firstMonth}`;
    }

    return `${first.getDate()} ${firstMonth} – ${last.getDate()} ${lastMonth}`;
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

  function buildReservationsState() {
    const now = new Date();
    const today = startOfDay(now);
    const nextReservationDate = new Date(now.getTime() + ((10 * 60) + 30) * 60 * 1000);

    nextReservationDate.setSeconds(0, 0);

    const demandValues = [4, 6, 5, 5, 9, 4, 12];

    const demandData = demandValues.map((value, index) => ({
      date: addDays(today, index),
      value
    }));

    const calendarStatus = {};

    demandData.forEach((item) => {
      const key = toDateKey(item.date);

      if (item.value >= 10) {
        calendarStatus[key] = "unavailable";
      } else if (item.value <= 4) {
        calendarStatus[key] = "recommended";
      } else {
        calendarStatus[key] = "available";
      }
    });

    const historyData = [
      {
        machine: "L2",
        duration: 45,
        price: 3.5,
        date: setTime(addDays(today, -5), 14, 30),
        status: "done",
        payment: "card"
      },
      {
        machine: "S1",
        duration: 60,
        price: 4.0,
        date: setTime(addDays(today, -8), 10, 15),
        status: "done",
        payment: "qr"
      },
      {
        machine: "L1",
        duration: 45,
        price: 3.5,
        date: setTime(addDays(today, -12), 16, 45),
        status: "done",
        payment: "cash"
      },
      {
        machine: "L3",
        duration: 45,
        price: 3.5,
        date: setTime(addDays(today, -15), 9, 0),
        status: "cancelled",
        payment: "qr"
      }
    ];

    return {
      currentMonth: today.getMonth(),
      currentYear: today.getFullYear(),
      selectedDate: addDays(today, 2),
      nextReservation: {
        machine: "Machine L1",
        date: nextReservationDate
      },
      demandData,
      calendarStatus,
      historyData
    };
  }

  function renderCountdown() {
    const valueElement = document.getElementById("reservations-countdown-value");
    const infoElement = document.getElementById("reservations-next-info");

    if (!valueElement || !infoElement || !reservationsState) {
      return;
    }

    const now = new Date();
    const diff = Math.max(reservationsState.nextReservation.date.getTime() - now.getTime(), 0);
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    valueElement.textContent = `${pad(hours)}:${pad(minutes)}`;
    infoElement.textContent = formatNextReservation(
      reservationsState.nextReservation.date,
      reservationsState.nextReservation.machine
    );
  }

  function renderCalendar() {
    const grid = document.getElementById("reservations-calendar-grid");
    const monthLabel = document.getElementById("reservations-calendar-month");

    if (!grid || !monthLabel || !reservationsState) {
      return;
    }

    const { currentMonth, currentYear, selectedDate, calendarStatus } = reservationsState;
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const visibleMonthDate = new Date(currentYear, currentMonth, 1);

    monthLabel.textContent = formatMonthYear(visibleMonthDate);

    const cells = [];

    for (let i = 0; i < firstDayOfMonth; i += 1) {
      cells.push('<div class="reservations-calendar__empty" aria-hidden="true"></div>');
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = toDateKey(date);
      const status = calendarStatus[dateKey] || "available";
      const isSelected = toDateKey(selectedDate) === dateKey;

      const classes = ["reservations-calendar__day"];

      if (status === "recommended") {
        classes.push("is-recommended");
      }

      if (status === "unavailable") {
        classes.push("is-unavailable");
      }

      if (isSelected) {
        classes.push("is-selected");
      }

      cells.push(`
        <button
          type="button"
          class="${classes.join(" ")}"
          data-date="${dateKey}"
          ${status === "unavailable" ? "disabled" : ""}
          aria-label="Réserver le ${day}"
        >
          ${day}
        </button>
      `);
    }

    grid.innerHTML = cells.join("");

    const clickableDays = grid.querySelectorAll(".reservations-calendar__day:not(:disabled)");

    clickableDays.forEach((button) => {
      button.addEventListener("click", () => {
        const [year, month, day] = button.dataset.date.split("-").map(Number);
        reservationsState.selectedDate = new Date(year, month - 1, day);
        renderCalendar();
      });
    });
  }

  function renderDemandChart() {
    const chart = document.getElementById("reservations-demand-chart");
    const rangeLabel = document.getElementById("reservations-demand-range");

    if (!chart || !rangeLabel || !reservationsState) {
      return;
    }

    const maxValue = Math.max(...reservationsState.demandData.map((item) => item.value));

    rangeLabel.textContent = formatRangeLabel(reservationsState.demandData);

    chart.innerHTML = reservationsState.demandData.map((item) => {
      const height = Math.max((item.value / maxValue) * 100, 14);
      const isPeak = item.value === maxValue;

      return `
        <div class="reservations-demand__column">
          <div class="reservations-demand__value">${item.value}</div>
          <div class="reservations-demand__bar-wrap">
            <div
              class="reservations-demand__bar ${isPeak ? "is-peak" : ""}"
              style="height: ${height}%"
            ></div>
          </div>
          <div class="reservations-demand__label">${item.date.getDate()}</div>
        </div>
      `;
    }).join("");
  }

  function renderHistory() {
    const list = document.getElementById("reservations-history-list");

    if (!list || !reservationsState) {
      return;
    }

    list.innerHTML = reservationsState.historyData.map((item) => {
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

  function initReservationsView() {
    const view = document.getElementById("reservations-view");

    if (!view) {
      return;
    }

    if (window.reservationsCountdownInterval) {
      clearInterval(window.reservationsCountdownInterval);
    }

    reservationsState = buildReservationsState();

    renderCountdown();
    renderCalendar();
    renderDemandChart();
    renderHistory();

    window.reservationsCountdownInterval = setInterval(renderCountdown, 1000);
  }

  window.initReservationsView = initReservationsView;
})();