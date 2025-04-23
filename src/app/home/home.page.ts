import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { IProduct, IStockin, ProducsFromRequis } from '../models/product_model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})

export class HomePage implements OnInit {
  
  private readonly productsService = inject(ProductsService);
  private readonly alertCtrl = inject(AlertController);

  title = "lufesa";
  isInova: boolean = false;

  items: ProducsFromRequis[] = []

  ngOnInit(): void {
    this.productsService.get_info_from_requis().subscribe(resp=>{
      this.items = [...resp];
      console.log(this.items)
    })
  }


  onToggleChange(event: any) {

    this.isInova = event.detail.checked;
    localStorage.setItem('theme', this.isInova ? 'inova' : 'lufesa');

    const empresa = this.isInova ? 'inova' : 'lufesa';
    this.title = empresa;

    localStorage.setItem('empresa', empresa);

    document.body.classList.toggle('inova-theme', this.isInova);
    document.body.classList.toggle('lufesa-theme', !this.isInova);

    this.productsService.get_products();

    this.productsService.get_info_from_requis().subscribe(resp=>{
      this.items = [...resp];
      console.log(this.items)
    })
  }

  stockin(item: any) {
    this.showAlert('¿Estás seguro que deseas añadir esta entrada?', item);
  }

  async showAlert(msg: string, item: IProduct) {

    const alertButtons = [
      {
        text: 'Aceptar',
        role: 'ok',
        handler: () => {
          this.productsService.verify_product(item).subscribe(resp=>{
            window.alert(resp);

            this.items = [...this.items.filter(product=> product.nombre != item.nombre)]
          })
        },
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          
        },
      }    
    ]

    const alert = await this.alertCtrl.create({
      header: msg,
      // message: err,
      cssClass: 'alert-styles',
      buttons: alertButtons,
    });

    await alert.present();
  }
}
