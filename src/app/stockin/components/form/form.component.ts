import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Category } from 'src/app/models/category_model';
import { Product } from 'src/app/models/product_model';
import { CategoriesService } from 'src/app/services/categories.service';
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
  private readonly categoriesService = inject(CategoriesService);
  private readonly alertCtrl = inject(AlertController);
  modalCtrl = inject(ModalController);

  productForm!: FormGroup;
  title: string = "Dar de alta un producto";
  isNewProduct: boolean = true;
  categories = this.categoriesService.categorias;

  ngOnInit() {

    this.categoriesService.get_categories();

    this.initializeFormGroup();

    if (this.product) {
      this.title = "Añadir Entrada";
      this.isNewProduct = false
      this.setFormGroup();
    }

  }

  set_product() {
    if (this.productForm.valid) {

      const newProduct: Product = this.productForm.value;

      if (this.product) {
        let idProducto = Number(this.product.idProducto);
        let entradas = Number(this.productForm.get('entradas')?.value);

        const msg = this.productService.updateProductStock({ idProducto: idProducto, cantidad: entradas });
        this.modalCtrl.dismiss();
        this.showAlert(msg);
        return;
      }

      this.productService.set_product(newProduct);
      this.modalCtrl.dismiss();

    } else {
      console.log('Formulario inválido');
    }
  }


  initializeFormGroup() {

    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: [''],
      idCategoria: [null],
      unidadMedida: [''],
      stockMinimo: [, [Validators.required, Validators.min(0)]],
      color: [''],
      usuario: ['', Validators.required],
      stock: [0],
    });

    if (this.product) {
      this.productForm.addControl('entradas', this.fb.control(null)); // opcional
    }

  }
  setFormGroup() {

    if (this.product) {
      this.productForm.get('Stock')?.setValidators([
        Validators.required,
        this.minStockValidator(this.product!.stock)
      ]);

      this.productForm.patchValue({
        nombre: this.product!.nombre,
        imagen: this.product!.imagen,
        idCategoria: this.product!.idCategoria,
        unidadMedida: this.product!.unidadMedida,
        stockMinimo: this.product!.stockMinimo,
        color: this.product!.color,
        usuario: this.product!.usuario,
        stock: this.product!.stock,
        entradas: 0
      })
    }

  }

  minStockValidator(minStock: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value !== null && value < minStock) {
        return { minStock: { requiredMin: minStock, actual: value } };
      }

      return null;
    };

  }

  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: msg,
      // subHeader: '',
      message: 'El stock ha sido actualizado',

      buttons: ['Aceptar'],
    });

    await alert.present();
  }
}
