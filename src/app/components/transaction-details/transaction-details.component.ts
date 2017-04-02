import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../providers/electron.service';

let globalData = { no_data: true };
if (window && window.process && window.process.type) {
  // we are running in node environment (not in the browser)
  window.require('electron').ipcRenderer.on('data', (event, data) => {
    globalData = data;
  });

}

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  public data;

  constructor(private electron: ElectronService) {}

  async ngOnInit() {
    this.data = globalData;
  }

  public close() {
    const tWin = this.electron.remote.getCurrentWindow();
    tWin.close();
  }

}
