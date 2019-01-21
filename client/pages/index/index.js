import TOAST from '../../constant/toast.js';

import util from '../../base/util.js';
import db from '../../database/db.js';

const INIT_LATITUDE = 39.908823;
const INIT_LONGITUDE = 116.39747;

Page({

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
  noteText: '',

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
    this.date = new Date();
    const mm = this.date.getMonth() + 1;
    const dd = this.date.getDate();
    const hh = this.date.getHours();
    const minute = String(this.date.getMinutes()).padStart(2, '0');
    this.setData({
      datetimeText: `${mm}月${dd}日 ${hh}:${minute}`
    });
  },

  // Try to fill location without letting user choose.
  setInitLocation: function() {
    util.mustHaveAuth('scope.userLocation')
      .then(() => {
        return util.getLocation({ type: 'gcj02' });
      })
      .then(result => {
      })
      .catch(console.log);
  },

  onNoteInput: function(e) {
    this.noteText = e.detail.value;
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
      this.noteText,
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
      .then(() => util.delay(TOAST.UPLOAD_SUCCESS.duration))
      .then(() => wx.switchTab({ url: '/pages/stat/stat' }))
      .catch(e => {
        console.log(e);
        util.showToast(TOAST.UPLOAD_ERROR)
      });
  },

  onTapGetUserInfo: function(e) {
    console.log(e)
  }
})