import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../providers/electron.service';
import {KontistService} from '../../providers/kontist.service';

let globalData = {no_data: true};
if (window && window.process && window.process.type) {
  // we are running in node environment (not in the browser)
  window.require('electron').ipcRenderer.on('data', (event, data) => {
    globalData = data;
  });

}

@Component({
  selector: 'app-standing-order-details',
  templateUrl: './standingOrder-details.component.html',
  styleUrls: ['./standingOrder-details.component.scss']
})
export class StandingOrderDetailsComponent implements OnInit {
  public data;
  public errorMessage;
  public waitForConfirmation = false;
  public tan = '';
  private requestId;

  constructor(private kontist: KontistService, private electron: ElectronService) {
  }

  async ngOnInit() {
    this.data = globalData;
  }

  public close() {
    const tWin = this.electron.remote.getCurrentWindow();
    tWin.close();
  }

  public async stop() {
    try {
      this.waitForConfirmation = true;
      await this.kontist.cancelStandingOrders(this.data.id).then(result => this.requestId = result[0]['requestId']);
    } catch (e) {
      this.waitForConfirmation = false;
      this.errorMessage = e.message;
    }
  }

  public async confirm() {
    try {
      const result = await this.kontist.confirmStandingOrder(
          this.requestId,
          this.tan);
      if (_.get(result, 'status') !== 'CANCELED') {
        this.errorMessage = _.attempt(JSON.stringify, result);
      } else {
        this.close();
      }
    } catch (e) {
      this.waitForConfirmation = false;
      this.errorMessage = e.message;
    }

  }

}
