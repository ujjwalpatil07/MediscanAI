const normalize = (str) => str?.toString().trim().toLowerCase();


const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];


export const generateTimeSlots = (start, end) => {
  if (!start || !end) return [];

  const parseTime = (time) => {
    const [h, m] = time.split(":").map(Number);
    return { h: h || 0, m: m || 0 };
  };

  const slots = [];

  let { h: currentHour, m: currentMinute } = parseTime(start);
  const { h: endHour, m: endMinute } = parseTime(end);

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const ampm = currentHour >= 12 ? "PM" : "AM";
    const displayHour = currentHour % 12 || 12;
    const minuteStr = currentMinute.toString().padStart(2, "0");

    slots.push({
      value: `${currentHour.toString().padStart(2, "0")}:${minuteStr}`,
      display: `${displayHour}:${minuteStr} ${ampm}`,
    });

    currentMinute += 30;

    if (currentMinute >= 60) {
      currentHour++;
      currentMinute = 0;
    }
  }

  return slots;
};

export const getAvailableDates = (availableDays = []) => {
  const dates = [];
  const today = new Date();

  // normalize doctor input
  const normalizedDays = availableDays.map(normalize);

  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);

    const dayName = normalize(DAY_NAMES[date.getDay()]);

    if (normalizedDays.includes(dayName)) {
      dates.push(date);
    }
  }

  return dates;
};

export const formatDate = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatDateAPI = (date) => {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
};