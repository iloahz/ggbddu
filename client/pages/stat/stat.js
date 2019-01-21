import CONSTANT from '../../constant/constant.js';
import TOAST from '../../constant/toast.js';
import LEVEL from '../../constant/level.js';

import util from '../../base/util.js';
import db from '../../database/db.js';
import functions from '../../base/functions.js';
import gg from '../../base/gg.js';

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
    dayNames: CONSTANT.DAY_NAME,
    months: [],

    currentMonthId: ''
  },

  createStars: function(stat) {
    const d = new Date();
    const currentYear = d.getFullYear();
    const currentMonth = d.getMonth();
    const currentDate = d.getDate();
    const months = [];
    let nextRecordIndex = 0;
    for (let mm = 0; mm < 12; mm++) {
      const month = {
        name: CONSTANT.MONTH_NAME[mm],
        id: `month-${mm}`,
        stars: []
      };
      const monthFirstDay = new Date(currentYear, mm, 1).getDay();
      let currentDay = 1;
      while (currentDay != monthFirstDay) {
        month.stars.push({
          cssClass: 'empty'
        });
        currentDay = currentDay < 6 ? currentDay + 1 : 0;
      }
      for (let dd = 1; dd <= CONSTANT.DAYS_IN_MONTH[mm]; dd++) {
        if (util.cmpPair(mm, dd, currentMonth, currentDate) > 0) {
          month.stars.push({
            cssClass: 'future-date',
            dateText: dd
          });
          continue;
        }
        let level = LEVEL.Didnt;
        let hasNote = false;
        let hasPhoto = false;
        let hasLocation = false;
        while (nextRecordIndex < stat.length) {
          const nextRecord = stat[nextRecordIndex];
          const cmpResult = util.cmpPair(mm, dd, nextRecord.datetime.getMonth(), nextRecord.datetime.getDate());
          if (cmpResult < 0) break;
          if (cmpResult == 0) {
            level = util.datetimeToLevel(nextRecord.datetime);
            hasNote = nextRecord.hasNote;
            hasPhoto = nextRecord.hasPhoto;
            hasLocation = nextRecord.hasLocation;
          }
          nextRecordIndex += 1;
        }
        const star = {
          cssClass: LevelCssClass[level],
          hasNote: hasNote,
          hasPhoto: hasPhoto,
          hasLocation: hasLocation,
          dateText: dd
        };
        if (util.cmpPair(mm, dd, currentMonth, currentDate) == 0) {
          star.isToday = true;
        }
        month.stars.push(star);
      }
      months.push(month);
    }
    this.setData({
      months: months,
      currentMonthId: `month-${currentMonth}`
    });
  },

  refreshData: function() {
    return db.getStatOfCurrentYear()
      .then(stat => this.createStars(stat));
  },

  onLoad: function(options) {
    // for initial load, only show toast for errors.
    // this is different from pulldown refresh, which 
    // show toast for both success and errors.
    this.refreshData()
      .catch(() => util.showToast(TOAST.STAT_PULLDOWN_REFRESH_ERROR));
  },

  onShow: function (e) {
    if (gg.lastRecordTime > gg.lastStatUpdateTime) {
      this.refreshData()
        .catch(() => util.showToast(TOAST.STAT_PULLDOWN_REFRESH_ERROR));
    }
  },

  onPullDownRefresh: function() {
    this.refreshData()
      .then(() => util.stopPullDownRefresh())
      .then(() => util.showToast(TOAST.STAT_PULLDOWN_REFRESH_SUCCESS))
      .catch(() => {
        util.stopPullDownRefresh()
          .then(() => util.showToast(TOAST.STAT_PULLDOWN_REFRESH_ERROR));
      });
  }
})
