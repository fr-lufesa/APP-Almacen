import { Component, inject, Input, OnInit, Signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { IProduct, IStockin } from 'src/app/models/product_model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false
})
export class FormComponent implements OnInit {

  @Input() product?: IProduct;
  @Input() isEdit?: boolean;
  @Input() isNew?: boolean;
  @Input() isStockin?: boolean;
  @Input() isStockout?: boolean;

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly alertCtrl = inject(AlertController);
  modalCtrl = inject(ModalController);

  productForm!: FormGroup;
  title: string = "";
  categories = this.categoriesService.categorias;
  unidadesMedida = this.productService.unidadesMedida;

  ngOnInit() {
    if (this.isNew || this.isEdit){
      this.categoriesService.getCategories();
      this.productService.getUnidadesMedida();

    };

    this.initializeFormGroup();
    this.setFormGroup();
  }

  submit() {
    if (!this.productForm.valid) return;

    if (this.isEdit) {
      this.saveProduct();
      return;
    }

    if (this.isStockin) {
      this.saveStockin();
      return;
    }

    if (this.isNew) {
      this.saveNewProduct();
    }

  }


  initializeFormGroup() {

    if (this.isNew || this.isEdit) { this.initializeFormForNewProduct(); return; }

    //IF IS STOCKIN OR STOCKOUT
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: [''],
      cantidad: [''],
      proveedor: [''],
      costoUnitario: [''],
      usuario: [''],
    });
  }

  setFormGroup() {

    // this.productForm.get('Stock')?.setValidators([
    //   Validators.required,
    //   this.minStockValidator(this.product!.stock!)
    // ]);

    if (this.isEdit) {
      this.productForm.patchValue({
        nombre: this.product!.nombre,
        imagen: this.product!.imagen,
        idCategoria: this.product!.idCategoria,
        idUnidad: this.product!.idUnidad,
        stockMinimo: this.product!.stockMinimo,
        color: this.product!.color,
        usuario: this.product!.usuario,
      })

      return;
    }


    if (this.isStockin || this.isStockout) {
      this.productForm.patchValue({
        nombre: this.product!.nombre,
        imagen: this.product!.imagen,
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

      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  initializeFormForNewProduct() {
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: [''],
      idCategoria: [null],
      idUnidad: [''],
      stockMinimo: [, [Validators.required, Validators.min(0)]],
      color: [''],
      usuario: ['']
    });
  }


  saveProduct() {
    let newProduct = this.productForm.value;
    newProduct.idProducto = this.product!.idProducto;
    const msg = this.productService.editProduct(newProduct).subscribe(resp => {
      this.showAlert(resp);
      this.modalCtrl.dismiss();
    })
  }

  saveStockin() {
    let stockin: IStockin = {
      idProducto: this.product!.idProducto,
      cantidad: this.productForm.value.cantidad,
      costoUnitario: this.productForm.value.costoUnitario,
      proveedor: this.productForm.value.proveedor,
      usuario: this.productForm.value.usuario,
    };

    this.productService.stockIn(stockin).subscribe({
      next: (res) => {
        this.showAlert(res.msg);
      },
      error: (err) => {
        console.error('Error al actualizar stock', err);
      }
    })
    this.modalCtrl.dismiss();
  }

  saveNewProduct() {
    let newProduct = this.productForm.value;
    this.productService.setNewProduct(newProduct);
    this.modalCtrl.dismiss();
  }


}
