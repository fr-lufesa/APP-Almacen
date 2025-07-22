export interface StockoutRequest{
    idProducto: number,
    cantidad: number
    ppto?: string,
    proveedor?: string,
    fecha: Date
    costoUnitario?: number
    saco_blanco?: boolean
    // usuario: string  
}