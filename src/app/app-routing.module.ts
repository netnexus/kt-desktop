import {HomeComponent} from './components/home/home.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TransferComponent} from './components/transfer/transfer.component';
import {StandingOrderComponent} from './components/standingOrder/standingOrder.component';
import {LoginComponent} from './components/login/login.component';
import {WhatsNewComponent} from './components/whats-new/whats-new.component';
import {TransactionDetailsComponent} from './components/transaction-details/transaction-details.component';
import {ExportComponent} from './components/export/export.component';
import {StandingOrderDetailsComponent} from './components/standingOrder-details/standingOrder-details.component';
import {CreateStandingOrderComponent} from './components/createStandingOrder/createStandingOrder.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'transfer',
    component: TransferComponent
  },
  {
    path: 'create-standing-order',
    component: CreateStandingOrderComponent
  },
  {
    path: 'standingOrder',
    component: StandingOrderComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'whats-new',
    component: WhatsNewComponent,
  },
  {
    path: 'transaction-details',
    component: TransactionDetailsComponent,
  },
  {
    path: 'standingOrder-details',
    component: StandingOrderDetailsComponent,
  },
  {
    path: 'export',
    component: ExportComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
