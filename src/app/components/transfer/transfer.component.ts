import * as _ from 'lodash';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import * as IBAN from 'IBAN';
import {ElectronService} from '../../providers/electron.service';
import {CreateNewAutocompleteGroup, NgAutocompleteComponent, SelectedAutocompleteItem} from 'ng-auto-complete';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
  @ViewChild('dropdownValue') dropdownValue: TemplateRef<any>;
  @ViewChild('placeholderValue') placeholderValue: TemplateRef<any>;

  public group = [];

  public recipient = '';
  public iban = '';
  public amount;
  public note = '';
  public tan = '';

  public errorMessage;

  private transferId;

  public waitForConfirmation = false;
  public transactions: Array<{ [p: string]: any }>;

  constructor(private kontist: KontistService, private electron: ElectronService) { }

  ngOnInit() {
    this.completer.SetTemplate('completer', 'dropdownValue', this.dropdownValue);
    this.completer.SetTemplate('completer', 'placeholderValue', this.placeholderValue);

    const autoComp = CreateNewAutocompleteGroup(
      'Name (Empfänger)',
      'completer',
      [],
      { titleKey: 'name', childrenKey: null },
      '',
      true,
      1,
    );
    autoComp.async = async (str: string) => {
      let i = 1;
      return (await this.kontist.getSuggestions(str)).map(s => ({...s, id: i++}));
    };
    this.group = [autoComp];

  }

  async selectRecipient(item: SelectedAutocompleteItem) {
    if (this.waitForConfirmation) {
      return;
    }
    if (item.item === null) {

      // this is a hack to allow arbitrary values
      const val = (this.completer.GetInput('completer').dropdown.input as any).value;
      this.recipient = val;
      setTimeout(() => {
        (this.completer.GetInput('completer').dropdown.input as any).value = val;
      }, 500);
      return;
    }
    this.recipient = item.item.original.name;
    this.iban = item.item.original.iban;
  }

  public async submit() {
    if (!this.validate()) {
      return;
    }
    try {
      this.waitForConfirmation = true;
      this.transferId = await this.kontist.initiateTransfer(
        this.recipient,
        this.iban.replace(' ', ''),
        Number((this.amount * 100).toFixed(0)),
        this.note
      );
    } catch (e) {
      this.waitForConfirmation = false;
      this.errorMessage = e.message;
    }
  }

  public async confirm() {
    try {
      const result = await this.kontist.confirmTransfer(
        this.transferId,
        this.tan,
        this.recipient,
        this.iban.replace(' ', ''),
        Number((this.amount * 100).toFixed(0)),
        this.note
      );
      if (_.get(result, 'status') !== 'accepted') {
        this.errorMessage = _.attempt(JSON.stringify, result);
      } else {
        this.close();
      }
    } catch (e) {
      this.waitForConfirmation = false;
      this.errorMessage = e.message;
    }

  }

  public async close() {
    const tWin = this.electron.remote.getCurrentWindow();
    tWin.close();
  }

  private validate() {
    this.errorMessage = null;
    if (_.isEmpty(this.recipient)) {
      this.errorMessage = 'Empfänger darf nicht leer sein.';
      return false;
    }
    if (!IBAN.isValid(this.iban.replace(' ', ''))) {
      this.errorMessage = 'IBAN nicht gültig.';
      return false;
    }
    if (_.isUndefined(this.amount) || this.amount < 0.01) {
      this.errorMessage = 'Betrag nicht gültig.';
      return false;
    }

    return true;
  }
}
