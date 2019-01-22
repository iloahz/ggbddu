import promisify from './promisify.js';
import gg from './gg.js';
import functions from './functions.js';
import LEVEL from '../constant/level.js';

const authorize = promisify(wx.authorize);
const getSetting = promisify(wx.getSetting);
const getLocation = promisify(wx.getLocation);
const chooseLocation = promisify(wx.chooseLocation);
const chooseImage = promisify(wx.chooseImage);
const showToast = promisify(wx.showToast);
const hideToast = promisify(wx.hideToast);
const startPullDownRefresh = promisify(wx.startPullDownRefresh);
const stopPullDownRefresh = promisify(wx.stopPullDownRefresh);
const getRegion = (mapContext, ...args) => promisify(mapContext.getRegion)(...args);

function cmpPair(x1, y1, x2, y2) {
  if (x1 < x2) return -1;
  else if (x1 > x2) return 1;
  else if (y1 < y2) return -1;
  else if (y1 > y2) return 1;
  else return 0;
}

function datetimeToLevel(datetime) {
  const hour = datetime.getHours();
  const minute = datetime.getMinutes();
  if (cmpPair(hour, minute, 7, 30) < 0) return LEVEL.PrettyEarly;
  else if (cmpPair(hour, minute, 8, 0) < 0) return LEVEL.Early;
  else if (cmpPair(hour, minute, 9, 0) < 0) return LEVEL.Normal;
  else if (cmpPair(hour, minute, 9, 30) < 0) return LEVEL.Late;
  else return LEVEL.PrettyLate;
}

function mustHaveAuth(scope) {
  return getSetting()
    .then(res => {
      if (!res.authSetting[scope]) {
        throw scope;
      }
      return scope;
    });
}

function checkAuth(scope) {
  return getSetting()
    .then(res => {
      return !!res.authSetting[scope];
    });
}

function ensureAuth(scope) {
  return mustHaveAuth(scope).catch(authorize);
}

function getUserInfo(options) {
  return ensureAuth('scope.userInfo')
    .then(() => {
      return new Promise((resolve, reject) => {
        const newOptions = Object.assign({}, options, {
          success: resolve,
          fail: reject
        })
        wx.getUserInfo(newOptions)
      })
    })
}

function getOpenId() {
  if (gg.openId) return Promise.resolve(gg.openId);
  return wx.cloud.callFunction({
    name: 'getInitInfo',
    data: {}
  })
    .then(result => {
      return gg.openId = result['result']['openid'];
    });
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function getDateString(datetime) {
  datetime = datetime || new Date();
  const yyyy = datetime.getFullYear();
  const mm = String(datetime.getMonth() + 1).padStart(2, '0');
  const dd = String(datetime.getDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}`;
  return dateString;
}

export default {
  // wrappers for wx. functions
  getUserInfo,
  getLocation,
  chooseLocation,
  chooseImage,
  showToast,
  hideToast,
  startPullDownRefresh,
  stopPullDownRefresh,
  getRegion,

  // helper functions
  mustHaveAuth,
  checkAuth,
  getOpenId,
  delay,
  getDateString,
  cmpPair,
  datetimeToLevel,

  // functions
  logAndThen: functions.logAndThen,
  logAndThrow: functions.logAndThrow
};
