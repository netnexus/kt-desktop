import {Component, OnInit} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import {ElectronService} from '../../providers/electron.service';
import {Angular2Csv} from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {
    constructor(private kontist: KontistService, private electron: ElectronService) {
    }
  public exportOption = 'CSV';
  public errorMessage;

    private static saveFile(data, filename, type) {

        if (!data) {
            console.error('No data');
            return;
        }

        const blob = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    private static exportQif(transactions) {
        let exportString = '';
        exportString += ('!Type:Bank\n');
        for (let i = 0; i < transactions.length; i++) {
            const txn = transactions[i];
            exportString += ('D' + new Date(txn.bookingDate).toLocaleDateString('en-US') + '\n');
            exportString += ('T' + txn.amount / 100 * (txn.from === null ? 1 : -1) + '\n');
            if (txn.name) {
                exportString += ('P' + txn.name + '\n');
            }
            if (txn.purpose) {
                exportString += ('M' + txn.purpose + '\n');
            }
            exportString += ('^\n');
        }
        ExportComponent.saveFile(exportString, 'export.qif', 'text/plain');
    }

    ngOnInit() {
    }

    public async submit() {
        try {
            const transactions: Array<{ [p: string]: any }> = (await this.kontist.exportTransactions())[0] as any;
            if (this.exportOption === 'CSV') {
                const data = transactions.map((row) => ({...row, integrations: JSON.stringify(row.integrations)}));
                // tslint:disable-next-line:no-unused-expression
                new Angular2Csv(data, 'export', {
                    fieldSeparator: ',',
                    quoteStrings: '"',
                    decimalseparator: '.',
                    headers: Object.keys(transactions[0]),
                    showTitle: false,
                    useBom: true
                });
            } else if (this.exportOption === 'JSON') {
                ExportComponent.saveFile(JSON.stringify(transactions), 'export.json', 'text/json');
            } else if (this.exportOption === 'QIF') {
                ExportComponent.exportQif(transactions);
            }

        } catch (e) {
            this.errorMessage = e.message;
            console.log(e);
        }
    }

    public async close() {
        const tWin = this.electron.remote.getCurrentWindow();
        tWin.close();
  }
}
