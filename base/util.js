import promisify from './promisify.js';

const getSetting = promisify(wx.getSetting);
const authorize = promisify(wx.authorize);

function hasAuth(scope) {
  return getSetting()
    .then(res => {
      return !!res.authSetting[scope]
    });
}

function ensureAuth(scope) {
  return hasAuth(scope)
    .then(has => {
      if (!has) {
        return authorize(scope);
      }
    });
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

export default {getUserInfo, hasAuth}