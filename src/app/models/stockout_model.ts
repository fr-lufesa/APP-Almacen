export interface StockoutRequest{
    idProducto: number,
    cantidad: number
    ppto: string,
    fecha: Date
    costoUnitario?: number
    // usuario: string  
}