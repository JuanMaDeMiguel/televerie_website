window.ReservationsService = (function () {
  const STORAGE_KEY = "televerie_reservations_db_v3";

  const JSON_PATHS = [
    "./ressources/data/reservations.json",
    "ressources/data/reservations.json",
    "./reservations.json"
  ];

  const FALLBACK_DATA = {
    settings: {
      availableHours: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00"
      ],
      slotDurationMinutes: 60,
      pricePerSlot: 4,
      defaultMachine: "Machine L1",
      defaultPaymentMethod: "card"
    },
    nextReservation: null,
    demand: [],
    bookedSlots: {},
    history: []
  };

  let dbCache = null;
  let initPromise = null;

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function todayKey() {
    return toDateKey(new Date());
  }

  function addDays(date, amount) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + amount);
    return copy;
  }

  function isValidDateKey(dateKey) {
    if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
      return false;
    }

    const parsed = new Date(`${dateKey}T00:00:00`);
    return !Number.isNaN(parsed.getTime()) && toDateKey(parsed) === dateKey;
  }

  function isValidTime(time) {
    return typeof time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
  }

  function isFutureSlot(dateKey, time) {
    if (!isValidDateKey(dateKey) || !isValidTime(time)) {
      return false;
    }

    const dateTime = new Date(`${dateKey}T${time}:00`);
    return dateTime.getTime() > Date.now();
  }

  function compareDateKeys(a, b) {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
  }

  function buildDefaultDemand() {
    const today = new Date();
    const values = [4, 6, 5, 5, 9, 4, 12];

    return values.map((value, index) => ({
      date: toDateKey(addDays(today, index)),
      value
    }));
  }

  function sanitizeSettings(rawSettings) {
    const rawHours = Array.isArray(rawSettings?.availableHours) ? rawSettings.availableHours : [];
    const availableHours = [...new Set(rawHours.filter(isValidTime))].sort();

    return {
      availableHours: availableHours.length ? availableHours : deepClone(FALLBACK_DATA.settings.availableHours),
      slotDurationMinutes:
        Number(rawSettings?.slotDurationMinutes) > 0
          ? Number(rawSettings.slotDurationMinutes)
          : FALLBACK_DATA.settings.slotDurationMinutes,
      pricePerSlot:
        Number(rawSettings?.pricePerSlot) >= 0
          ? Number(rawSettings.pricePerSlot)
          : FALLBACK_DATA.settings.pricePerSlot,
      defaultMachine:
        typeof rawSettings?.defaultMachine === "string" && rawSettings.defaultMachine.trim()
          ? rawSettings.defaultMachine.trim()
          : FALLBACK_DATA.settings.defaultMachine,
      defaultPaymentMethod:
        ["card", "cash", "qr"].includes(rawSettings?.defaultPaymentMethod)
          ? rawSettings.defaultPaymentMethod
          : FALLBACK_DATA.settings.defaultPaymentMethod
    };
  }

  function sanitizeDemand(rawDemand) {
    if (!Array.isArray(rawDemand)) {
      return buildDefaultDemand();
    }

    const filtered = rawDemand
      .filter((item) => item && isValidDateKey(item.date) && Number(item.value) >= 0)
      .map((item) => ({
        date: item.date,
        value: Math.round(Number(item.value))
      }))
      .sort((a, b) => compareDateKeys(a.date, b.date));

    return filtered.length ? filtered : buildDefaultDemand();
  }

  function sanitizeBookedSlots(rawBookedSlots, allowedHours) {
    const result = {};

    if (!rawBookedSlots || typeof rawBookedSlots !== "object") {
      return result;
    }

    Object.keys(rawBookedSlots).forEach((dateKey) => {
      if (!isValidDateKey(dateKey) || !Array.isArray(rawBookedSlots[dateKey])) {
        return;
      }

      const validSlots = [...new Set(rawBookedSlots[dateKey].filter((time) => allowedHours.includes(time)))].sort();

      if (validSlots.length) {
        result[dateKey] = validSlots;
      }
    });

    return result;
  }

  function sanitizeHistory(rawHistory) {
    if (!Array.isArray(rawHistory)) {
      return [];
    }

    return rawHistory.filter((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const parsedDate = new Date(item.date);

      return (
        typeof item.machine === "string" &&
        !Number.isNaN(parsedDate.getTime()) &&
        typeof item.duration === "number" &&
        item.duration > 0 &&
        typeof item.price === "number" &&
        item.price >= 0 &&
        ["done", "cancelled"].includes(item.status) &&
        ["card", "cash", "qr"].includes(item.payment)
      );
    });
  }

  function sanitizeNextReservation(rawReservation, settings) {
    if (!rawReservation || typeof rawReservation !== "object") {
      return null;
    }

    if (!isValidDateKey(rawReservation.date)) {
      return null;
    }

    if (!settings.availableHours.includes(rawReservation.time)) {
      return null;
    }

    if (!isFutureSlot(rawReservation.date, rawReservation.time)) {
      return null;
    }

    return {
      date: rawReservation.date,
      time: rawReservation.time,
      machine:
        typeof rawReservation.machine === "string" && rawReservation.machine.trim()
          ? rawReservation.machine.trim()
          : settings.defaultMachine,
      durationMinutes:
        Number(rawReservation.durationMinutes) > 0
          ? Number(rawReservation.durationMinutes)
          : settings.slotDurationMinutes,
      price:
        Number(rawReservation.price) >= 0
          ? Number(rawReservation.price)
          : settings.pricePerSlot,
      payment:
        ["card", "cash", "qr"].includes(rawReservation.payment)
          ? rawReservation.payment
          : settings.defaultPaymentMethod,
      status: "confirmed"
    };
  }

  function sanitizeDatabase(rawData) {
    const settings = sanitizeSettings(rawData?.settings);

    const db = {
      settings,
      nextReservation: sanitizeNextReservation(rawData?.nextReservation, settings),
      demand: sanitizeDemand(rawData?.demand),
      bookedSlots: sanitizeBookedSlots(rawData?.bookedSlots, settings.availableHours),
      history: sanitizeHistory(rawData?.history)
    };

    if (db.nextReservation) {
      const { date, time } = db.nextReservation;

      if (!db.bookedSlots[date]) {
        db.bookedSlots[date] = [];
      }

      if (!db.bookedSlots[date].includes(time)) {
        db.bookedSlots[date].push(time);
        db.bookedSlots[date].sort();
      }
    }

    return db;
  }

  async function tryFetchJson() {
    for (const path of JSON_PATHS) {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          continue;
        }

        return await response.json();
      } catch (error) {
        /* Keep trying next path */
      }
    }

    return deepClone(FALLBACK_DATA);
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCache));
  }

  async function init() {
    if (dbCache) {
      return deepClone(dbCache);
    }

    if (!initPromise) {
      initPromise = (async function () {
        const stored = loadFromStorage();
        const source = stored || await tryFetchJson();
        dbCache = sanitizeDatabase(source);
        persist();
        return deepClone(dbCache);
      })();
    }

    return initPromise;
  }

  async function getReservationsData() {
    await init();
    return deepClone(dbCache);
  }

  async function getTimeSlotsForDate(dateKey) {
    await init();

    if (!isValidDateKey(dateKey)) {
      return [];
    }

    const booked = dbCache.bookedSlots[dateKey] || [];

    return dbCache.settings.availableHours.map((time) => ({
      time,
      isBooked: booked.includes(time),
      isPast: !isFutureSlot(dateKey, time)
    }));
  }

  function updateDemand(dateKey, delta) {
    let demandEntry = dbCache.demand.find((item) => item.date === dateKey);

    if (!demandEntry) {
      demandEntry = { date: dateKey, value: 0 };
      dbCache.demand.push(demandEntry);
      dbCache.demand.sort((a, b) => compareDateKeys(a.date, b.date));
    }

    demandEntry.value = Math.max(0, demandEntry.value + delta);
  }

  async function reserveSlot(dateKey, time) {
    await init();

    if (!isValidDateKey(dateKey) || !dbCache.settings.availableHours.includes(time)) {
      return { ok: false, message: "Créneau invalide." };
    }

    if (!isFutureSlot(dateKey, time)) {
      return { ok: false, message: "Impossible de réserver un créneau passé." };
    }

    const daySlots = dbCache.bookedSlots[dateKey] || [];

    if (daySlots.includes(time)) {
      return { ok: false, message: "Ce créneau est déjà pris." };
    }

    if (dbCache.nextReservation) {
      const previous = dbCache.nextReservation;

      if (dbCache.bookedSlots[previous.date]) {
        dbCache.bookedSlots[previous.date] = dbCache.bookedSlots[previous.date].filter(
          (slot) => slot !== previous.time
        );

        if (!dbCache.bookedSlots[previous.date].length) {
          delete dbCache.bookedSlots[previous.date];
        }
      }

      updateDemand(previous.date, -1);
    }

    if (!dbCache.bookedSlots[dateKey]) {
      dbCache.bookedSlots[dateKey] = [];
    }

    dbCache.bookedSlots[dateKey].push(time);
    dbCache.bookedSlots[dateKey].sort();

    dbCache.nextReservation = {
      date: dateKey,
      time,
      machine: dbCache.settings.defaultMachine,
      durationMinutes: dbCache.settings.slotDurationMinutes,
      price: dbCache.settings.pricePerSlot,
      payment: dbCache.settings.defaultPaymentMethod,
      status: "confirmed"
    };

    updateDemand(dateKey, 1);
    persist();

    return { ok: true };
  }

  async function cancelNextReservation() {
    await init();

    if (!dbCache.nextReservation) {
      return { ok: false, message: "Aucune réservation active." };
    }

    const reservation = dbCache.nextReservation;

    if (dbCache.bookedSlots[reservation.date]) {
      dbCache.bookedSlots[reservation.date] = dbCache.bookedSlots[reservation.date].filter(
        (slot) => slot !== reservation.time
      );

      if (!dbCache.bookedSlots[reservation.date].length) {
        delete dbCache.bookedSlots[reservation.date];
      }
    }

    updateDemand(reservation.date, -1);
    dbCache.nextReservation = null;
    persist();

    return { ok: true };
  }

  async function resetFromSeed() {
    const source = await tryFetchJson();
    dbCache = sanitizeDatabase(source);
    persist();
    return deepClone(dbCache);
  }

  return {
    init,
    getReservationsData,
    getTimeSlotsForDate,
    reserveSlot,
    cancelNextReservation,
    resetFromSeed,
    todayKey
  };
})();