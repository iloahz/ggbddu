function promisify(func, onSuccess = 'success', onFail = 'fail') {
  return obj => {
    return new Promise((resolve, reject) => {
      const options = Object.assign(obj || {}, {
          [onSuccess]: resolve,
          [onFail]: reject
      });
      func(options);
    });
  }
}

export default promisify;
