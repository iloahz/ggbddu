import promisify from './promisify.js';

const authorize = promisify(wx.authorize);
const getSetting = promisify(wx.getSetting);
const getLocation = promisify(wx.getLocation);
const chooseLocation = promisify(wx.chooseLocation);

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
  return ifHasAuth(scope).catch(authorize);
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

export default {
  // wrappers for wx. functions
  getUserInfo,
  getLocation,
  chooseLocation,

  // helper functions
  mustHaveAuth,
  checkAuth
};