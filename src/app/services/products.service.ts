import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../models/product_model';
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
}
