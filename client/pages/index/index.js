import util from '../../base/util.js';

const INIT_LATITUDE = 39.908823;
const INIT_LONGITUDE = 116.39747;

Page({

  /**
   * Page initial data
   */
  data: {
    hasUserInfoScope: false,
    datetimeText: '',
    location: null,
    locationLatitude: INIT_LATITUDE,
    locationLongitude: INIT_LONGITUDE,
    locationMarkers: [],
    locationText: '',
    photoUrl: '',
    submitButtonText: '吃早饭咯~'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setDatetimeText();
    util.checkAuth('scope.userInfo')
      .then(result => {
        this.setData({
          hasUserInfoScope: result
        });
      });
    // this.setInitLocation();
  },

  setDatetimeText: function() {
    const d = new Date();
    let minute = d.getMinutes();
    if (minute < 10) minute = '0' + minute;
    this.setData({
      datetimeText: `${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${minute}`
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

  onTapDatetime: function(e) {
    util.showToast({
      title: '暂不允许修改时间，请即时记录。',
      icon: 'none',
      duration: 1500
    });
  },

  onTapLocation: function(e) {
    util.chooseLocation()
      .then(result => {
        console.log(result);
        this.setData({
          location: result,
          locationText: result.name,
          locationLatitude: result.latitude,
          locationLongitude: result.longitude,
          locationMarkers: [{
            id: 0,
            latitude: result.latitude,
            longitude: result.longitude,
            title: 'fdafsd',
            iconPath: '/images/location_marker.png'
          }]
        });
      });
  },

  onTapPhoto: function(e) {
    util.chooseImage({count: 1})
      .then(result => {
        this.setData({
          photoUrl: result.tempFilePaths[0]
        });
      });
  },

  onTapSubmit: function(e) {
    wx.cloud.callFunction({
    });
  },

  onTapGetUserInfo: function(e) {
    console.log(e)
  }
})