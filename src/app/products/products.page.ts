import { Component, inject, OnInit } from '@angular/core';
import { FormComponent } from '../stockin/components/form/form.component';
import { IProduct, ProductsByCategory } from '../models/product_model';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductsService } from '../services/products.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-search',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false,
})
export class ProductsPage implements OnInit {
  private readonly productService = inject(ProductsService);
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);

  products: ProductsByCategory = {};
  filteredProducts: ProductsByCategory = {};
  searchTerm: string = '';
  empresa = localStorage.getItem('empresa');
  urlBase = environment.url;

  ngOnInit() {
    this.productService.products$.subscribe((products) => {
      this.products = products;
      this.filteredProducts = this.products;
    });

    this.productService.get_products();
  }

  searchProducts(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredProducts = Object.entries(
      this.products
    ).reduce<ProductsByCategory>((acc, [categoria, productos]) => {
      const filtrados = productos.filter((product) =>
        product.nombre.toLowerCase().includes(term)
      );

      if (filtrados.length > 0) {
        acc[categoria] = filtrados;
      }

      return acc;
    }, {});
  }

  resetList(): void {
    this.filteredProducts = this.products;
  }

  async addProduct() {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [0, 0.95],
      initialBreakpoint: 0.95,
      componentProps: { isNew: true },
    });

    modal.present();
  }

  async editProduct(product: IProduct) {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
      breakpoints: [0, 0.95],
      initialBreakpoint: 0.95,
      componentProps: { product, isEdit: true },
    });

    await modal.present();
  }

  getTotalCosto(products: IProduct[]): number {
    let total = 0;
    products.forEach((product: IProduct) => {
      total += product.CostoUnitario! * product.stock!;
    });

    return total;
  }

  ionViewWillEnter() {
    this.empresa = localStorage.getItem('empresa');
  }

  deleteProduct(idProduct: number) {
    this.productService.deleteProduct(idProduct).subscribe({
      next: (res) => {
        this.showAlert(res.mensaje);
      },
      error: (err) => {
        console.error('Error al eliminar el producto', err);
      },
    });
  }

  async showAlert(msg: string, err?: any) {
    const alert = await this.alertCtrl.create({
      header: msg,
      message: err,
      cssClass: 'alert-styles',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

}
