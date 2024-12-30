
export interface SignUpUserProps {
    fullname: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export interface SignInUserProps {
    email: string;
    password: string;
}


export interface ResponseProps {
    body: any,
    trace: string,
    message: string,
    code: number,
}

export interface CustomClaimsRequestProps {
    uid: string;
    field: string;
    value: any;
}

export interface DeleteProps {
    uid: string;
}

export type RoleTypes =
    | "Administrador"
    | "Proveedor"
    | "None"

export interface AccessProps {
    id: number;
    name: string;
    email: string;
    role: RoleTypes;
}
