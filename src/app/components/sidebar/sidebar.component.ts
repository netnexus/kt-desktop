import {Component, OnInit} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import {Observable} from 'rxjs/Observable';
import {ElectronService} from '../../providers/electron.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public accounts: Observable<any>;
  public version = '';

  constructor(private kontist: KontistService, private electron: ElectronService) { }

  async ngOnInit() {
    this.accounts = this.kontist.getAccounts();
    await this.kontist.refreshAccounts();
    this.version = this.electron.remote.app.getVersion();
  }

  public async refresh() {
    const quantity = sessionStorage.getItem('transactions') === null ? '50' : sessionStorage.getItem('transactions');
    await this.kontist.refreshAccounts();
    await this.kontist.refreshFutureTransactions(Number(quantity));
    await this.kontist.refreshTransactions(Number(quantity));
  }

  public logout() {
    this.electron.remote.require('./credentials').clearCredentials();
    this.electron.remote.app.relaunch();
    this.electron.remote.app.exit();
  }

  public whatsnew() {
    const child = new this.electron.remote.BrowserWindow({
      parent: this.electron.remote.getCurrentWindow(), modal: false, show: false,
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('whats-new'));
    child.once('ready-to-show', () => {
      child.show();
    });
  }

  public openTransferDialog() {
    const child = new this.electron.remote.BrowserWindow({
      parent: this.electron.remote.getCurrentWindow(),
      modal: false,
      show: false,
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('transfer'));
    child.once('ready-to-show', () => {
      child.show();
    });

    // child.webContents.openDevTools();


    // TODO: update future transactions on close
    // something like this.kontist.refreshFutureTransactions(1000);
  }

  public openStandingOrderDialog() {
    const child = new this.electron.remote.BrowserWindow({
      parent: this.electron.remote.getCurrentWindow(),
      modal: false,
      show: false,
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('create-standing-order'));
    child.once('ready-to-show', () => {
      child.show();
    });
  }

  public openExportDialog() {
    const child = new this.electron.remote.BrowserWindow({
      width: 400,
      height: 250,
      parent: this.electron.remote.getCurrentWindow(),
      modal: false,
      show: false,
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('export'));
    child.once('ready-to-show', () => {
      child.show();
    });
  }

  public openUrlInBrowser() {
    this.electron.shell.openExternal('https://netnexus.de/?src=kt-desktop');
  }
}
