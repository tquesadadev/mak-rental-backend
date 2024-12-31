export type StatusTypes =
    | "active"
    | "deleted"

export interface NewClientProps {
    name: string;
    document: string;
    phone: string;
    address: string;
    mail: string;
}

export interface UpdateClientProps {
    id: number;
    name: string;
    document: string;
    phone: string;
    address: string;
    mail: string;
}

export interface ClientProps {
    id: number;
    name: string;
    document: string;
    phone: string;
    address: string;
    mail: string;
    status: StatusTypes;
}

export interface LetsUpdateClientProps {
    id: number;
    data: {
        name?: string;
        document?: string;
        phone?: string;
        address?: string;
        mail?: string;
    }
}
