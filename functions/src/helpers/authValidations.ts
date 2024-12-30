import {User} from "firebase/auth";
import {ResponseProps, SignUpUserProps, SignInUserProps, CustomClaimsRequestProps, DeleteProps, RoleTypes} from "../interfaces/AuthInterfaces";

const signUpUserValidations = (
  response: ResponseProps,
  {fullname, email, password, passwordConfirm}: SignUpUserProps
) => {
  if (!fullname) {
    response = {
      body: {},
      trace: "FIELD_MISSING (fullname)",
      message: "Falta el campo nombre y apellido.",
      code: 1,
    };
  } else if (!email) {
    response = {
      body: {},
      trace: "FIELD_MISSING (email)",
      message: "Falta el campo email.",
      code: 1,
    };
  } else if (!password) {
    response = {
      body: {},
      trace: "FIELD_MISSING (password)",
      message: "Falta el campo contraseña.",
      code: 1,
    };
  } else if (!passwordConfirm) {
    response = {
      body: {},
      trace: "FIELD_MISSING (passwordConfirm)",
      message: "Falta el campo confirmar contraseña.",
      code: 1,
    };
  } else if (fullname.trim() === null || fullname.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (fullname)",
      message: "Falta completar el campo nombre y apellido.",
      code: 1,
    };
  } else if (email.trim() === null ||
  email.trim().length === 0 || !email.trim().includes("@")) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (email)",
      message: "Falta completar el campo email.",
      code: 1,
    };
  } else if (password.trim() === null || password.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (password)",
      message: "Falta completar el campo contraseña.",
      code: 1,
    };
  } else if (
    password.trim().length < 8 ||
        (!password.trim().includes("0") &&
            !password.trim().includes("1") &&
            !password.trim().includes("2") &&
            !password.trim().includes("3") &&
            !password.trim().includes("4") &&
            !password.trim().includes("5") &&
            !password.trim().includes("6") &&
            !password.trim().includes("7") &&
            !password.trim().includes("8") &&
            !password.trim().includes("9"))
  ) {
    response = {
      body: {},
      trace: "PASSWORD_ERROR (password)",
      message: "La contraseña debe poseer al menos 8 caracteres y un número.",
      code: 1,
    };
  } else if (passwordConfirm.trim() === null ||
  passwordConfirm.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (password)",
      message: "Falta completar el campo confirmar contraseña.",
      code: 1,
    };
  } else if (password.trim() !== passwordConfirm.trim()) {
    response = {
      body: {},
      trace: "PASSWORD_ERROR (passwordConfirm)",
      message: "Las contraseñas no coinciden.",
      code: 1,
    };
  }
  return response;
};

const signInUserValidations = (
  response: ResponseProps,
  {email, password}: SignInUserProps) => {
  if (!email) {
    response = {
      body: {},
      trace: "FIELD_MISSING (email)",
      message: "Falta el campo email.",
      code: 1,
    };
  } else if (!password) {
    response = {
      body: {},
      trace: "FIELD_MISSING (password)",
      message: "Falta el campo contraseña.",
      code: 1,
    };
  } else if (email.trim() === null || email.trim().length === 0 ||
  !email.trim().includes("@")) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (email)",
      message: "Falta completar el campo email.",
      code: 1,
    };
  } else if (password.trim() === null || password.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (password)",
      message: "Falta completar el campo contraseña.",
      code: 1,
    };
  }
  return response;
};

const emailValidations = (response: ResponseProps, email: string) => {
  if (!email) {
    response = {
      body: {},
      trace: "FIELD_MISSING (email)",
      message: "Falta el campo email.",
      code: 1,
    };
  } else if (email === null || email.length === 0 || !email.includes("@")) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (email)",
      message: "Falta completar el campo email.",
      code: 1,
    };
  }
  return response;
};

const fullnameValidations = (
  response: ResponseProps,
  displayName: string) => {
  if (!displayName) {
    response = {
      body: {},
      trace: "FIELD_MISSING (displayName)",
      message: "Falta el campo nombre y apellido.",
      code: 1,
    };
  } else if (displayName === null || displayName.length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (displayName)",
      message: "Falta completar el campo nombre y apellido.",
      code: 1,
    };
  }
  return response;
};

const currentUserValidation = (response: ResponseProps, user: User) => {
  if (!user) {
    response = {
      body: {},
      trace: "NOT_EXIST_CURRENT_USER",
      message: "No encontramos el usuario. Por favor, inicia sesión.",
      code: 1,
    };
  }
  return response;
};

const getDocumentValidations = (
  response: ResponseProps,
  collection: string,
  docName: any) => {
  if (!collection) {
    response = {
      body: {},
      trace: "FIELD_MISSING (collection)",
      message: "Falta el campo colección.",
      code: 1,
    };
  } else if (!docName) {
    response = {
      body: {},
      trace: "FIELD_MISSING (docName)",
      message: "Falta el campo documento.",
      code: 1,
    };
  } else if (collection.trim() === null ||
  collection.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (collection)",
      message: "Falta completar el campo colección.",
      code: 1,
    };
  } else if (docName.trim() === null || docName.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (docName)",
      message: "Falta completar el campo documento.",
      code: 1,
    };
  }

  return response;
};

const getUidUserValidations = (
  response: ResponseProps,
  uid: string,
) => {
  if (!uid) {
    response = {
      body: {},
      trace: "FIELD_MISSING (uid)",
      message: "Falta el campo uid.",
      code: 1,
    };
  } else if (uid.trim() === null ||
  uid.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (uid)",
      message: "Falta completar el campo uid.",
      code: 1,
    };
  }

  return response;
};

const tokenValidations = (response: ResponseProps, jwt: string) => {
  if (!jwt) {
    response = {
      body: {},
      trace: "FIELD_MISSING (jwt)",
      message: "Falta el campo jwt.",
      code: 1,
    };
  } else if (jwt.trim() === null || jwt.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (jwt)",
      message: "Falta completar el campo jwt.",
      code: 1,
    };
  }
  return response;
};

const customClaimsValidations = (response: ResponseProps, {uid, field, value}: CustomClaimsRequestProps) => {
  if (!field) {
    response = {
      body: {},
      trace: "FIELD_MISSING (field)",
      message: "Falta el campo field.",
      code: 1,
    };
  } else if (field.trim() === null || field.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (field)",
      message: "Falta completar el campo field.",
      code: 1,
    };
  } else if (!uid) {
    response = {
      body: {},
      trace: "FIELD_MISSING (uid)",
      message: "Falta el campo uid.",
      code: 1,
    };
  } else if (uid.trim() === null || uid.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (uid)",
      message: "Falta completar el campo uid.",
      code: 1,
    };
  } else if (!value) {
    response = {
      body: {},
      trace: "FIELD_MISSING (value)",
      message: "Falta el campo value.",
      code: 1,
    };
  } else if (value.trim() === null || value.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (value)",
      message: "Falta completar el campo value.",
      code: 1,
    };
  }
  return response;
};


const deleteUserValidations = (
  response: ResponseProps,
  body: DeleteProps) => {
  if (body === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else {
    const {
      uid,
    } = body;

    if (uid === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (uid)",
        message: "Falta el campo uid.",
        code: 1,
      };
    }
  }


  return response;
};

const setUpdateUserRoleValidations = (
  response: ResponseProps,
  body: {role: RoleTypes, email: string}) => {
  if (body === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else {
    const {
      role,
      email,
    } = body;

    if (role === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (role)",
        message: "Falta el campo role.",
        code: 1,
      };
    } else if (email === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (email)",
        message: "Falta el campo email.",
        code: 1,
      };
    }
  }

  return response;
};


const deleteUserMemberValidations = (
  response: ResponseProps,
  body: {email: string}) => {
  if (body === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else {
    const {
      email,
    } = body;

    if (email === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (email)",
        message: "Falta el campo email.",
        code: 1,
      };
    }
  }

  return response;
};

export {
  signUpUserValidations,
  signInUserValidations,
  currentUserValidation,
  fullnameValidations,
  emailValidations,
  getDocumentValidations,
  tokenValidations,
  getUidUserValidations,
  customClaimsValidations,
  deleteUserValidations,
  setUpdateUserRoleValidations,
  deleteUserMemberValidations,
};
