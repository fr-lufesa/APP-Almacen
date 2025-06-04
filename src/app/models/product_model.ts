export interface IProduct {
  idProducto?: number;
  nombre: string;
  idCategoria?: number;
  idUnidad: number;
  stockMinimo: number;
  imagen?: string;
  fechaCreacion?: string;
  stock?: number;
  CostoUnitario?: number;
}

export interface StockinResponse {
  msg: string;
}

export interface ProductStockOut {
  idProducto: number;
  nombre: string;
  cantidad: number;
  PPTO: string;
}

export interface IStockin {
  idProducto: number;
  cantidad: number;
  costoUnitario: number;
  proveedor?: string;
  usuario?: string;
}

export interface UnidadMedida {
  idUnidad: number;
  nombre: string;
  abreviatura: string;
}

export type ProductsByCategory = {
  [categoria: string]: IProduct[];
};

export interface ProducsFromRequis {
  id: number;
  nombre: string;
  cantidad: number;
  costoUnitario: number;
  proveedor: string;
}

export interface IProductRequis extends IProduct {
  idRequis: number;
  cantidad: number;
  proveedor: string;
  CostoUnitario: number;
}

export interface IResponseAddRequiOP {
  mensaje: string;
  idProducto?: number;
  idEntrada: number;
}

export interface IStockMovement {
  nombre: string;
  cantidad: number;
  costo_unitario: number;
  fecha: string;
  tipo: string;
}
