import {LoteProps} from "./ClientInterfaces";

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
    lotes: LoteProps[];
    week: WeekPayedProps;
}

export interface MarkAsPayedProps {
    loteNumber: number;
    week: WeekPayedProps;
}
