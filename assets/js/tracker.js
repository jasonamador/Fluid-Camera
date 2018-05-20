// pixel conversion
const cameraToCanvasX = document.getElementById('fluid').offsetWidth / document.getElementById('tracker').offsetWidth;
const cameraToCanvasY = document.getElementById('fluid').offsetHeight / document.getElementById('tracker').offsetHeight;

console.log(cameraToCanvasX, cameraToCanvasY);

// set up the background
navigator.getUserMedia({video: true}, (stream) => {
  document.getElementById('background').src = window.URL.createObjectURL(stream);
}, () => {throw Error('Cannot capture user camera.')});

class Color {
  constructor(name, r, g, b) {
    this.name = name;
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class ColorRange {
  constructor(rMin, rMax, gMin, gMax, bMin, bMax) {
    this.r = {min: rMin, max: rMax};
    this.g = {min: gMin, max: gMax};
    this.b = {min: bMin, max: bMax};
  }
}

// this requires tracking.js before
class Tracker {
  constructor(color, colorRange) {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.down = false;
    this.moved = false;
    this.color = color;

    tracking.ColorTracker.registerColor(this.color.name, (r, g, b) => {
      let inRedRange = r > colorRange.r.min && r < colorRange.r.max;
      let inGreenRange = g > colorRange.g.min && g < colorRange.g.max;
      let inBlueRange = b > colorRange.b.min && b < colorRange.b.max;
      return inRedRange && inGreenRange && inBlueRange;
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

// set up the trackers
let tracker = new tracking.ColorTracker([]);
tracking.track('#tracker', tracker, { camera: true });


const trackers = {};

//this will be done with the
trackers.red = new Tracker(new Color('red', 0.8, 0.1, 0.1), new ColorRange(180, 255, 0, 80, 0, 80));
trackers.blue = new Tracker(new Color('blue', 0.1, 0.1, 0.8), new ColorRange(0, 120, 0, 120, 160, 255));
trackers.white = new Tracker(new Color('white', 0.8, 0.8, 0.8), new ColorRange(100, 255, 100, 255, 100, 255));

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
