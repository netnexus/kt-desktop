import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import {ElectronService} from '../../providers/electron.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public username = '';
  public password = '';
  public errorMessage = null;

  constructor(private kontist: KontistService, private electron: ElectronService) { }

  async ngOnInit() {
    const credentials = await this.electron.remote.require('./credentials').getCredentials();
    this.username = credentials.account || '';
    this.password = credentials.password || '';
  }

  public async submit() {
    if (!this.validate()) {
      return;
    }
    try {
      await this.kontist.login(this.username, this.password);
      this.electron.remote.require('./credentials').setCredentials(this.username, this.password);
      this.errorMessage = null;
      this.close();
    } catch (e) {
      this.errorMessage = e.message;
    }
  }

  private validate() {
    this.errorMessage = null;
    if (_.isEmpty(this.username)) {
      this.errorMessage = 'Nutzername darf nicht leer sein.';
      return false;
    }
    if (_.isEmpty(this.password)) {
      this.errorMessage = 'Passwort darf nicht leer sein.';
      return false;
    }

    return true;
  }

  public close() {
    const tWin = this.electron.remote.getCurrentWindow();
    tWin.close();
  }

}
