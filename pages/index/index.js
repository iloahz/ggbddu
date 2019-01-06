import util from '../../base/util.js'

Page({

  /**
   * Page initial data
   */
  data: {
    hasUserInfo: true,
    dateText: '',
    location: null,
    locationText: '',
    photoUrl: '/images/placeholder.png',
    submitButtonText: '吃早饭咯！'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    const d = new Date();
    this.setData({
      dateText: `今天是${d.getMonth() + 1}月${d.getDate()}日`
    })
    util.hasAuth('scope.userInfo')
      .then(hasUserInfo => {
        this.setData({
          hasUserInfo: hasUserInfo
        })
      })
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