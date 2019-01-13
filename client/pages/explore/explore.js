import util from '../../base/util.js';
import db from '../../database/db.js';
import LEVEL from '../../constant/level.js';

const INIT_LATITUDE = 39.908823;
const INIT_LONGITUDE = 116.39747;

function isSameRegion(regionA, regionB) {
  return regionA && regionB &&
    regionA.southwest.longitude == regionB.southwest.longitude &&
    regionA.southwest.latitude == regionB.southwest.latitude &&
    regionA.northeast.longitude == regionB.northeast.longitude &&
    regionA.northeast.latitude == regionB.northeast.latitude;
}

Page({

  data: {
    longitude: INIT_LONGITUDE,
    latitude: INIT_LATITUDE
  },

  mapContext: null,
  canvasContext: null,
  region: null,
  stat: [],
  locationSet: {},
  canvasWidth: 0,
  canvasHeight: 0,
  isUpdatingRegion: false,
  lastDrawRegion: null,
  lastDrawIndex: 0,
  updateHeatMapTimeoutId: 0,

  onLoad: function (options) {
  },

  onReady: function () {
    this.mapContext = wx.createMapContext('city-heat-map');
    this.canvasContext = wx.createCanvasContext('city-heat-canvas');
    // TODO: remove this hack
    // delay 1 second to make map works correctly for:
    // * moveToLocation actually takes effect
    // * getRegion can return correct value
    util.timeout(1000)
      .then(() => {
        this.mapContext.moveToLocation();
        return this.updateHeatMap();
      })
      .then(() => this.scheduleNextUpdateStat());
  },

  scheduleNextUpdateStat: function() {
    if (!this.updateHeatMapTimeoutId) {
      this.updateHeatMapTimeoutId = setTimeout(() => {
        this.updateHeatMapTimeoutId = 0;
        this.updateHeatMap()
          .then(() => this.scheduleNextUpdateStat());
      }, 5000);
    }
  },

  stopUpdatingStat: function() {
    if (this.updateHeatMapTimeoutId) {
      clearTimeout(this.updateHeatMapTimeoutId);
      this.updateHeatMapTimeoutId = 0;
    }
  },

  getCanvasSize: function() {
    if (this.canvasWidth > 0 && this.canvasHeight > 0) {
      return Promise.resolve();
    }
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

  getMapRegion: function() {
    if (this.isUpdatingRegion) return Promise.reject();
    return util.getRegion(this.mapContext)
      .then(region => this.region = region);
  },

  getStatForCurrentRegion: function() {
    if (this.isUpdatingRegion) return Promise.resolve();
    return db.getHeatMapStat(this.region)
      .then(stat => {
        for (const record of stat) {
          const hashKey = record.location.coordinates.join('x');
          if (!this.locationSet[hashKey]) {
            this.locationSet[hashKey] = this.stat.length;
            this.stat.push(record);
          }
        }
      });
  },

  // Make sure below values are ready before call this function:
  // * this.region
  // * this.stat
  // * this.canvasWidth
  // * this.canvasHeight
  drawStatOnCanvas: function() {
    if (this.isUpdatingRegion) return;
    let reserveCanvas = false;
    let startIndex = 0;
    if (isSameRegion(this.lastDrawRegion, this.region)) {
      reserveCanvas = true;
      startIndex = this.lastDrawIndex;
    }
    this.lastDrawRegion = this.region;
    this.lastDrawIndex = this.stat.length;
    const lx = this.region.southwest.longitude;
    const ly = this.region.southwest.latitude;
    const rx = this.region.northeast.longitude;
    const ry = this.region.northeast.latitude;
    const w = this.canvasWidth - 1;
    const h = this.canvasHeight - 1;
    for (let i = startIndex;i < this.stat.length;i++) {
      const record = this.stat[i];
      const tx = record.location.coordinates[0];
      const ty = record.location.coordinates[1];
      const x = (tx - lx) * w / (rx - lx);
      const y = (ty - ly) * h / (ry - ly);
      const radius = 6;
      const color = LEVEL.Color[util.datetimeToLevel(record.datetime)];
      this.canvasContext.beginPath();
      this.canvasContext.arc(x, h - y, radius, 0, 2 * Math.PI);
      this.canvasContext.setFillStyle(color);
      this.canvasContext.fill();
    }
    return new Promise((resolve, reject) => {
      this.canvasContext.draw(reserveCanvas, resolve);
    });
  },

  updateHeatMap: function () {
    if (this.isUpdatingRegion) return Promise.resolve();
    return Promise.all([this.getCanvasSize(), this.getMapRegion()])
      .then(() => this.drawStatOnCanvas())
      .then(() => this.getStatForCurrentRegion())
      .then(() => this.drawStatOnCanvas())
      .catch(console.log);
  },

  onMapRegionChange: function(e) {
    if (e.type == 'begin') {
      this.isUpdatingRegion = true;
      this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.canvasContext.draw();
    } else if (e.type == 'end') {
      this.isUpdatingRegion = false;
      this.updateHeatMap();
    }
  }
})
