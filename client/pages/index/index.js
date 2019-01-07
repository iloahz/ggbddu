import util from '../../base/util.js';
import db from '../../database/db.js';
import TOAST from '../../constant/toast.js';

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
    photoUrl: ''
  },

  datetime: null,
  cloudPhotoUrl: '',

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
    this.setInitLocation();
    util.getOpenId();
  },

  setDatetimeText: function() {
    const d = this.date = new Date();
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
      })
      .catch(console.log);
  },

  onTapDatetime: function(e) {
    util.showToast(TOAST.NO_MODIFY_DATE);
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
            iconPath: '/images/location_marker.png',
            width: 36,
            height: 36
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

  getCloudPhotoPath: function() {
    return util.getOpenId()
      .then(openId => {
        const d = new Date();
        const fileExtension = this.data.photoUrl.substr(this.data.photoUrl.lastIndexOf('.'));
        return `photos/${openId}/${d.getFullYear()}.${d.getMonth() + 1}/${d.getDate()}${fileExtension}`;
      });
  },

  uploadPhotoIfExist: function() {
    if (!this.data.photoUrl) return Promise.resolve();
    return this.getCloudPhotoPath()
      .then(cloudPhotoPath => {
        return wx.cloud.uploadFile({
          cloudPath: cloudPhotoPath,
          filePath: this.data.photoUrl
        });
      })
      .then(result => {
        this.cloudPhotoUrl = result['fileID'];
      });
  },

  uploadRecord: function() {
    return db.addOrUpdateRecord(
      this.date,
      '',
      this.cloudPhotoUrl,
      this.data.locationLongitude,
      this.data.locationLatitude,
      this.data.locationText
    );
  },

  onTapSubmit: function(e) {
    Promise.resolve()
      .then(() => util.showToast(TOAST.UPLOADING_PHOTO))
      .then(() => this.uploadPhotoIfExist())
      .then(() => util.showToast(TOAST.UPLOADING_RECORD))
      .then(() => this.uploadRecord())
      .then(() => util.showToast(TOAST.UPLOAD_SUCCESS))
      .catch(e => {
        console.log(e);
        util.showToast(TOAST.UPLOAD_ERROR)
      });
  },

  onTapGetUserInfo: function(e) {
    console.log(e)
  }
})