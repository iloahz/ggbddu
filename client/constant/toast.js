const Toast = {};

Toast.NO_MODIFY_DATE = {
  title: '暂不允许修改时间，请即时记录。',
    icon: 'none',
      duration: 1500
};

Toast.UPLOADING_PHOTO = {
  title: '正在上传照片',
  icon: 'loading',
  duration: 666666
};

Toast.UPLOADING_RECORD = {
  title: '正在上传记录',
  icon: 'loading',
  duration: 666666
};

Toast.DELETING_RECORD = {
  title: '正在删除记录',
  icon: 'loading',
  duration: 666666
};

Toast.UPLOAD_SUCCESS = {
  title: '记录成功！',
  icon: 'success',
  duration: 1000
};

Toast.DELETE_SUCCESS = {
  title: '删除成功！',
  icon: 'success',
  duration: 1000
};

Toast.UPLOAD_ERROR = {
  title: '抱歉，出了一点状况，请稍后再试。',
  icon: 'none',
  duration: 1000
};

Toast.STAT_PULLDOWN_REFRESH_SUCCESS = {
  title: '更新成功！',
  icon: 'success',
  duration: 1000
};

Toast.STAT_PULLDOWN_REFRESH_ERROR = {
  title: '获取数据失败，请稍后重试。',
  icon: 'none',
  duration: 1000
};

export default Toast;
