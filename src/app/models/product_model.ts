export class Product {
    idProducto!: string;
    nombre!: string;
    imagen!: string;
    idCategoria!: number;
    unidadMedida!: string;
    stockMinimo!: 0;
    color?: string;
    usuario!: string;
    stock!: number;
    entradas?: number;
}

export interface UpdateStockResponse {

    msg: string,
    stock_actual: number

}