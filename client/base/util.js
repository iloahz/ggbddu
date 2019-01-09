import promisify from './promisify.js';
import gg from './gg.js';

const authorize = promisify(wx.authorize);
const getSetting = promisify(wx.getSetting);
const getLocation = promisify(wx.getLocation);
const chooseLocation = promisify(wx.chooseLocation);
const chooseImage = promisify(wx.chooseImage);
const showToast = promisify(wx.showToast);
const hideToast = promisify(wx.hideToast);
const startPullDownRefresh = promisify(wx.startPullDownRefresh);
const stopPullDownRefresh = promisify(wx.stopPullDownRefresh);

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

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
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

  // helper functions
  mustHaveAuth,
  checkAuth,
  getOpenId,
  timeout
};