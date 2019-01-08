import constant from '../../constant/constant.js';

const Level = {
  Didnt:        0,
  PrettyEarly:  1,
  Early:        2,
  Normal:       3,
  Late:         4,
  PrettyLate:   5,
  FutureDate:   6
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
    records: [],
    stars: []
  },

  loadRecords: function() {
    return Promise.resolve();
  },

  createStars: function() {
    const sortedRecords = [].concat(this.data.records).sort((a, b) => a.dateString < b.dateString);
    const stars = [];
    const d = new Date();
    const currentMonth = d.getMonth() + 2;
    const currentDate = d.getDate();
    for (let mm = 0;mm < 12;mm++) {
      for (let dd = 0;dd < constant.DAYS_IN_MONTH[mm];dd++) {
        let level = Math.floor(Math.random() * 6);
        if (mm > currentMonth || (mm == currentMonth && dd >= currentDate)) {
          level = Level.FutureDate;
        }
        stars.push({
          cssClass: LevelCssClass[level]
        });
      }
    }
    this.setData({
      stars: stars
    });
  },

  onLoad: function (options) {
    this.loadRecords()
      .then(() => this.createStars());
  },

  onShow: function () {

  }
})