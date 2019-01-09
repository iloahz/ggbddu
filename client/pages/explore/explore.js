
const INIT_LATITUDE = 39.908823;
const INIT_LONGITUDE = 116.39747;

Page({

  data: {
    circles: []
  },

  onLoad: function (options) {
    const circles = [];
    for (let i = 0;i < 1000;i++) {
      const circle = {
        latitude: INIT_LATITUDE + Math.random() * 0.4 - 0.2,
        longitude: INIT_LONGITUDE + Math.random() * 0.5 - 0.25,
        fillColor: '#EE7077',
        radius: 500
      };
      circles.push(circle);
    }
    this.setData({
      circles: circles
    });
  },

  onReady: function () {

  },

  onShow: function () {

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
})