// GG stands for Ggbddu's Global object.
// Try to make GG a pure data class, don't add any dependencies.
// Let others depend on GG.
class GG {
  constructor() {
    this.userInfo = {};
    this.openId = '';
    this.lastRecordDateString = '';
    this.lastRecordTime = 0;
    this.stat = [];
    this.lastStatUpdateTime = 0;
  }

  toJson() {
    const json = {
      'openId': this.openId,
      'stat': this.stat,
      'lastStatUpdateTime': this.lastStatUpdateTime,
      'lastRecordDateString': this.lastRecordDateString,
      'lastRecordTime': this.lastRecordTime
    };
    return json;
  }

  fromJson(json) {
    if (json.hasOwnProperty('openId')) this.openId = json['openId'];
    if (json.hasOwnProperty('stat')) this.stat = json['stat'];
    if (json.hasOwnProperty('lastStatUpdateTime')) this.lastStatUpdateTime = json['lastStatUpdateTime'];
    if (json.hasOwnProperty('lastRecordDateString')) this.lastRecordDateString = json['lastRecordDateString'];
    if (json.hasOwnProperty('lastRecordTime')) this.lastRecordTime = json['lastRecordTime'];
  }

  static getInstance() {
    if (!GG.instance_) {
      GG.instance_ = new GG();
    }
    return GG.instance_;
  }
}

export default GG.getInstance();