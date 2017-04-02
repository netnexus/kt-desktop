import {Component, OnInit} from '@angular/core';
import {ElectronService} from './providers/electron.service';
import {KontistService} from './providers/kontist.service';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLoading = true;
  constructor(
    public electron: ElectronService,
    private kontist: KontistService,
  ) {}

  async ngOnInit() {

    // loads the Icon plugin
    UIkit.use(Icons);

    // try to login or remove password
    const credentials = await this.electron.remote.require('./credentials').getCredentials();
    if (credentials.password) {
      try {
        await this.kontist.login(credentials.account, credentials.password);
        this.isLoading = false;
      } catch (e) {
        console.error(e);
        this.electron.remote.require('./credentials').clearCredentials();
      }
    }

    // show login dialog if we are on main route
    if ((window.location.hash === '#/' || window.location.hash === '') && !credentials.password) {
      await this.openLoginDialog();
      this.electron.remote.app.relaunch();
      this.electron.remote.app.exit();
    }

    // remove loading on login
    if (window.location.hash === '#/login') {
      this.isLoading = false;
    }

  }

  /**
   * Show Login dialog.
   */
  public async openLoginDialog() {

    const child = new this.electron.remote.BrowserWindow(
      {
        parent: this.electron.remote.getCurrentWindow(), modal: false, show: false, height: 420,
        webPreferences: {
          webSecurity: false
        }
      }
    );
    child.loadURL(this.electron.buildUrl('login'));
    child.once('ready-to-show', () => {
      child.show();
    });
    // child.webContents.openDevTools();

    return new Promise((resolve) => {
      child.once('close', () => {
        resolve();
      });
    });

  }

}
