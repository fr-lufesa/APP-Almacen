import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  setNewProduct(product: IProduct): void {
    const url = this.baseUrl + 'product/';
    const headers = { headers: this.getHeaders() };

    this.httpClient.post<IProduct>(url, product, headers).pipe(
      tap(() => this.get_products()) // 👈 recarga automáticamente la lista después de agregar
    ).subscribe({
      next: () => console.log('Producto creado y lista actualizada'),
      error: err => console.error('Error al guardar producto:', err)
    });

  }

  get_products(): void {
    const url = this.baseUrl + 'products/';
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<IProduct[]>(url, headers)
      .subscribe(products => this.productsSubject.next(products));
  }

  stockIn(product: IStockin): Observable<UpdateStockResponse> {
    const url = this.baseUrl + 'products/update_stock';
    const headers = { headers: this.getHeaders() };

    return this.httpClient.post<UpdateStockResponse>(url, product, headers);
  }

  editProduct(product: IProduct): Observable<string> {
    const url = this.baseUrl + 'products/' + product.idProducto;
    const headers = { headers: this.getHeaders() };

    return this.httpClient.put<string>(url, product, headers).pipe(
      tap(() => this.get_products()));
  }

  getUnidadesMedida(): void{
    const url = this.baseUrl + "unidadesMedida/";
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<UnidadMedida[]>(url, headers).subscribe(data=>{
      this.unidadesMedida.set(data);
    });
  }
}
