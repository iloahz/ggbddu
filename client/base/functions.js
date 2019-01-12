function nullFunction() {
}

function logAndThen(val) {
  console.log(val);
  return val;
}

function logAndThrow(error) {
  console.log(error);
  throw error;
}

export default {
  nullFunction,
  logAndThen,
  logAndThrow
}