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

/**
 * @param {Date} datetime
 * @param {string} note
 * @param {string} photo - cloud id of the photo
 * @param {number} longitude
 * @param {number} latitude
 * @param {string} locationName
 */
function addOrUpdateRecord(datetime, note, photo, longitude, latitude, locationName) {
  const dateString = datetime.toISOString().substr(0, 10);
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
        return records.doc(result[0]['_id']).set(data);
      } else {
        return result.add(data);
      }
    });
}

export default {
  addOrUpdateRecord
};
