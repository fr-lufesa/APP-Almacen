import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockinPage } from './stockin.page';

const routes: Routes = [
  {
    path: '',
    component: StockinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockinPageRoutingModule {}
