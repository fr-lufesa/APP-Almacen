import { Component, inject, OnInit } from '@angular/core';
import { ProductStockOut } from 'src/app/models/product_model';
import { StockoutService } from 'src/app/services/stockout.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  standalone: false
})
export class CartComponent {
  
  private readonly stockOutService = inject(StockoutService);

  cart = this.stockOutService.cart;
  
  aumentarCantidad(producto: ProductStockOut) {
    const nuevo = { ...producto, cantidad: 1 };
    this.stockOutService.addProduct(nuevo); // suma sobre existente
  }

  disminuirCantidad(producto: ProductStockOut) {
    if (producto.cantidad <= 1) {
      this.eliminarProducto(producto.idProducto);
    } else {
      const actualizado = { ...producto, cantidad: -1 }; // se restará en addProduct()
      this.stockOutService.addProduct(actualizado);
    }
  }

  eliminarProducto(id: number) {
    this.stockOutService.quitProduct(id);
  }

}
