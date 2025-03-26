export interface IProduct {
    idProducto: number;
    nombre: string;
    idCategoria?: string;
    unidadMedida: string;
    color?: string;
    stockMinimo: number;
    imagen?: string;
    fechaCreacion?: string;
    recibio: string;
    stock?: number;
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
    recibio?: string;
}