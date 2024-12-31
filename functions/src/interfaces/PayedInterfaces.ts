
export interface WeekPayedProps {
        startDate: number;
        endDate: number;
}

export interface PayedProps {
    id: number;
    date: number;
    clientId: number;
    author: string;
    amount: number;
    lotes: any[];
    // lotes: LoteProps[];
    week: WeekPayedProps;
}

export interface MarkAsPayedProps {
    loteNumber: number;
    week: WeekPayedProps;
}
