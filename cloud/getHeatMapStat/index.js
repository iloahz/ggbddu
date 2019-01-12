const cloud = require('wx-server-sdk');

// https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-server-api/database/collection.limit.html
const LIMIT_MAX = 100;

cloud.init();
const db = cloud.database();
const records = db.collection('records');
const _ = db.command;

/**
 * Stat is an array of simple object { datetime }.
 * TODO: respect event.region
 */
exports.main = async (event, context) => {
  const query = {
    dateString: event.dateString,
    location: _.neq(null)
  };
  let stats = [];
  let currentOffset = 0;
  // TODO: send all requests together rather than 1 by 1.
  while (1) {
    const chunk = await records
      .where(query)
      .skip(currentOffset)
      .limit(LIMIT_MAX)
      .get();
    stats = stats
      .concat(chunk.data.map(record => ({
        datetime: record.datetime,
        location: record.location
      })));
    if (chunk.data.length < LIMIT_MAX) break;
    currentOffset += chunk.data.length;
  }
  return stats;
}
