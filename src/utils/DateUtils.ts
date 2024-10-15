// Helper to parse date from string
export const parseDate = (dateStr: number | string | Date | undefined): Date =>
  dateStr === undefined ? new Date() : new Date(dateStr);

// Helper to format a date as MM/DD/YYYY
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const formatDateWithMonthAndYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};
export const formatDateWithMonthOnly = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long" });
};

export const getStartOfToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set the time to 00:00:00
  return today;
};

export const getStartOfYesterday = (): Date => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
};

export const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // Adjust for Sunday being day 0
  const startOfWeek = new Date(now.setDate(now.getDate() - dayOfWeek + 1));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

export const getStartOfLastWeek = (): { start: Date; end: Date } => {
  const now = new Date();
  const dayOfWeek = now.getDay() || 7; // Adjust for Sunday being day 0
  const startOfLastWeek = new Date(now.setDate(now.getDate() - dayOfWeek - 6));
  const endOfLastWeek = new Date(now.setDate(now.getDate() + 6));
  startOfLastWeek.setHours(0, 0, 0, 0);
  endOfLastWeek.setHours(23, 59, 59, 999);
  return { start: startOfLastWeek, end: endOfLastWeek };
};

export const getStartOfMonth = (): Date => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  return startOfMonth;
};

export const getStartOfLastMonth = (): { start: Date; end: Date } => {
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  return { start: startOfLastMonth, end: endOfLastMonth };
};

export const getStartOfYear = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
};

export const getStartOfLastYear = (): { start: Date; end: Date } => {
  const now = new Date();
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(
    now.getFullYear() - 1,
    11,
    31,
    23,
    59,
    59,
    999
  );
  return { start: startOfLastYear, end: endOfLastYear };
};

export function getDay(date: number) {
  let day = "";
  const itemDate = parseDate(date);
  const today = getStartOfToday();
  const yesterday = getStartOfYesterday();

  if (itemDate >= today) {
    day = "Today";
  } else if (itemDate >= yesterday && itemDate < today) {
    day = "Yesterday";
  } else {
    day = formatDate(itemDate); // Use full date like MM/DD/YYYY
  }
  return day;
}

export function getMonth(date: number) {
  let month = "";
  const itemDate = parseDate(date);
  const now = new Date();

  if (itemDate.getFullYear() === now.getFullYear()) {
    month = formatDateWithMonthOnly(itemDate);
  } else {
    month = formatDateWithMonthAndYear(itemDate);
  }
  return month;
}

export function getYear(date: number) {
  const itemDate = parseDate(date);

  return itemDate.getFullYear().toString();
}
