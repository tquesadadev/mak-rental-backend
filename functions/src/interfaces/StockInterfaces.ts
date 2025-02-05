export type StatusTypes =
    | "active"
    | "deleted"

export interface UpdateStockProps {
    id: number;
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    pricePerDay: string;
    pricePerWeek: string;
    pricePerMonth: string;
    totalAmount: number;
}

export interface NewStockProps {
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    pricePerDay: number;
    pricePerWeek: number;
    pricePerMonth: number;
    totalAmount: number;
}

export interface StockProps {
    id: number;
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    totalAmount: number;
    pricePerDay: number;
    pricePerWeek: number;
    pricePerMonth: number;
    status: StatusTypes;
}

export interface ShippingProps {
    id: number;
    amount: number;
}

export interface WorkStockProps {
    id: number;
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    pricePerDay: number;
    pricePerWeek: number;
    pricePerMonth: number;
    totalAmount: number;
}

export interface LetsUpdateStockProps {
    id: number;
    data: {
        product?: string;
        description?: string;
        weight?: string;
        serieNumber?: string;
        pricePerDay?: number;
        pricePerWeek?: number;
        pricePerMonth?: number;
        totalAmount?: number;
    }
}


// THIRD PARTY STOCK

export interface ThirdPartyStockItemProps {
    id: number;
    product: string;
    description: string;
    costPrice: number;
    clientPrice: number;
    profit: number;
}

export interface ThirdPartyStockProps {
    data: ThirdPartyStockItemProps[];
    invoiceReference: number | null;
}
