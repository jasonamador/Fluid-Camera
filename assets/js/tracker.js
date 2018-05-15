// conversion
const cameraToCanvasX = document.getElementById('fluid').offsetWidth / document.getElementById('camera').offsetWidth;
const cameraToCanvasY = document.getElementById('fluid').offsetHeight / document.getElementById('camera').offsetHeight;

class Color {
  constructor(name, r, g, b) {
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class Range {
  constructor(rMin, rMax, gMin, gMax, bMin, bMax) {
    this.r = {min: rMin, max: rMax};
    this.g = {min: gMin, max: gMax};
    this.b = {min: bMin, max: bMax};
  }
}

// this requires tracking.js before
class Tracker {
  constructor(color, range) {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.down = false;
    this.moved = false;
    this.color = color;

    tracking.ColorTracker.registerColor(this.color.name, (r, g, b) => {
      let redRange = r > range.r.min && r < range.r.max;
      let greenRange = g > range.g.min && g < range.g.max;
      let blueRange = b > range.b.min && b < range.b.max;
      return redRange && greenRange && blueRange;
    });
    tracker.colors.push(this.color.name);
  }

  update(x, y) {
    this.moved = true;
    this.dx = (x - this.x);
    this.dy = (y - this.y);
    this.x = x;
    this.y = y;
  }
}

// set up the tracking
let tracker = new tracking.ColorTracker([]);
tracking.track('#camera', tracker, { camera: true });


const trackers = {};

//this will be done with the
trackers.red = (new Tracker(new Color('red', 0.8, 0.1, 0.1), new Range(180, 255, 0, 80, 0, 80)));

/*
Color Tracker Handler
*/
tracker.on('track', function(event) {
  let message = {};
  if (event.data.length > 0) {
    event.data.forEach(function(rect) {
      // get the center of the event
      let x = (rect.x + rect.width / 2) * cameraToCanvasX;
      let y = (rect.y + rect.width / 2) * cameraToCanvasY;
      trackers[rect.color].update(x, y);
    });
  }
});
