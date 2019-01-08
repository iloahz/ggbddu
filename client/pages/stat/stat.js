import constant from '../../constant/constant.js';
import db from '../../database/db.js';

const Level = {
  Didnt: 0,

  PrettyEarly: 1, // [*,    7:30)
  Early: 2,       // [7:30, 8:00)
  Normal: 3,      // [8:00, 9:00)
  Late: 4,        // [9:00, 9:30)
  PrettyLate: 5,  // [9:30, *]

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

const EmptyStar = {
  cssClass: 'empty'
};

function cmpPair(x1, y1, x2, y2) {
  if (x1 < x2) return -1;
  else if (x1 > x2) return 1;
  else if (y1 < y2) return -1;
  else if (y1 > y2) return 1;
  else return 0;
}

function datetimeToLevel(datetime) {
  const hour = datetime.getHours();
  const minute = datetime.getMinutes();
  if (cmpPair(hour, minute, 7, 30) < 0) return Level.PrettyEarly;
  else if (cmpPair(hour, minute, 8, 0) < 0) return Level.Early;
  else if (cmpPair(hour, minute, 9, 0) < 0) return Level.Normal;
  else if (cmpPair(hour, minute, 9, 30) < 0) return Level.Late;
  else return Level.PrettyLate;
}

Page({

  data: {
    dayNames: constant.DAY_NAME,
    months: []
  },

  stat: [],

  loadRecords: function() {
    return db.getStatOfCurrentYear()
      .then(stat => {
        this.stat = stat;
      });
  },

  createStars: function() {
    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth();
    const currentDate = d.getDate();
    const months = [];
    let nextRecordIndex = 0;
    for (let mm = 0; mm < 12; mm++) {
      const month = {
        name: constant.MONTH_NAME[mm],
        stars: []
      };
      const monthFirstDay = new Date(currentYear, mm, 1).getDay();
      let currentDay = 1;
      while (currentDay != monthFirstDay) {
        month.stars.push(EmptyStar);
        currentDay = currentDay < 6 ? currentDay + 1 : 0;
      }
      for (let dd = 1; dd <= constant.DAYS_IN_MONTH[mm]; dd++) {
        let level = Level.Didnt;
        if (cmpPair(mm, dd, currentMonth, currentDate) > 0) {
          level = Level.FutureDate;
        } else {
          // check the stat
          if (nextRecordIndex >= this.stat.length) {
            level = Level.Didnt;
          } else {
            console.log(this.stat, nextRecordIndex, this.stat[nextRecordIndex]);
            let nextRecordDate = this.stat[nextRecordIndex].datetime;
            while (cmpPair(mm, dd, nextRecordDate.getMonth(), nextRecordDate.getDate()) > 0) {
              nextRecordIndex += 1;
              if (nextRecordIndex >= this.stat.length) break;
              nextRecordDate = this.stat[nextRecordIndex].datetime;
            }
            if (nextRecordIndex < this.stat.length) {
              if (cmpPair(mm, dd, nextRecordDate.getMonth(), nextRecordDate.getDate()) == 0) {
                level = datetimeToLevel(nextRecordDate);
                nextRecordIndex += 1;
              }
            }
          }
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