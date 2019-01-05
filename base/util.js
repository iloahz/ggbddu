function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: resolve,
      fail: reject
    })
  })
}

function hasAuth(scope) {
  return getSetting()
    .then(res => {
      return !!res.authSetting[scope]
    })
}

function authorize(scope) {
  console.log('authorize: ', scope)
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: scope,
      success: resolve,
      fail: reject
    })
  })
}

function ensureAuth(scope) {
  return getSetting()
    .then(res => {
      console.log(res)
      if (!res.authSetting[scope]) {
        return authorize(scope)
      }
    })
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