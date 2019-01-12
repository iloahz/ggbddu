import util from '../../base/util.js';
import db from '../../database/db.js';
import LEVEL from '../../constant/level.js';

const INIT_LATITUDE = 39.908823;
const INIT_LONGITUDE = 116.39747;

Page({

  data: {
  },

  mapContext: null,
  canvasContext: null,
  canvasWidth: 0,
  canvasHeight: 0,

  onLoad: function (options) {
    this.mapContext = wx.createMapContext('city-heat-map');
    this.canvasContext = wx.createCanvasContext('city-heat-canvas');
  },

  onReady: function () {

  },

  onShow: function () {
    this.updateHeatMap();
  },

  getCanvasSize: function() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select("#city-heat-canvas")
        .boundingClientRect(rect => {
          this.canvasWidth = rect.width;
          this.canvasHeight = rect.height;
          resolve();
        })
        .exec();
    });
  },

  getStatForCurrentRegion: function() {
    return util.getRegion(this.mapContext)
      .then(region => {
        this.region = region;
        return db.getHeatMapStat(region);
      })
      .then(stat => this.stat = stat);
  },

  // Make sure below values are ready before call this function:
  // * this.region
  // * this.stat
  // * this.canvasWidth
  // * this.canvasHeight
  drawStatOnCanvas: function() {
    const lx = this.region.southwest.longitude;
    const ly = this.region.southwest.latitude;
    const rx = this.region.northeast.longitude;
    const ry = this.region.northeast.latitude;
    const w = this.canvasWidth - 1;
    const h = this.canvasHeight - 1;
    for (const stat of this.stat) {
      const tx = stat.location.coordinates[0];
      const ty = stat.location.coordinates[1];
      const x = (tx - lx) * w / (rx - lx);
      const y = (ty - ly) * h / (ry - ly);
      const radius = 6;
      const color = LEVEL.Color[util.datetimeToLevel(stat.datetime)];
      this.canvasContext.beginPath();
      this.canvasContext.arc(x, h - y, radius, 0, 2 * Math.PI);
      this.canvasContext.setFillStyle(color);
      this.canvasContext.fill();
    }
    this.canvasContext.draw();
  },

  updateHeatMap: function () {
    return this.getCanvasSize()
      .then(() => this.getStatForCurrentRegion())
      .then(() => this.drawStatOnCanvas())
      .catch(console.log);
  }
})
