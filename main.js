const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(__dirname);

function createWindow() {
  let win = new BrowserWindow({fullscreen: true});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

app.on('ready', createWindow);
