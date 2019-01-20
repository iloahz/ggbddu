const cloud = require('wx-server-sdk');

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.limit.html
const LIMIT_MAX = 100;

cloud.init();
const db = cloud.database();
const records = db.collection('records');
const _ = db.command;

/**
 * Stat is an array of simple object { datetime }.
 * The result must be sorted.
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  const year = event.year;
  // due to timezone issue, extend 1 day at beginning and end.
  const datetimeMin = new Date(year - 1, 11, 31, 0, 0, 0, 0);
  const datetimeMax = new Date(year + 1, 0, 1, 23, 59, 59, 999);
  const query = {
    _openid: openId,
    datetime: _.gte(datetimeMin).and(_.lte(datetimeMax))
  };
  let stats = [];
  let currentOffset = 0;
  // TODO: send all requests together rather than 1 by 1.
  while (1) {
    const chunk = await records
      .orderBy('datetime', 'asc')
      .where(query)
      .skip(currentOffset)
      .limit(LIMIT_MAX)
      .get();
    stats = stats
      .concat(chunk.data.map(record => {
        return {
          datetime: record.datetime,
          hasNote: !!record.note,
          hasPhoto: !!record.photo,
          hasLocation: !!record.location
        };
      }));
    if (chunk.data.length < LIMIT_MAX) break;
    currentOffset += chunk.data.length;
  }
  return stats;
}
