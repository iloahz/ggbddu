function promisify(func, onSuccess = 'success', onFail = 'fail') {
  return obj => {
    return new Promise((resolve, reject) => {
      Object.assign(obj || {}, {
          [onSuccess]: resolve,
          [onFail]: reject
      });
      func(obj);
    });
  }
}

export default promisify;
