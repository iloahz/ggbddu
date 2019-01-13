const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const records = db.collection('records');
const _ = db.command;

async function getCurrentUserRecordTime(dateString) {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  const query = {
    _openid: openId,
    dateString: dateString
  };
  console.log(query);
  const result = await records.where(query).get();
  console.log(result);
  if (result.data.length > 0) return result.data[0].datetime;
  return null;
}

async function getCurrentUserRank(dateString) {
  const currentUserRecordTime = await getCurrentUserRecordTime(dateString);
  if (!currentUserRecordTime) return -1;
  const query = {
    dateString: dateString,
    datetime: _.lt(currentUserRecordTime)
  };
  console.log(query);
  const count = await records.where(query).count();
  return count.total + 1;
}

exports.main = async (event, context) => {
  const info = {};
  info.rank = await getCurrentUserRank(event.dateString);
  return info;
}
