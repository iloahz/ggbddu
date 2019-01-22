import TOAST from '../../constant/toast.js';
import Record from '../../models/record.js';

import util from '../../base/util.js';
import db from '../../database/db.js';
import gg from '../../base/gg.js';

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
    photoUrl: '',
    hasRecordedToday: false,
    noteText: ''
  },

  datetime: null,
  cloudPhotoUrl: '',

  onLoad: function (options) {
    this.setDatetimeText();
    util.checkAuth('scope.userInfo')
      .then(result => {
        this.setData({
          hasUserInfoScope: result
        });
      });
    this.setInitLocation();
    this.updateLastRecordFromGlobal();
    this.getInitInfoFromCloud();
  },

  updateLastRecordFromGlobal: function() {
    // TODO: don't update from global after user have interacted.
    const record = gg.lastRecord;
    const updateData = {
      hasRecordedToday: record.dateString == util.getDateString()
    };
    if (updateData.hasRecordedToday) {
      updateData.photoUrl = record.photo;
      this.cloudPhotoUrl = record.photo;
      updateData.noteText = this.data.noteText || record.note;
      if (record.locationName) {
        updateData.locationText = record.locationName;
        updateData.locationLongitude = record.locationLongitude;
        updateData.locationLatitude = record.locationLatitude;
        updateData.locationMarkers = [{
          id: 0,
          longitude: updateData.locationLongitude,
          latitude: updateData.locationLatitude,
          iconPath: '/images/location_marker.png',
          width: 36,
          height: 36
        }];
      }
    } else {
      updateData.photoUrl = '';
      this.cloudPhotoUrl = '';
      updateData.noteText = '';
      updateData.locationText = '';
      updateData.locationLongitude = INIT_LONGITUDE;
      updateData.locationLatitude = INIT_LATITUDE;
      updateData.locationMarkers = [];
    }
    this.setData(updateData);
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

  getInitInfoFromCloud: function() {
    return db.getInitInfo()
      .then(() => this.updateLastRecordFromGlobal());
  },

  onNoteInput: function(e) {
    this.setData({
      noteText: e.detail.value
    });
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
      })
      .catch(() => {
        // user cancels, just ignore.
      });
  },

  calcCloudPhotoPath: function() {
    return util.getOpenId()
      .then(openId => {
        const d = new Date();
        const fileExtension = this.data.photoUrl.substr(this.data.photoUrl.lastIndexOf('.'));
        return `photos/${openId}/${d.getFullYear()}.${d.getMonth() + 1}/${d.getDate()}${fileExtension}`;
      });
  },

  uploadPhotoIfExist: function() {
    if (!this.data.photoUrl) return Promise.resolve();
    if (this.data.photoUrl == gg.lastRecord.photo) return Promise.resolve();
    return this.calcCloudPhotoPath()
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
    return db.addOrUpdateRecord(Record.build(
      this.date,
      this.data.noteText,
      this.cloudPhotoUrl,
      this.data.locationLongitude,
      this.data.locationLatitude,
      this.data.locationText
    ));
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
      .then(() => this.updateLastRecordFromGlobal())
      .catch(e => {
        console.log(e);
        util.showToast(TOAST.UPLOAD_ERROR)
      });
  },

  onTapDelete: function(e) {
    util.showToast(TOAST.DELETING_RECORD)
      .then(() => db.deleteRecord(gg.lastRecord.dateString))
      .then(() => util.showToast(TOAST.DELETE_SUCCESS))
      .then(() => util.delay(TOAST.DELETE_SUCCESS.duration))
      .then(() => wx.switchTab({ url: '/pages/stat/stat' }))
      .then(() => this.updateLastRecordFromGlobal())
      .catch(util.logAndThrow)
      .catch(() => util.showToast(TOAST.UPLOAD_ERROR));
  },

  onTapGetUserInfo: function(e) {
    console.log(e)
  }
})
