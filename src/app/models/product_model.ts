export interface IProduct {
    idProducto: number;
    nombre: string;
    idCategoria?: number;
    idUnidad: number;
    // color?: string;
    stockMinimo: number;
    imagen?: string;
    fechaCreacion?: string;
    // usuario?: string;
    stock?: number;
    CostoUnitario?: number;
}

export interface UpdateStockResponse {
    msg: string,
}

export interface ProductStockOut {
    idProducto: number;
    nombre: string;
    cantidad: number;
}

export interface IStockin {
    idProducto: number;
    cantidad: number;
    costoUnitario: number;
    proveedor?: string;
    usuario?: string;
}

export interface UnidadMedida{
    idUnidad: number;
    nombre: string;
    abreviatura: string;

}

export type ProductsByCategory = {
    [categoria: string]: IProduct[];
  };