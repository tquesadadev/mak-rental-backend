export type StatusTypes =
    | "active"
    | "deleted"

export interface UpdateStockProps {
    id: number;
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    totalAmount: number;
}

export interface NewStockProps {
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    totalAmount: number;
}

export interface StockProps {
    id: number;
    product: string;
    description: string;
    weight: string;
    serieNumber: string;
    totalAmount: number;
    status: StatusTypes;
}

export interface WorkStockProps {
    id: number;
    amount: number;
}

export interface LetsUpdateStockProps {
    id: number;
    data: {
        product?: string;
        description?: string;
        weight?: string;
        serieNumber?: string;
        totalAmount?: number;
    }
}