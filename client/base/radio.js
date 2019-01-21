import {EventTarget} from './polyfill/index.js';

// I named this GlobalEventBus before, but it feels so boring, so.
class Radio {

  constructor() {
    this.eventTarget = new EventTarget();
  }

  broadcast(event) {
    this.eventTarget.dispatchEvent(event);
  }

  onBroadcast(type, callback) {
    this.eventTarget.addEventListener(type, callback);
  }

  offBroadcast(type, callback) {
    this.eventTarget.removeEventListener(type, callback);
  }

  static getInstance() {
    if (!Radio.instance_) {
      Radio.instance_ = new Radio();
    }
    return Radio.instance_;
  }
}

export default Radio.getInstance();
