import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockinPageRoutingModule } from './stockin-routing.module';

import { StockinPage } from './stockin.page';
import { FormComponent } from './components/form/form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StockinPageRoutingModule
  ],
  declarations: [StockinPage, FormComponent]
})
export class StockinPageModule {}
