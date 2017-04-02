import 'zone.js/dist/zone-mix';
import 'reflect-metadata';


import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {NgAutoCompleteModule} from 'ng-auto-complete';

import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';

import {ElectronService} from './providers/electron.service';
import {WebviewDirective} from './directives/webview.directive';
import {KontistService} from './providers/kontist.service';

import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {TransactionsComponent} from './components/transactions/transactions.component';
import {AvatarModule} from 'ngx-avatar';
import {CurrencyMaskModule} from 'ng2-currency-mask';

import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/de';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {IbanPipe} from './components/sidebar/iban.pipe';
import {TransferComponent} from './components/transfer/transfer.component';
import {LoginComponent} from './components/login/login.component';
import {WhatsNewComponent} from './components/whats-new/whats-new.component';
import {TransactionDetailsComponent} from './components/transaction-details/transaction-details.component';
import {ExportComponent} from './components/export/export.component';
import {StandingOrderComponent} from './components/standingOrder/standingOrder.component';
import {StandingOrderDetailsComponent} from './components/standingOrder-details/standingOrder-details.component';
import {CreateStandingOrderComponent} from './components/createStandingOrder/createStandingOrder.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TransferComponent,
    StandingOrderComponent,
    StandingOrderDetailsComponent,
    CreateStandingOrderComponent,
    TransactionsComponent,
    SidebarComponent,
    LoginComponent,
    WhatsNewComponent,
    TransactionDetailsComponent,
    IbanPipe,
    ExportComponent,
    WebviewDirective,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AvatarModule.forRoot({
      avatarColors: [
        '#592fb1',
        '#250e54',
        '#ddcff4',
        '#fcbb4f',
        '#348188',
        '#4c4b50',
        '#8863d6',
        '#124044',
        '#523301',
      ]
    }),
    CurrencyMaskModule,
    Ng2SearchPipeModule,
    NgAutoCompleteModule,
  ],
  providers: [ElectronService, KontistService, { provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

registerLocaleData(localeFr, 'de');
