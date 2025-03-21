import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockoutPage } from './stockout.page';

const routes: Routes = [
  {
    path: '',
    component: StockoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockoutPageRoutingModule {}
