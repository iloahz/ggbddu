import { Event } from '../base/polyfill/index.js';
import EventType from '../constant/eventtype.js';
import Record from '../models/record.js';

import util from '../base/util.js';
import gg from '../base/gg.js';
import radio from '../base/radio.js';

const db = wx.cloud.database();
const records = db.collection('records');

const DEFAULT_LIMIT = 16;

function getRecords(filters) {
  return util.getOpenId()
    .then(openId => {
      return records
        .where(Object.assign({
          _openid: openId
        }, filters))
        .limit(DEFAULT_LIMIT)
        .get()
        .then(result => result.data);
    });
}

function getStatOfCurrentYear() {
  const year = new Date().getFullYear();
  return wx.cloud.callFunction({
    name: 'getStat',
    data: { year: year }
  })
    .then(result => {
      return result['result'].map(record => {
        return Object.assign(record, {
          datetime: new Date(record.datetime)
        });
      });
    })
    .then(stat => {
      radio.broadcast(new Event(EventType.GET_STAT_SUCCESS, {
        detail: {
          stat: stat
        }
      }));
      return stat;
    });
}

/**
 * @param {Record} record
 * @return {Promise<undefined>}
 */
function addOrUpdateRecord(record) {
  return getRecords({ dateString: record.dateString })
    .then(result => {
      if (result.length > 0) {
        // doc.set will lose timezone info, so use remove for now.
        // https://developers.weixin.qq.com/community/develop/doc/00026211d60bb870eee789e9656000
        return records.doc(result[0]['_id']).remove();
      }
    })
    .then(() => {
      return records.add(record.generateCloudPayload());
    })
    .then(() => {
      radio.broadcast(new Event(EventType.RECORD_UPLOAD_SUCCESS, {
        detail: { record }
      }));
    });
}

function deleteRecord(dateString) {
  console.info('deleting record for:', dateString);
  return getRecords({ dateString })
    .then(result => {
      if (result.length > 0 && result[0]['dateString'] == dateString) {
        return records.doc(result[0]['_id']).remove();
      }
    })
    .then(() => {
      radio.broadcast(new Event(EventType.RECORD_DELETE_SUCCESS, {
        detail: { dateString }
      }));
    });
}

function getExploreInfo() {
  const dateString = util.getDateString();
  return wx.cloud.callFunction({
    name: 'getExploreInfo',
    data: {
      'dateString': dateString
    }
  })
    .then(result => {
      return result['result'];
    });
}

function getHeatMapStat(region) {
  const dateString = util.getDateString();
  return wx.cloud.callFunction({
    name: 'getHeatMapStat',
    data: {
      'region': region,
      'dateString': dateString
    }
  })
    .then(result => {
      return result['result'].map(record => {
        return Object.assign(record, {
          datetime: new Date(record.datetime)
        });
      });
    });
}


function getInitInfo() {
  console.info('db.getInitInfo');
  return wx.cloud.callFunction({
    name: 'getInitInfo',
    data: {}
  })
    .then(result => {
      console.info('db.getInitInfo result:', result);
      const data = result['result'];
      gg.openId = data['openid'];
      radio.broadcast(new Event(EventType.RECORD_UPLOAD_SUCCESS, {
        detail: {
          record: Record.buildFromCloudPayload(data['lastRecord'])
        }
      }));
    });
}

export default {
  getRecords,
  addOrUpdateRecord,
  getStatOfCurrentYear,
  getExploreInfo,
  getHeatMapStat,
  deleteRecord,
  getInitInfo
};
