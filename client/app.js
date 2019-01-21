import localcache from 'base/localcache.js';

function initWxCloud() {
  wx.cloud.init({
    env: 'ggbddu-43c547',
    traceUser: true
  });
}

initWxCloud();
localcache.init();
