import { WorkStockProps, ThirdPartyStockProps } from "./StockInterfaces";

export type FieldLocationPathTypes =
    | "active"
    | "deleted"

export type ChangeStateTypes =
    | "changed"
    | "toApprove"
    | "approved"

export type StateNameTypes =
    | "A confirmar"
    | "Para entregar"
    | "Para retirar"
    | "Falta cobrar"
    | "Terminado"

export type PaymentMethodTypes =
    | "No definido"
    | "Efectivo"
    | "Transferencia bancaria"
    | "Dólares"
    | "Cheque físico"
    | "Echeq"

export type PaymentInstanceTypes =
    | "Al momento de la entrega"
    | "Al momento del retiro"
    | "Indicar fecha y hora"

export type GroupTypes =
    | "Trabajos a confirmar"
    | "Trabajos activos"
    | "Trabajos terminados"

export type InvoiceTypes =
    | "Sin factura"
    | "Factura A"
    | "Factura B"
    | "Factura C"

export type HourFieldTypes =
    | "Horario específico"
    | "Antes de las..."
    | "Después de las..."
    | "Intervalo de horas"

export type TimeTypes =
    | "00:00hs"
    | "00:30hs"
    | "01:00hs"
    | "01:30hs"
    | "02:00hs"
    | "02:30hs"
    | "03:00hs"
    | "03:30hs"
    | "04:00hs"
    | "04:30hs"
    | "05:00hs"
    | "05:30hs"
    | "06:00hs"
    | "06:30hs"
    | "07:00hs"
    | "07:30hs"
    | "08:00hs"
    | "08:30hs"
    | "09:00hs"
    | "09:30hs"
    | "10:00hs"
    | "10:30hs"
    | "11:00hs"
    | "11:30hs"
    | "12:00hs"
    | "12:30hs"
    | "13:00hs"
    | "13:30hs"
    | "14:00hs"
    | "14:30hs"
    | "15:00hs"
    | "15:30hs"
    | "16:00hs"
    | "16:30hs"
    | "17:00hs"
    | "17:30hs"
    | "18:00hs"
    | "18:30hs"
    | "19:00hs"
    | "19:30hs"
    | "20:00hs"
    | "20:30hs"
    | "21:00hs"
    | "21:30hs"
    | "22:00hs"
    | "22:30hs"
    | "23:00hs"
    | "23:30hs"

export interface StateWorkProps {
    id: number;
    name: StateNameTypes;
    color: string;
}

export interface ChangeStateActivityProps {
    stateFrom: StateWorkProps;
    stateTo: StateWorkProps;
    status: ChangeStateTypes;
}

export interface ActivityProps {
    id: number;
    text: string;
    date: number;
    creator: string;
    changeState?: ChangeStateActivityProps;
}

export interface CommentProps {
    id: number;
    text: string;
    date: number;
    creator: string;
}

export interface PaymentProps {
    id: number;
    payed: boolean;
    datePayed: number | null;
    responsiblePayed: string | null;
    price: number;
    profit: number;
    paymentMethod: PaymentMethodTypes;
    invoicing: InvoiceTypes;
    invoiceReference: string;
    transactionId: string;
}

export interface SetDateTimeProps {
    id: number;
    date: number;
    hourType: HourFieldTypes;
    hourStart: TimeTypes;
    hourEnd: TimeTypes;
}

export interface QuoteProps {
    id: number;
    needNewQuote: boolean;
}

export interface WorkProps {
    id: number;
    deliveryDate: SetDateTimeProps;
    retirementDate: SetDateTimeProps;
    daysAmount: number;
    stock: WorkStockProps[];
    thirdPartyStock: ThirdPartyStockProps | null;
    shipping: number;
    payment: PaymentProps;
    quote: QuoteProps;
    clientId: number;
    address: string;
    state: StateWorkProps;
    creator: string;
    createdDate: number;
    activity: ActivityProps[],
    comments: CommentProps[],
    status: FieldLocationPathTypes,
}

export interface NewWorkProps {
    deliveryDate: SetDateTimeProps;
    retirementDate: SetDateTimeProps;
    daysAmount: number;
    stock: WorkStockProps[];
    thirdPartyStock: ThirdPartyStockProps | null;
    shipping: number;
    payment: PaymentProps;
    quote: QuoteProps;
    clientId: number;
    address: string;
    state: StateWorkProps;
    activity: ActivityProps[],
}

export interface LetsUpdateWorkProps {
    id: number;
    data: {
        deliveryDate?: SetDateTimeProps;
        retirementDate?: SetDateTimeProps;
        daysAmount?: number;
        stock?: WorkStockProps[];
        thirdPartyStock?: ThirdPartyStockProps | null;
        shipping?: number;
        payment?: PaymentProps;
        quote?: QuoteProps;
        clientId?: number;
        address?: string;
        state?: StateWorkProps;
        creator?: string;
        createdDate?: number;
        activity?: ActivityProps[],
        comments?: CommentProps[],
    }
}