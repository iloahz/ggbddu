function isLeapYear() {
  const year = new Date().getFullYear();
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

const DAYS_IN_MONTH = [
  31, isLeapYear() ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
];

const DAY_NAME = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '日',
];

const MONTH_NAME = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月'
];

export default {
  DAYS_IN_MONTH,
  DAY_NAME,
  MONTH_NAME
}