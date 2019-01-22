import Record from '../models/record.js';

// GG stands for Ggbddu's Global object.
// Try to make GG a pure data class, don't add any dependencies.
// Let others depend on GG.
class GG {
  constructor() {
    this.userInfo = {};
    this.openId = '';
    this.lastRecord = null;
    this.lastRecordUpdateTime = 0;
    this.stat = [];
    this.lastStatUpdateTime = 0;
  }

  toJson() {
    const json = {
      'openId': this.openId,
      'stat': this.stat,
      'lastStatUpdateTime': this.lastStatUpdateTime,
      'lastRecord': this.lastRecord,
      'lastRecordUpdateTime': this.lastRecordUpdateTime
    };
    return json;
  }

  fromJson(json) {
    if (json.hasOwnProperty('openId')) this.openId = json['openId'];
    if (json.hasOwnProperty('stat')) this.stat = json['stat'];
    if (json.hasOwnProperty('lastStatUpdateTime')) this.lastStatUpdateTime = json['lastStatUpdateTime'];
    if (json.hasOwnProperty('lastRecord')) this.lastRecord = Record.buildFromJson(json['lastRecord']);
    if (json.hasOwnProperty('lastRecordUpdateTime')) this.lastRecordUpdateTime = json['lastRecordUpdateTime'];
  }

  static getInstance() {
    if (!GG.instance_) {
      GG.instance_ = new GG();
    }
    return GG.instance_;
  }
}

/** @type {Record} */
GG.prototype.lastRecord = null;

export default GG.getInstance();