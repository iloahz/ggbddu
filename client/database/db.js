import util from '../base/util.js';

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
    .catch(console.log);
}

/**
 * @param {Date} datetime
 * @param {string} note
 * @param {string} photo - cloud id of the photo
 * @param {number} longitude
 * @param {number} latitude
 * @param {string} locationName
 */
function addOrUpdateRecord(datetime, note, photo, longitude, latitude, locationName) {
  const yyyy = datetime.getFullYear();
  const mm = String(datetime.getMonth() + 1).padStart(2, '0');
  const dd = String(datetime.getDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}`;
  const data = {
    data: {
      datetime: datetime,
      dateString: dateString,
      note: note,
      photo: photo,
      location: locationName ? db.Geo.Point(longitude, latitude) : null,
      locationName: locationName
    }
  };
  return getRecords({ dateString })
    .then(result => {
      if (result.length > 0) {
        // doc.set will lose timezone info, so use remove for now.
        // https://developers.weixin.qq.com/community/develop/doc/00026211d60bb870eee789e9656000
        return records.doc(result[0]['_id']).remove();
      }
    })
    .then(() => {
      return records.add(data);
    });
}

export default {
  getRecords,
  addOrUpdateRecord,
  getStatOfCurrentYear
};
