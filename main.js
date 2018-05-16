const {app, Menu, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

require('electron-reload')(__dirname);

// global variable for the main window

function createWindow() {
  win = new BrowserWindow({fullscreen: true});

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }));

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
            win.webContents.toggleDevTools();
            console.log('dev');
          },
          accelerator: 'CmdOrCtrl+I'
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);
