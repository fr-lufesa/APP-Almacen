export interface StockoutRequest{
    idProducto: number,
    cantidad: number
    ppto?: string,
    fecha: Date
    costoUnitario?: number
    // saco_blanco?: boolean
    // usuario: string  
}