import {app, BrowserWindow, Menu} from 'electron';
import * as path from 'path';
import * as url from 'url';

import {checkForUpdates} from './app-updater';

const windowStateKeeper = require('electron-window-state');

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1100,
    defaultHeight: 800
  });

  // Create the browser window.
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    titleBarStyle: 'hiddenInset',
    // vibrancy: 'sidebar', // bug on mac os with transparent title bar 2.0.2
    // see https://github.com/electron/electron/issues/10886
    // or https://github.com/electron/electron/issues/10521
    title: 'Kt Desktop',
    icon: path.join(__dirname, 'assets/images/icon.png'),
    webPreferences: {
      webSecurity: false
    }
  });

  // add listeners to save window state
  mainWindowState.manage(win);

  win.once('ready-to-show', () => {
    win.show();
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
    win.webContents.openDevTools();
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  // Create the Application's main menu
  const template: Electron.MenuItemConstructorOptions[] = [{
    label: 'Kt Desktop',
    submenu: [
      // { role: 'about' },
      // { type: 'separator' },
      { label: 'Auf Updates prüfen...', click: checkForUpdates },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }, {
    label: 'Bearbeiten',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'delete' },
      { role: 'selectall' }
    ]
  }, {
    role: 'help',
    submenu: [{
      label: 'Learn More',
      click() {
        require('electron').shell.openExternal('https://netnexus.de');
      }
    }]
  }
  ];

  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
