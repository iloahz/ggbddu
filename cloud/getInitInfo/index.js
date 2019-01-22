const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();
const records = db.collection('records');
const _ = db.command;

async function getCurrentUserLastRecord() {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  const query = {
    _openid: openId
  };
  const result = await records.where(query).orderBy('datetime', 'desc').limit(1).get();
  console.log(result);
  if (result.data.length > 0) return result.data[0];
  return {};
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  return {
    openid: wxContext.OPENID,
    lastRecord: await getCurrentUserLastRecord()
  };
};