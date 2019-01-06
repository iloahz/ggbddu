import util from '../../base/util.js'

Page({

  /**
   * Page initial data
   */
  data: {
    hasUserInfoScope: false,
    dateText: '',
    timeText: '',
    location: null,
    locationText: '万柳海淀区纪检委(长春桥路北)',
    photoUrl: '/images/placeholder.png',
    submitButtonText: '吃早饭咯~'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setDateAndTimeText();
    util.checkAuth('scope.userInfo')
      .then(result => {
        this.setData({
          hasUserInfoScope: result
        });
      });
    // this.setInitLocation();
  },

  setDateAndTimeText: function() {
    const d = new Date();
    let minute = d.getMinutes();
    if (minute < 10) minute = '0' + minute;
    this.setData({
      dateText: `${d.getMonth() + 1}月${d.getDate()}日`,
      timeText: `${d.getHours()}:${minute}`
    });
  },

  // Try to fill location without letting user choose.
  setInitLocation: function() {
    util.mustHaveAuth('scope.userLocation')
      .then(() => {
        return util.getLocation({ type: 'gcj02' });
      })
      .then(result => {
        console.log(result);
      });
  },

  onTapLocation: function(e) {
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.setData({
          location: res,
          locationText: res.name
        });
      },
    });
  },

  onTapPhoto: function(e) {
    wx.chooseImage({
      success: (res) => {
        this.setData({
          photoUrl: res.tempFilePaths[0]
        })
      },
    })
  },

  onTapSubmit: function(e) {
    util.getUserInfo()
      .then(console.log)
  },

  onTapGetUserInfo: function(e) {
    console.log(e)
  }
})