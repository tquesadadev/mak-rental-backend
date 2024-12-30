
export interface NewClientLoteProps {
    loteNumber: number;
    price: number;
    categoryId: number;
}

export interface LoteProps {
    loteNumber: number;
    price: number;
    categoryId: number;
    originalStartDate: number;
    startDate: number;
    endDate: number | null;
}

export type StatusTypes =
    | "active"
    | "deleted"

export interface NewClientProps {
    name: string;
    phone: string;
    lotes: NewClientLoteProps[]
}

export interface UpdateClientProps {
    id: number;
    name: string;
    phone: string;
    status: StatusTypes;
    lotes: LoteProps[]
}

export interface ClientProps {
    id: number;
    name: string;
    phone: string;
    status: StatusTypes;
    lotes: LoteProps[]
}

export interface LetsUpdateClientProps {
    id: number;
    data: {
        name?: string;
        phone?: string;
        lotes?: NewClientLoteProps[]
    }
}

export interface LetsUpdateLoteProps {
    loteNumber: number;
    data: {
        clientId?: number | null;
        categoryId?: number;
        price?: number;
    }
}
