import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockoutPageRoutingModule } from './stockout-routing.module';

import { StockoutPage } from './stockout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockoutPageRoutingModule
  ],
  declarations: [StockoutPage]
})
export class StockoutPageModule {}
