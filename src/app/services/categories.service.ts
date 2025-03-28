import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category_model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly httpClient = inject(HttpClient);
  readonly categorias = signal<Category[]>([]);
  urlBase: string = "http://192.168.0.174:8000/api";

  getHeaders(): HttpHeaders {
    const empresa = localStorage.getItem('empresa') || 'inova';
    return new HttpHeaders({ 'x-empresa': empresa });
  }

  getCategories(): void{
    const url = this.urlBase + "/categories/";
    const headers = { headers: this.getHeaders() };

    this.httpClient.get<Category[]>(url, headers).subscribe(data=>{
      this.categorias.set(data);
    });
  }
}
