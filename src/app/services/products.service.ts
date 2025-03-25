import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product, UpdateStockResponse } from '../models/product_model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly httpClient = inject(HttpClient);

  private productsSubject = new BehaviorSubject<Product[]>([]);
  private baseUrl = 'http://192.168.0.174:8000/api/';

  products$ = this.productsSubject.asObservable();

  set_product(product: Product): void{
    const url = this.baseUrl + 'product/';
    const headers = { headers: { 'Content-Type': 'application/json' } };

    this.httpClient.post<Product>(url, product, headers).pipe(
      tap(() => this.get_products()) // 👈 recarga automáticamente la lista después de agregar
    ).subscribe({
      next: () => console.log('Producto creado y lista actualizada'),
      error: err => console.error('Error al guardar producto:', err)
    });

  }

  get_products(): void{
    const url = this.baseUrl + 'products/';

    this.httpClient.get<Product[]>(url)
    .subscribe(products => this.productsSubject.next(products));
  }

  updateProductStock(product: { idProducto: number; cantidad: number }): string {
    const url = this.baseUrl + 'products/update_stock';
    let msg = "";

    try {
      this.httpClient.put<UpdateStockResponse>(url, product).subscribe(response=>{
        this.get_products();
        msg = response.msg;
      })
    } catch (error) {
      console.log("Error al actualizar: " + error);
      msg = "error";
    }

    return msg;
  }
}
