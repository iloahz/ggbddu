import util from '../../base/util.js'

Page({

  /**
   * Page initial data
   */
  data: {
    hasUserInfo: true,
    dateText: '',
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