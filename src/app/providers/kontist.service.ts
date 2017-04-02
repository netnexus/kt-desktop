import {Injectable} from '@angular/core';
import {KontistClient} from '@netnexus/ikontist';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class KontistService {

  private client = new KontistClient();
  private transactionSubject = new Subject<any>();
  private standingOrderSubject = new Subject<any>();
  private futureTransactionSubject = new Subject<any>();
  private accountsSubject = new Subject<any>();

  private username;
  private password;

  constructor() {}

  public async login(username: string, password: string) {
    this.username = username;
    this.password = password;
    await this.client.login(username, password);
  }

  private async refreshLogin() {
    (this.client as any).token = null;
    await this.client.login(this.username, this.password);
  }

  public getTransactions(): Observable<any> {
    return this.transactionSubject.asObservable();
  }

  public getStandingOrders(): Observable<any> {
    return this.standingOrderSubject.asObservable();
  }

  public async cancelStandingOrders(standingOrderId: string): Promise<any> {
    await this.refreshLogin();
    const accounts = await this.client.getAccounts();
    return await Promise.all(accounts.map((account) => this.client.initCancelStandingOrder(account.id, standingOrderId)));
  }

  public async refreshTransactions(quantity: number) {
    await this.refreshLogin();

    const accounts = await this.client.getAccounts();
    const transactionsArray = await Promise.all(accounts.map((account) => this.client.getTransactions(account.id, quantity)));
    const standingOrderArray = await Promise.all(accounts.map((account) => this.client.getStandingOrders(account.id)));
    this.standingOrderSubject.next([].concat(...standingOrderArray));
    this.transactionSubject.next([].concat(...transactionsArray));
  }

  public getFutureTransactions(): Observable<any> {
    return this.futureTransactionSubject.asObservable();
  }

  public async refreshFutureTransactions(quantity: number) {
    await this.refreshLogin();

    const accounts = await this.client.getAccounts();
    const futureTransactionsArray = await Promise.all(accounts.map((account) => this.client.getFutureTransactions(account.id, quantity)));
    this.futureTransactionSubject.next([].concat(...futureTransactionsArray));
  }

  public async exportTransactions() {
    const accounts = await this.client.getAccounts();
    return await Promise.all(accounts.map((account) => this.client.getTransactions(account.id)));
  }

  public getAccounts(): Observable<any> {
    return this.accountsSubject.asObservable();
  }

  public async refreshAccounts() {
    await this.refreshLogin();

    const accounts = await this.client.getAccounts();
    this.accountsSubject.next(accounts);
  }

  public async initiateTransfer(recipient: string, iban: string, amount: number, note: string): Promise<string> {
    await this.refreshLogin();
    const accounts = await this.client.getAccounts();

    const result = await this.client.initiateTransfer(
        accounts[0].id,
        recipient,
        iban,
        amount,
        note
    );

    return result.links.self.split('/').slice(-1);
  }

  public async confirmTransfer(
      transferId: string, tan: string, recipient: string, iban: string, amount: number, note: string): Promise<string> {
    const accounts = await this.client.getAccounts();

    return await this.client.confirmTransfer(
        accounts[0].id,
        transferId,
        tan,
        recipient,
        iban,
        amount,
        note
    );
  }

  public async confirmStandingOrder(requestId: string, authorizationToken: string): Promise<string> {
    const accounts = await this.client.getAccounts();
    return await this.client.confirmStandingOrder(
        accounts[0].id,
        requestId,
        authorizationToken
    );
  }

  public async initiateStandingOrder(
      recipient: string,
      iban: string,
      amount: number,
      note: string,
      reoccurrence: 'MONTHLY' | 'QUARTERLY' | 'EVERY_SIX_MONTHS' | 'ANNUALLY',
      firstExecutionDate: string,
  ): Promise<any> {
    const accounts = await this.client.getAccounts();
    return await this.client.initiateStandingOrder(accounts[0].id,
        recipient,
        iban,
        amount,
        note, reoccurrence, firstExecutionDate);
  }

  public async getSuggestions(query: string) {
    await this.refreshLogin();
    return this.client.getWireTransferSuggestions(query);
  }


}
