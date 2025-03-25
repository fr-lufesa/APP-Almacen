import { HttpClient } from '@angular/common/http';
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

  get_categories(): void{
    const url = this.urlBase + "/categories/";

    this.httpClient.get<Category[]>(url).subscribe(data=>{
      this.categorias.set(data);
    });
  }
}
