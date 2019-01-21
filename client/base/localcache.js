import gg from './gg.js';
import radio from './radio.js';
import EventType from '../constant/eventtype.js';

const GG_KEY = 'gg';

function loadFromLocalStorage() {
  const data = wx.getStorageSync(GG_KEY);
  if (!data) return;
  const json = JSON.parse(data);
  gg.fromJson(json);
}

function saveToLocalStorage() {
  const json = gg.toJson();
  const data = JSON.stringify(json);
  wx.setStorageSync(GG_KEY, data);
}

function onRecordUploadSuccess(event) {
  console.log(event);
  const record = event.detail.record;
  gg.lastRecordDateString = record.dateString;
  gg.lastRecordTime = Date.now();
  saveToLocalStorage();
}

function onGetStatSuccess(event) {
  const stat = event.detail.stat;
  gg.stat = stat;
  gg.lastStatUpdateTime = Date.now();
  saveToLocalStorage();
}

function init() {
  loadFromLocalStorage();
  radio.onBroadcast(EventType.RECORD_UPLOAD_SUCCESS, onRecordUploadSuccess);
  radio.onBroadcast(EventType.GET_STAT_SUCCESS, onGetStatSuccess);
}

export default {
  loadFromLocalStorage,
  saveToLocalStorage,

  init
}
