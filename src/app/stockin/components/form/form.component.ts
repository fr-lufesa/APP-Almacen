import {
  ChangeDetectorRef,
  Component,
  Inject,
  inject,
  Input,
  OnInit,
  Signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { IProduct, IStockin } from 'src/app/models/product_model';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { environment } from 'src/environments/environment.prod';
import { StockoutRequest } from 'src/app/models/stockout_model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: false,
})
export class FormComponent implements OnInit {
  @Input() product: IProduct = {
    idProducto: 0,
    nombre: '',
    idUnidad: 0,
    stockMinimo: 0,
    imagen: '',
  };
  @Input() isEdit?: boolean;
  @Input() isNew?: boolean;
  @Input() isStockin?: boolean;
  @Input() isStockout?: boolean;

  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly alertCtrl = inject(AlertController);
  // private readonly cdr = inject(ChangeDetectorRef);
  modalCtrl = inject(ModalController);
  private toastController = inject(ToastController);

  productForm!: FormGroup;
  title: string = '';
  categories = this.categoriesService.categorias;
  unidadesMedida = this.productService.unidadesMedida;
  imageLoaded: boolean = false;
  urlBase = environment.url;

  ngOnInit() {
    if (this.isNew || this.isEdit) {
      this.categoriesService.getCategories();
    }

    this.productService.getUnidadesMedida();

    this.initializeFormGroup();
    this.setFormGroup();
  }

  submit() {
    if (!this.productForm.valid) return;

    if (this.product.idProducto == 2 || this.product.idProducto == 3 || this.product.idProducto == 29 || this.product.idProducto == 30) {
      this.saveProductoTerminado();
      return;
    }

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
    if (this.isNew || this.isEdit) {
      this.initializeFormForNewProduct();
      return;
    }

    //IF IS STOCKIN OR STOCKOUT
    this.productForm = this.fb.group({
      nombre: ['', Validators.required],
      imagen: [''],
      cantidad: [''],
      proveedor: [''],
      costoUnitario: [''],
      fecha: [],
      // usuario: [''],
    });

    if (this.product.idCategoria === 6) {
      this.productForm.get('costoUnitario')?.disable();
    } else {
      this.productForm.get('costoUnitario')?.enable();
    }
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
        // color: this.product!.color,
        // usuario: this.product!.usuario,
      });

      return;
    }

    if (this.isStockin || this.isStockout) {
      this.productForm.patchValue({
        nombre: this.product!.nombre,
        imagen: this.product!.imagen,
      });
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

  async showAlert(msg: string, err?: any) {
    const alert = await this.alertCtrl.create({
      header: msg,
      message: err,
      cssClass: 'alert-styles',
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async presentToast(
    position: 'top' | 'middle' | 'bottom',
    color: 'danger' | 'success',
    msg: string
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: position,
      color: color,
    });

    await toast.present();
  }

  initializeFormForNewProduct() {
    this.productForm = this.fb.group({
      nombre: [''],
      imagen: [''],
      idCategoria: [],
      idUnidad: [],
      stockMinimo: [, [Validators.min(0)]],
      // color: ['naranja'],
      // usuario: ['francisco']
    });
  }

  saveProduct() {
    this.trimFormValues(this.productForm);

    let newProduct = this.productForm.value;
    newProduct.idProducto = this.product!.idProducto;
    const msg = this.productService
      .editProduct(newProduct)
      .subscribe((resp) => {
        this.showAlert(resp);
        this.modalCtrl.dismiss();
      });
  }

  saveStockin() {
    this.trimFormValues(this.productForm);

    let stockin: IStockin = {
      idProducto: this.product!.idProducto!,
      cantidad: this.productForm.value.cantidad,
      costoUnitario: this.productForm.value.costoUnitario || 0,
      proveedor: this.productForm.value.proveedor,
      fecha: this.productForm.value.fecha,
      // usuario: this.productForm.value.usuario,
    };

    this.productService.stockIn(stockin).subscribe({
      next: (res) => {
        this.showAlert(res.msg);
      },
      error: ({ error: { detail } }) => {
        this.presentToast('bottom', 'danger', detail);
      },
    });
    this.modalCtrl.dismiss();
  }

  saveNewProduct() {
    this.trimFormValues(this.productForm);

    let newProduct = this.productForm.value;
    this.productService.setNewProduct(newProduct).subscribe({
      next: () => this.showAlert('Producto creado y lista actualizada'),
      error: (err) => this.showAlert('Error al guardar producto:', err),
    });
    this.modalCtrl.dismiss();
  }

  trimFormValues(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control && typeof control.value === 'string') {
        control.setValue(control.value.trim());
      }
    });
  }

  async takeAPicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      saveToGallery: true,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    // this.imageLoaded = image.webPath!.length > 0 ? true: false;
    if (image.dataUrl) {
      this.imageLoaded = true;
    }
    this.productForm.patchValue({ imagen: image.dataUrl });
  }

  getNameUnidad() {
    // console.warn(this.product.idUnidad);
    // console.log(this.unidadesMedida());
    const unidad = this.unidadesMedida().find(
      (udm) => udm.idUnidad === this.product.idUnidad
    );
    return unidad ? unidad.nombre : 'Desconocida';
  }

  saveProductoTerminado() {
    if (!this.productForm.valid) return;

    const stockOutProduct: StockoutRequest = {
      idProducto: this.productForm.value.idProducto,
      cantidad: this.productForm.value.cantidad,
      ppto: '',
      fecha: this.productForm.value.fecha,
    };

    this.productService
      .set_producto_terminado(stockOutProduct)
      .subscribe((resp) => {
        console.log(resp);
      });
  }
}
