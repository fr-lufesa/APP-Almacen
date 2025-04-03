import { computed, inject, Injectable, signal } from '@angular/core';
import { ProductStockOut } from '../models/product_model';
import { StockoutRequest } from '../models/stockout_model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable({
  providedIn: 'root'
})
export class StockoutService {

  private readonly httpClient = inject(HttpClient);
  private productsOut = signal<ProductStockOut[]>([]);
  private readonly productsService = inject(ProductsService);

  // Exposición pública del carrito (readonly)
  readonly cart = computed(() => this.productsOut());
  urlBase: string = "http://192.168.0.174:8000/api";

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  // Agregar producto al carrito (o actualizar cantidad si ya existe)
  // addProduct(producto: ProductStockOut) {
  //   const actual = this.productsOut();
  //   const index = actual.findIndex(p => p.idProducto === producto.idProducto);

  //   console.log("Información actual de productos en cart: ", actual);
  //   console.warn("Producto encontrado en el indice: ", index);

  //   if (index > -1) {
  //     const actualizado = [...actual];
  //     actualizado[index] = {
  //       ...actualizado[index],
  //       cantidad: actualizado[index].cantidad + producto.cantidad
  //     };
  //     this.productsOut.set(actualizado);
  //   } else {
  //     this.productsOut.set([...actual, producto]);
  //   }

  //   console.log("Lista actual: ", this.productsOut());
  // }

  // // Quitar producto del carrito
  // quitProduct(idProducto: number) {
  //   const actual = this.productsOut().filter(p => p.idProducto !== idProducto);
  //   this.productsOut.set(actual);
  // }

  // // Limpiar todo el carrito
  // cleanCart() {
  //   this.productsOut.set([]);
  // }

  // // Obtener un producto específico (opcional)
  // getProduct(idProducto: number): ProductStockOut | undefined {
  //   return this.productsOut().find(p => p.idProducto === idProducto);
  // }

  stockOutProduct(item: StockoutRequest): Observable<any>{
    const url = this.urlBase + "/salidas/";
    const headers = { headers: this.getHeaders() };

    return this.httpClient.post<any>(url, item, headers).pipe(
      tap(() => this.productsService.get_products()));

  }

}
