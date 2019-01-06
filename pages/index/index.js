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
    locationText: '',
    photoUrl: '/images/placeholder.png',
    submitButtonText: '吃早饭咯！'
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
    this.setData({
      dateText: `${d.getMonth() + 1}月${d.getDate()}日`,
      timeText: `${d.getHours()}:${d.getMinutes()}`
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