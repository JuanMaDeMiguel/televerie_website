window.ReservationsService = (function () {
  const STORAGE_KEY = "televerie_reservations_db_v2";
  const JSON_PATH = "./ressources/data/reservations.json";

  const DEFAULT_HOURS = [
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
  ];

  let dbCache = null;
  let initPromise = null;

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

  function toDateKey(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function dateKeyToDate(dateKey) {
    return new Date(`${dateKey}T00:00:00`);
  }

  function compareDateKeys(a, b) {
    if (a === b) {
      return 0;
    }
    return a > b ? 1 : -1;
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

  function isValidTimeSlot(time) {
    return typeof time === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time);
  }

  function isFutureSlot(dateKey, time) {
    if (!isValidDateKey(dateKey) || !isValidTimeSlot(time)) {
      return false;
    }

    const slotDate = new Date(`${dateKey}T${time}:00`);
    return slotDate.getTime() > Date.now();
  }

  function sanitizeHours(hours) {
    if (!Array.isArray(hours)) {
      return DEFAULT_HOURS.slice();
    }

    const uniqueHours = [...new Set(hours.filter(isValidTimeSlot))].sort();
    return uniqueHours.length ? uniqueHours : DEFAULT_HOURS.slice();
  }

  function buildFallbackDemand() {
    const today = new Date();
    const values = [4, 6, 5, 5, 9, 4, 12];

    return values.map((value, index) => ({
      date: toDateKey(addDays(today, index)),
      value
    }));
  }

  function sanitizeDemand(rawDemand) {
    if (!Array.isArray(rawDemand)) {
      return buildFallbackDemand();
    }

    const todayKey = getTodayKey();
    const map = new Map();

    rawDemand.forEach((item) => {
      if (!item || !isValidDateKey(item.date)) {
        return;
      }

      if (compareDateKeys(item.date, todayKey) < 0) {
        return;
      }

      const numericValue = Number(item.value);
      if (Number.isNaN(numericValue) || numericValue < 0) {
        return;
      }

      map.set(item.date, {
        date: item.date,
        value: Math.round(numericValue)
      });
    });

    const result = [...map.values()].sort((a, b) => compareDateKeys(a.date, b.date));
    return result.length ? result : buildFallbackDemand();
  }

  function sanitizeBookedSlots(rawBookedSlots, allowedHours) {
    const result = {};
    const todayKey = getTodayKey();

    if (!rawBookedSlots || typeof rawBookedSlots !== "object") {
      return result;
    }

    Object.keys(rawBookedSlots).forEach((dateKey) => {
      if (!isValidDateKey(dateKey)) {
        return;
      }

      if (compareDateKeys(dateKey, todayKey) < 0) {
        return;
      }

      const value = rawBookedSlots[dateKey];
      if (!Array.isArray(value)) {
        return;
      }

      const uniqueTimes = [...new Set(value.filter((time) => allowedHours.includes(time)))].sort();

      if (uniqueTimes.length) {
        result[dateKey] = uniqueTimes;
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

    if (!isValidDateKey(rawReservation.date) || !settings.availableHours.includes(rawReservation.time)) {
      return null;
    }

    if (!isFutureSlot(rawReservation.date, rawReservation.time)) {
      return null;
    }

    const duration = Number(rawReservation.durationMinutes);
    const price = Number(rawReservation.price);

    return {
      date: rawReservation.date,
      time: rawReservation.time,
      machine: typeof rawReservation.machine === "string" && rawReservation.machine.trim()
        ? rawReservation.machine.trim()
        : settings.defaultMachine,
      durationMinutes: Number.isNaN(duration) || duration <= 0 ? settings.slotDurationMinutes : duration,
      price: Number.isNaN(price) || price < 0 ? settings.pricePerSlot : price,
      payment: ["card", "cash", "qr"].includes(rawReservation.payment)
        ? rawReservation.payment
        : settings.defaultPaymentMethod,
      status: "confirmed"
    };
  }

  function ensureDemandEntry(db, dateKey) {
    let existing = db.demand.find((item) => item.date === dateKey);

    if (!existing) {
      existing = {
        date: dateKey,
        value: 0
      };
      db.demand.push(existing);
      db.demand.sort((a, b) => compareDateKeys(a.date, b.date));
    }

    return existing;
  }

  function updateDemandCounter(db, dateKey, delta) {
    if (!isValidDateKey(dateKey)) {
      return;
    }

    const entry = ensureDemandEntry(db, dateKey);
    entry.value = Math.max(0, entry.value + delta);
  }

  function ensureReservationSlotBooked(db) {
    if (!db.nextReservation) {
      return;
    }

    const { date, time } = db.nextReservation;

    if (!db.bookedSlots[date]) {
      db.bookedSlots[date] = [];
    }

    if (!db.bookedSlots[date].includes(time)) {
      db.bookedSlots[date].push(time);
      db.bookedSlots[date].sort();
    }
  }

  function removeBookedSlot(db, dateKey, time) {
    if (!db.bookedSlots[dateKey]) {
      return;
    }

    db.bookedSlots[dateKey] = db.bookedSlots[dateKey].filter((slot) => slot !== time);

    if (!db.bookedSlots[dateKey].length) {
      delete db.bookedSlots[dateKey];
    }
  }

  function sanitizeDatabase(rawData) {
    const settings = {
      availableHours: sanitizeHours(rawData?.settings?.availableHours),
      slotDurationMinutes:
        Number(rawData?.settings?.slotDurationMinutes) > 0
          ? Number(rawData.settings.slotDurationMinutes)
          : 60,
      pricePerSlot:
        Number(rawData?.settings?.pricePerSlot) >= 0
          ? Number(rawData.settings.pricePerSlot)
          : 4,
      defaultMachine:
        typeof rawData?.settings?.defaultMachine === "string" && rawData.settings.defaultMachine.trim()
          ? rawData.settings.defaultMachine.trim()
          : "Machine L1",
      defaultPaymentMethod:
        ["card", "cash", "qr"].includes(rawData?.settings?.defaultPaymentMethod)
          ? rawData.settings.defaultPaymentMethod
          : "card"
    };

    const db = {
      settings,
      nextReservation: null,
      demand: sanitizeDemand(rawData?.demand),
      bookedSlots: sanitizeBookedSlots(rawData?.bookedSlots, settings.availableHours),
      history: sanitizeHistory(rawData?.history)
    };

    db.nextReservation = sanitizeNextReservation(rawData?.nextReservation, settings);
    ensureReservationSlotBooked(db);

    return db;
  }

  async function loadSeedData() {
    try {
      const response = await fetch(JSON_PATH);

      if (!response.ok) {
        throw new Error("Unable to load reservations seed data");
      }

      return await response.json();
    } catch (error) {
      return {
        settings: {
          availableHours: DEFAULT_HOURS,
          slotDurationMinutes: 60,
          pricePerSlot: 4,
          defaultMachine: "Machine L1",
          defaultPaymentMethod: "card"
        },
        nextReservation: null,
        demand: buildFallbackDemand(),
        bookedSlots: {},
        history: []
      };
    }
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
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
        const storedData = loadFromStorage();
        const source = storedData || await loadSeedData();
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

  async function reserveSlot(dateKey, time) {
    await init();

    if (!isValidDateKey(dateKey) || !dbCache.settings.availableHours.includes(time)) {
      return {
        ok: false,
        message: "Créneau invalide."
      };
    }

    if (!isFutureSlot(dateKey, time)) {
      return {
        ok: false,
        message: "Impossible de réserver un créneau passé."
      };
    }

    const currentBooked = dbCache.bookedSlots[dateKey] || [];

    if (currentBooked.includes(time)) {
      return {
        ok: false,
        message: "Ce créneau est déjà pris."
      };
    }

    if (
      dbCache.nextReservation &&
      dbCache.nextReservation.date === dateKey &&
      dbCache.nextReservation.time === time
    ) {
      return {
        ok: true
      };
    }

    if (dbCache.nextReservation) {
      removeBookedSlot(dbCache, dbCache.nextReservation.date, dbCache.nextReservation.time);
      updateDemandCounter(dbCache, dbCache.nextReservation.date, -1);
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

    updateDemandCounter(dbCache, dateKey, 1);
    persist();

    return {
      ok: true
    };
  }

  async function cancelNextReservation() {
    await init();

    if (!dbCache.nextReservation) {
      return {
        ok: false,
        message: "Aucune réservation active."
      };
    }

    const reservation = dbCache.nextReservation;

    removeBookedSlot(dbCache, reservation.date, reservation.time);
    updateDemandCounter(dbCache, reservation.date, -1);
    dbCache.nextReservation = null;

    persist();

    return {
      ok: true
    };
  }

  async function resetFromSeed() {
    const seed = await loadSeedData();
    dbCache = sanitizeDatabase(seed);
    persist();
    return deepClone(dbCache);
  }

  return {
    init,
    getReservationsData,
    getTimeSlotsForDate,
    reserveSlot,
    cancelNextReservation,
    resetFromSeed
  };
})();