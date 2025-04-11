import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-no-connection',
  templateUrl: './no-connection.component.html',
  styleUrls: ['./no-connection.component.scss'],
  standalone: false
})
export class NoConnectionComponent {

  private readonly router = inject(Router);
  private readonly toastCtrl = inject(ToastController);

  async reload(): Promise<void> {
    const status = await Network.getStatus();

    const toast = await this.toastCtrl.create({
      message: 'Aún no estás conectado a internet, conéctate para poder ingresar.',
      duration: 5000,
      color: 'warning'
    })

    if (status.connected){
      this.router.navigate(['']);
      return;
    } 

    await toast.present();



  }





}
