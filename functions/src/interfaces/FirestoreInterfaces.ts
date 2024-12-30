
export interface GetDocumentsRequestProps {
    collection: string;
    id: string | null;
    where: {
        field: string;
        filter: FirebaseFirestore.WhereFilterOp;
        value: any;
    } | null;
    order: {
        field: string;
        direction: "asc" | "desc";
    } | null
}

export interface AddSetDocumentRequestProps {
    collection: string;
    id: string | null;
    doc: object;
}

export interface UpdateDocumentRequestProps {
    collection: string;
    id: string;
    doc: object;
}

export interface DeleteDocumentRequestProps {
    collection: string;
    id: string;
}
