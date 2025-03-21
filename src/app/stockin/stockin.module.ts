import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockinPageRoutingModule } from './stockin-routing.module';

import { StockinPage } from './stockin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockinPageRoutingModule
  ],
  declarations: [StockinPage]
})
export class StockinPageModule {}
