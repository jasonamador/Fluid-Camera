const {remote, ipcRenderer} = require('electron');

// pixel conversion
let cameraToCanvasX = 1;
let cameraToCanvasY = 1;

// ipc handlers
ipcRenderer.on('resize-display', (event, displayDimensions) => {
  cameraToCanvasX = displayDimensionsarg.x / document.getElementById('tracker').offsetWidth;
  cameraToCanvasY = displayDimensionsarg.y / document.getElementById('tracker').offsetHeight;
});

// tracker classes
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
  constructor(name, color, colorRange) {
    this.name = name,
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
    ipcRenderer.send('new-tracker', this);
  }

  update(x, y) {
    this.moved = true;
    this.dx = (x - this.x);
    this.dy = (y - this.y);
    this.x = x;
    this.y = y;
    ipcRenderer.send('update-tracker', this);
  }
}

// get all the video devices
let cameras;
navigator.mediaDevices.enumerateDevices().then((device) => {
  cameras = device.filter(device => device.kind === 'videoinput' && !device.label.includes('iGlasses'));
  // and put them in the camera <select>
  console.log(cameras);
  cameras.forEach(e => {
    // create a new option
    let camera = document.createElement('option');
    camera.label = e.label;
    camera.value = e.deviceId;

    document.getElementById('camera-select').appendChild(camera);
    console.log(camera);
  });
}).catch((e) => new Error(e));


// set up the trackers
let tracker = new tracking.ColorTracker([]);
tracking.track('#tracker', tracker, { camera: true });

const trackers = {};
trackers.red = new Tracker('red', new Color('red', 0.8, 0.1, 0.1), new ColorRange(180, 255, 0, 80, 0, 80));
trackers.blue = new Tracker('blue', new Color('blue', 0.1, 0.1, 0.8), new ColorRange(0, 120, 0, 120, 160, 255));
trackers.white = new Tracker('white', new Color('white', 0.8, 0.8, 0.8), new ColorRange(100, 255, 100, 255, 100, 255));

/*
Color Tracker Handler
*/
tracker.on('track', function(event) {
  if (event.data.length > 0) {
    event.data.forEach(function(rect) {
      let x = (rect.x + rect.width / 2) * cameraToCanvasX;
      let y = (rect.y + rect.width / 2) * cameraToCanvasY;
      trackers[rect.color].update(x, y);
    });
  }
});
