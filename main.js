const {app, Menu, BrowserWindow, ipcMain, ipcRenderer} = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(__dirname);

// global variable for the main window
let displayWindow, controlWindow;

function createWindows() {
  /*
  Display Window
  */
  displayWindow = new BrowserWindow({
    // fullscreen: true,
    width: 800,
    height: 600,
    x: 0,
    y: 0
  });

  displayWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/display.html'),
    protocol: 'file:',
    slashes: true
  }));

  displayWindow.on('resize', e => {
    let newSize = displayWindow.getContentSize();
    controlWindow.webContents.send('resize-display', {x: newSize[0], y: newSize[1]});
    console.log(newSize);
  });

  /*
  Control Window
  */
  controlWindow = new BrowserWindow({
    fullscreen: false,
    width: 800,
    height: 600
  });

  controlWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/control.html'),
    protocol: 'file:',
    slashes: true
  }));

  /*
  Application Menu
  */
  const menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Open Add Color',
          click() {
            console.log('Open Add Color');
          },
          accelerator: 'CmdOrCtrl+A'
        }, {
          label: 'Quit',
          click() {
            app.quit();
          },
          accelerator: 'CmdOrCtrl+Q'
        }, {
          label: 'DevTools',
          click() {
            displayWindow.webContents.toggleDevTools();
            controlWindow.webContents.toggleDevTools();
          },
          accelerator: 'CmdOrCtrl+I'
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindows);


ipcMain.on('new-tracker', (event, tracker) => {
  displayWindow.webContents.send('new-tracker', tracker);
});

ipcMain.on('update-tracker', (event, tracker) => {
  displayWindow.webContents.send('update-tracker', tracker);
});

ipcMain.on('change-camera', (event, deviceId) => {
  displayWindow.webContents.send('change-camera', deviceId);
});
