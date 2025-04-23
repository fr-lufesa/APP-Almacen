import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IStockin, IProduct, UnidadMedida, ProductsByCategory, StockinResponse, ProducsFromRequis } from '../models/product_model';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private readonly httpClient = inject(HttpClient);

  private productsSubject = new BehaviorSubject<ProductsByCategory>({});
  readonly urlBase: string = environment.url;
  readonly unidadesMedida = signal<UnidadMedida[]>([]);
  products$ = this.productsSubject.asObservable();

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  setNewProduct(product: IProduct): Observable<IProduct> {
    const url = this.urlBase + 'api/product/';
    const headers = { headers: this.getHeaders() };

    return this.httpClient.post<IProduct>(url, product, headers).pipe(
      tap(() => this.get_products()) // 👈 recarga automáticamente la lista después de agregar
    );

  }

  get_products(): void {
    const url = this.urlBase + 'api/products/';
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<ProductsByCategory>(url, headers)
      .subscribe(products => this.productsSubject.next(products));
  }

  stockIn(product: IStockin): Observable<StockinResponse> {
    const url = this.urlBase + 'api/products/stockin';
    const headers = { headers: this.getHeaders() };

    return this.httpClient.post<StockinResponse>(url, product, headers).pipe(
      tap(() => this.get_products()));
  }

  editProduct(product: IProduct): Observable<string> {
    const url = this.urlBase + 'api/products/' + product.idProducto;
    const headers = { headers: this.getHeaders() };

    return this.httpClient.put<string>(url, product, headers).pipe(
      tap(() => this.get_products()));
  }

  getUnidadesMedida(): void {
    const url = this.urlBase + "api/unidadesMedida/";
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<UnidadMedida[]>(url, headers).subscribe(data => {
      this.unidadesMedida.set(data);
    });

    console.log("🚨 URL final usada:", url);

  }

  deleteProduct(idProduct: number) {
    const url = this.urlBase + `api/products/${idProduct}`;
    const headers = { headers: this.getHeaders() };

    return this.httpClient.delete<{ mensaje: string }>(url, headers).pipe(
      tap(() => this.get_products()));

  }

  verify_product(productParam: any): Observable<string> {
    const url = this.urlBase + `api/products/exist_product/${productParam.nombre}`;
    const headers = { headers: this.getHeaders() };
  
    return this.httpClient.get<number>(url, headers).pipe(
      switchMap(idProducto => {
        const stockin: IStockin = {
          idProducto: idProducto,
          cantidad: productParam.cantidad,
          costoUnitario: productParam.costoUnitario,
          proveedor: productParam.proveedor
        };
        return this.stockIn(stockin).pipe(
          map(() => "Stock registrado")
        );
      }),
      catchError(err => {
        if (err.status === 404) {

          const product: IProduct = {
            idUnidad: 1,
            nombre: productParam.nombre,
            stockMinimo: 10,
            imagen: '',
            CostoUnitario: productParam.costoUnitario,
            idCategoria: 1,            
          }

          return this.setNewProduct(product).pipe(
            switchMap(resp => {
              const stockin: IStockin = {
                idProducto: resp.idProducto!,
                cantidad: productParam.cantidad,
                costoUnitario: productParam.costoUnitario,
                proveedor: productParam.proveedor
              };
              return this.stockIn(stockin).pipe(
                map(() => "Producto creado y stock registrado")
              );
            })
          );
        }
        return throwError(() => new Error("Error desconocido: " + err.message));
      })
    );
  }

  get_info_from_requis(): Observable<ProducsFromRequis[]>
  {
    const url = this.urlBase + `api/almacen/get_info_from_requis/`;
    const headers = { headers: this.getHeaders() };

    return this.httpClient.get<ProducsFromRequis[]>(url, headers);
  }
}