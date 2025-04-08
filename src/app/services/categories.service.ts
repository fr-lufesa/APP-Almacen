import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category_model';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly httpClient = inject(HttpClient);
  readonly categorias = signal<Category[]>([]);
  urlBase: string = environment.url;

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  getCategories(): void{
    const url = this.urlBase + "api/categories/";
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<Category[]>(url, headers).subscribe(data=>{
      this.categorias.set(data);
      
    });
  }
}
