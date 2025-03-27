import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IStockin, IProduct, UpdateStockResponse, UnidadMedida } from '../models/product_model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly httpClient = inject(HttpClient);

  private productsSubject = new BehaviorSubject<IProduct[]>([]);
  private baseUrl = 'http://192.168.0.174:8000/api/';
  readonly unidadesMedida = signal<UnidadMedida[]>([]);
  
  products$ = this.productsSubject.asObservable();

  setNewProduct(product: IProduct): void {
    const url = this.baseUrl + 'product/';
    const headers = { headers: { 'Content-Type': 'application/json' } };

    this.httpClient.post<IProduct>(url, product, headers).pipe(
      tap(() => this.get_products()) // 👈 recarga automáticamente la lista después de agregar
    ).subscribe({
      next: () => console.log('Producto creado y lista actualizada'),
      error: err => console.error('Error al guardar producto:', err)
    });

  }

  get_products(): void {
    const url = this.baseUrl + 'products/';

    this.httpClient.get<IProduct[]>(url)
      .subscribe(products => this.productsSubject.next(products));
  }

  stockIn(product: IStockin): Observable<UpdateStockResponse> {
    const url = this.baseUrl + 'products/update_stock';
    return this.httpClient.post<UpdateStockResponse>(url, product);
  }

  editProduct(product: IProduct): Observable<string> {
    const url = this.baseUrl + 'products/' + product.idProducto;

    return this.httpClient.put<string>(url, product).pipe(
      tap(() => this.get_products()));
  }

  getUnidadesMedida(): void{
    const url = this.baseUrl + "unidadesMedida/";

    this.httpClient.get<UnidadMedida[]>(url).subscribe(data=>{
      this.unidadesMedida.set(data);
    });
  }
}
