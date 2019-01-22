import util from '../base/util.js';

class Record {
  constructor() {
  }

  /**
   * @param {Date} datetime
   * @param {string} note
   * @param {string} photo - cloud id of the photo
   * @param {number} longitude
   * @param {number} latitude
   * @param {string} locationName
   * @return {Record}
   */
  static build(datetime, note, photo, longitude, latitude, locationName) {
    const record = new Record();
    record.datetime = datetime;
    record.dateString = util.getDateString(datetime);
    record.note = note;
    record.photo = photo;
    record.locationLongitude = longitude;
    record.locationLatitude = latitude;
    record.locationName = locationName;
    return record;
  }

  static buildFromJson(json) {
    const record = new Record();
    record.datetime = new Date(json['datetime']);
    record.dateString = json['dateString'];
    record.note = json['note'];
    record.photo = json['photo'];
    record.locationLongitude = json['locationLongitude'];
    record.locationLatitude = json['locationLatitude'];
    record.locationName = json['locationName'];
    return record;
  }

  static buildFromCloudPayload(payload) {
    const record = new Record();
    record.datetime = new Date(payload['datetime']);
    record.dateString = payload['dateString'];
    record.note = payload['note'];
    record.photo = payload['photo'];
    if (payload['location']) {
      record.locationLongitude = payload['location']['coordinates'][0];
      record.locationLatitude = payload['location']['coordinates'][1];
    }
    record.locationName = payload['locationName'];
    return record;
  }

  generateCloudPayload() {
    const db = wx.cloud.database();
    return {
      data: {
        datetime: this.datetime,
        dateString: this.dateString,
        note: this.note,
        photo: this.photo,
        location: this.locationName ? db.Geo.Point(this.locationLongitude, this.locationLatitude) : null,
        locationName: this.locationName
      }
    };
  }
}

Record.prototype.datetime = null;
Record.prototype.dateString = '';
Record.prototype.note = '';
Record.prototype.photo = '';
Record.prototype.locationLongitude = 0;
Record.prototype.locationLatitude = 0;
Record.prototype.locationName = '';

export default Record;