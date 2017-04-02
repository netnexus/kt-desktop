import {Component, OnInit} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import {Observable} from 'rxjs/Observable';
import {ElectronService} from '../../providers/electron.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  public transactionList: Observable<any>;
  public standingOrderList: Observable<any>;
  public futureTransactionList: Observable<any>;
  public numberOfTransaction = '50';

  public filter = '';

  constructor(private kontist: KontistService, private electron: ElectronService) {
  }

  async ngOnInit() {
    await this.load();
  }

  public rowDblClick(rowData) {
    const child = new this.electron.remote.BrowserWindow({
      parent: this.electron.remote.getCurrentWindow(),
      modal: false,
      show: false,
      width: 600,
      title: 'Kt Desktop: Details',
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('transaction-details'));
    child.once('ready-to-show', () => {
      child.show();
      child.webContents.send('data', rowData);
    });

  }

  public standingOrderRowDblClick(rowData) {
    const child = new this.electron.remote.BrowserWindow({
      parent: this.electron.remote.getCurrentWindow(),
      modal: false,
      show: false,
      width: 600,
      title: 'Kt Desktop: Details',
      webPreferences: {
        webSecurity: false
      }
    });
    child.loadURL(this.electron.buildUrl('standingOrder-details'));
    child.once('ready-to-show', () => {
      child.show();
      child.webContents.send('data', rowData);
    });

  }


  public async load() {
    sessionStorage.setItem('transactions', this.numberOfTransaction);

    this.standingOrderList = this.kontist.getStandingOrders();

    this.transactionList = this.kontist.getTransactions();
    await this.kontist.refreshTransactions(Number(this.numberOfTransaction));

    this.futureTransactionList = this.kontist.getFutureTransactions();
    await this.kontist.refreshFutureTransactions(Number(this.numberOfTransaction));
  }

}
