import { StockProps } from "../interfaces/StockInterfaces";

export const initialStateNewStock: StockProps = {
    id: 0,
    product: '',
    description: '',
    totalAmount: 1,
    serieNumber: '',
    pricePerDay: 0,
    pricePerWeek: 0,
    pricePerMonth: 0,
    weight: '',
    status: 'active'
}
