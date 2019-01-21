// A simplified version from https://developer.mozilla.org/en-US/docs/Web/API/Event
class Event {
  constructor(typeArg, eventInit) {
    this.type = typeArg;

    // This is not standard, but rather a Weixin fasion.
    // Use Event.detail to convey detail data.
    this.detail = eventInit.detail;
  }
}

export default Event;