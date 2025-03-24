import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Product } from 'src/app/models/product_model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent implements OnInit {

  @Input() product?: Product;

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductsService);
  modalCtrl = inject(ModalController);

  productForm!: FormGroup;
  title: string = "Dar de alta Producto";
  isDisabled: boolean = false;

  ngOnInit() {

    if(this.product) {
      this.title = "Añadir Entrada";
      this.isDisabled = true

      this.productForm = this.fb.group({
        Nombre: [this.product.Nombre, Validators.required],
        Imagen: [this.product.Imagen],
        Categoria: [this.product.Categoria],
        UnidadMedida: [this.product.UnidadMedida],
        StockMinimo: [this.product.StockMinimo, [Validators.required, Validators.min(0)]],
        Color: [this.product.Color],
        Usuario: [this.product.Usuario, Validators.required],
      });
    }
    this.productForm = this.fb.group({
      Nombre: ['', Validators.required],
      Imagen: [''],
      Categoria: [''],
      UnidadMedida: [''],
      StockMinimo: [, [Validators.required, Validators.min(0)]],
      Color: [''],
      Usuario: ['', Validators.required],
    });
  }

  set_product() {
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;
      
      let response = this.productService.set_product(newProduct);  
      this.modalCtrl.dismiss();

    } else {
      console.log('Formulario inválido');
    }
  }


}
