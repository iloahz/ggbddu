// GG stands for Ggbddu's Global object.
class GG {
  constructor() {
    this.userInfo = null;
    this.openId = null;
  }

  static getInstance() {
    if (!GG.instance_) {
      GG.instance_ = new GG();
    }
    return GG.instance_;
  }
}

export default GG.getInstance();