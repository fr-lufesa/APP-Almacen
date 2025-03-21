import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit {


  products: Product[] = [
    {
      name: "Concrefast",
      imageUrl: "https://ionicframework.com/docs/img/demos/avatar.svg"
    },
    {
      name: "Esponja",
      imageUrl: "https://ionicframework.com/docs/img/demos/avatar.svg"
    },
  ]
  filteredProducts: Product[] = [];
  searchTerm: string = '';


  ngOnInit() { 
    this.filteredProducts = this.products;
   }

   searchProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(term)
    );
  }
}

class Product {
  name!: string;
  imageUrl!: string;
}

