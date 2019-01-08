function isLeapYear() {
  const year = new Date().getFullYear();
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

const DAYS_IN_MONTH = [
  31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

export default {
  DAYS_IN_MONTH
}