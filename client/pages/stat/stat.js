import constant from '../../constant/constant.js';

const Level = {
  Didnt: 0,

  PrettyEarly: 1, // [*,     7:30)
  Early: 2, // [7:30,  8:00)
  Normal: 3, // [8:00,  9:00)
  Late: 4, // [9:30,  10:00)
  PrettyLate: 5, // [10:00, *]

  FutureDate: 6
};

const LevelCssClass = [
  'didnt',
  'pretty-early',
  'early',
  'normal',
  'late',
  'pretty-late',
  'future-date'
];

Page({

  data: {
    dayNames: constant.DAY_NAME,
    records: [],
    months: []
  },

  loadRecords: function() {
    return Promise.resolve();
  },

  createStars: function() {
    const sortedRecords = [].concat(this.data.records).sort((a, b) => a.dateString < b.dateString);
    const d = new Date();
    const currentMonth = d.getMonth() + 6;
    const currentDate = d.getDate();
    const months = [];
    for (let mm = 0; mm < 12; mm++) {
      const month = {
        name: constant.MONTH_NAME[mm],
        stars: []
      };
      // Must set date first and then set month.
      // Because when from 3-31 to 4-1, if you first set month to 4,
      // which only has 30 days max, it will translate 4-31 to 5-1.
      d.setDate(1);
      d.setMonth(mm);
      let currentDay = 1;
      while (currentDay != d.getDay()) {
        month.stars.push({
          cssClass: 'empty'
        });
        currentDay = currentDay < 6 ? currentDay + 1 : 0;
      }
      for (let dd = 0; dd < constant.DAYS_IN_MONTH[mm]; dd++) {
        let level = Math.floor(Math.random() * 6);
        if (mm > currentMonth || (mm == currentMonth && dd >= currentDate)) {
          level = Level.FutureDate;
        }
        const star = {
          cssClass: LevelCssClass[level],
        };
        month.stars.push(star);
      }
      months.push(month);
    }
    this.setData({
      months: months
    });
  },

  onLoad: function(options) {
    this.loadRecords()
      .then(() => this.createStars());
  },

  onShow: function() {

  }
})