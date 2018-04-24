import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import * as path from 'path';

import * as paper from 'paper';

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(url.format({
    pathname: path.join(__dirname, '..', '..', 'public', 'index.html'),
    protocol: 'file:', 
    slashes: true
  }));
}

app.on('ready', createWindow);
