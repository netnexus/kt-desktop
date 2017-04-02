import {Injectable} from '@angular/core';
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, remote, shell, webContents, webFrame} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';

@Injectable()
export class ElectronService {

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    webContents: typeof webContents;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    shell: typeof shell;
    path: typeof path;

    constructor() {
        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.webContents = window.require('electron').webContents;
            this.remote = window.require('electron').remote;
            this.shell = window.require('electron').shell;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.path = window.require('path');
        }
    }

    isElectron = () => {
        return window && window.process && window.process.type;
    }

    public buildUrl(route: string) {
        console.log('argv', this.remote.process.argv);
        const args = this.remote.process.argv.slice(1);
        const serve = args.some(val => val === '--serve');
        if (serve) {
            return 'http://localhost:4200/#/' + route;
        } else {
            return url.format({
                pathname: this.path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true,
                hash: '/' + route
            });
        }
    }
}
