import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductStockOut } from '../models/product_model';
import { StockoutRequest } from '../models/stockout_model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProductsService } from './products.service';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class StockoutService {

  private readonly httpClient = inject(HttpClient);
  private productsOut = signal<ProductStockOut[]>([]);
  private readonly productsService = inject(ProductsService);

  // Exposición pública del carrito (readonly)
  readonly cart = computed(() => this.productsOut());
  urlBase: string = environment.url;

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  stockOutProduct(item: StockoutRequest): Observable<any>{
    const url = this.urlBase + "api/stockout/";
    const headers = { headers: this.getHeaders() };

    return this.httpClient.post<any>(url, item, headers).pipe(
      tap(() => this.productsService.get_products()));
  }

  getPPTOS(): Observable<string[]>{
    return this.httpClient.get<string[]>(this.urlBase + 'pptos');
  }

}
