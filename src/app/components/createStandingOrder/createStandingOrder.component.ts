import * as _ from 'lodash';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {KontistService} from '../../providers/kontist.service';
import * as IBAN from 'IBAN';
import {ElectronService} from '../../providers/electron.service';
import {CreateNewAutocompleteGroup, NgAutocompleteComponent, SelectedAutocompleteItem} from 'ng-auto-complete';

@Component({
  selector: 'app-create-standing-order',
  templateUrl: './createStandingOrder.component.html',
  styleUrls: ['./createStandingOrder.component.scss']
})
export class CreateStandingOrderComponent implements OnInit {
  @ViewChild(NgAutocompleteComponent) public completer: NgAutocompleteComponent;
  @ViewChild('dropdownValue') dropdownValue: TemplateRef<any>;
  @ViewChild('placeholderValue') placeholderValue: TemplateRef<any>;

  public group = [];

  public recipient = '';
  public iban = '';
  public amount;
  public note = '';
  public tan = '';
  public reoccurrence: 'MONTHLY' | 'QUARTERLY' | 'EVERY_SIX_MONTHS' | 'ANNUALLY' = 'MONTHLY';
  public firstExecutionDate = '';

  public errorMessage;

  private createStandingOrderRequest;

  public waitForConfirmation = false;
  public transactions: Array<{ [p: string]: any }>;

  constructor(private kontist: KontistService, private electron: ElectronService) {
  }

  ngOnInit() {
    this.completer.SetTemplate('completer', 'dropdownValue', this.dropdownValue);
    this.completer.SetTemplate('completer', 'placeholderValue', this.placeholderValue);

    const autoComp = CreateNewAutocompleteGroup(
        'Name (Empfänger)',
        'completer',
        [],
        {titleKey: 'name', childrenKey: null},
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
      this.createStandingOrderRequest = await this.kontist.initiateStandingOrder(
          this.recipient,
          this.iban.replace(' ', ''),
          Number((this.amount * 100).toFixed(0)),
          this.note,
          this.reoccurrence,
          this.firstExecutionDate
      );

    } catch (e) {
      this.waitForConfirmation = false;
      this.errorMessage = e.message;
    }
  }

  public async confirm() {
    try {
      const result = await this.kontist.confirmStandingOrder(
          this.createStandingOrderRequest['requestId'],
          this.tan
      );
      if (_.get(result, 'status') !== 'ACTIVE') {
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
    if (_.isEmpty(this.firstExecutionDate)) {
      this.errorMessage = 'Startdatum darf nicht leer sein.';
      return false;
    }

    return true;
  }
}
