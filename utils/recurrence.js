// Utilities for recurrence UI + display + payload building

export const weekdayLabels = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 7 },
];

// Build the object that your app will store for each reminder.
// (This is UI-only; you can later map this to actual scheduling logic.)
export function buildRecurrencePayload({ title, priority, mode, interval, selectedDays, time }) {
  const base = {
    title,
    priority, // low | medium | high
    recurrence: { mode }, // shape varies by mode
    // For daily/weekly we save hour/minute for display
    time: {
      hour: time.getHours(),
      minute: time.getMinutes(),
    },
  };

  if (mode === "none") {
    return { ...base, recurrence: { mode: "none" } };
  }

  if (mode === "every_x_minutes") {
    return { ...base, recurrence: { mode, minutes: interval } };
  }

  if (mode === "every_x_hours") {
    return { ...base, recurrence: { mode, hours: interval } };
  }

  if (mode === "daily") {
    return { ...base, recurrence: { mode, hour: base.time.hour, minute: base.time.minute } };
  }

  if (mode === "weekly") {
    return {
      ...base,
      recurrence: {
        mode,
        days: selectedDays, // 1..7 (Mon..Sun)
        hour: base.time.hour,
        minute: base.time.minute,
      },
    };
  }

  return base;
}

// Describe the recurrence for display on the card
export function describeRecurrence(rem) {
  const r = rem.recurrence || { mode: "none" };
  const pad = (n) => String(n).padStart(2, "0");
  const timeStr = (h, m) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hh = ((h + 11) % 12) + 1;
    return `${pad(hh)}:${pad(m)} ${ampm}`;
  };

  switch (r.mode) {
    case "none":
      return "Does not repeat";
    case "every_x_minutes":
      return `Every ${r.minutes} min`;
    case "every_x_hours":
      return `Every ${r.hours} hr`;
    case "daily":
      return `Daily at ${timeStr(r.hour, r.minute)}`;
    case "weekly": {
      const labels = r.days
        .map((d) => weekdayLabels.find((w) => w.value === d)?.label ?? "")
        .filter(Boolean)
        .join(", ");
      return `Weekly (${labels}) at ${timeStr(r.hour, r.minute)}`;
    }
    default:
      return "Custom repeat";
  }
}
