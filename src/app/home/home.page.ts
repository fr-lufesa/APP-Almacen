import { Component, inject, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  isInova: boolean = false;
  title = "lufesa";

  private readonly productsService = inject(ProductsService);

  onToggleChange(event: any) {

    this.isInova = event.detail.checked;
    localStorage.setItem('theme', this.isInova ? 'inova' : 'lufesa');

    const empresa = this.isInova ? 'inova' : 'lufesa';
    this.title = empresa;

    localStorage.setItem('empresa', empresa);

    document.body.classList.toggle('inova-theme', this.isInova);
    document.body.classList.toggle('lufesa-theme', !this.isInova);

    this.productsService.get_products();
  }
}
