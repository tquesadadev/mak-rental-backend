import {getErrorFormat} from "../constants/errors";
import {DecodedIdToken, UserRecord, getAuth} from "firebase-admin/auth";
import {CustomClaimsRequestProps, DeleteProps, SignUpUserProps} from "../interfaces/AuthInterfaces";
import {customClaimsValidations, deleteUserValidations, signUpUserValidations, tokenValidations} from "../helpers/authValidations";

// VERIFICA EL TOKEN Y DEVUELVE EL UID
export const verifyToken = (async (request:any, response:any) => {
  const jwt = request.headers.authorization;

  response = tokenValidations(response, jwt);

  if (response.code === 0) {
    const token = jwt.replace("Bearer ", "");

    const adminAuth = getAuth();

    await adminAuth.verifyIdToken(token, true)
      .then((decodedIdToken: DecodedIdToken) => {
        response = {
          body: {
            uid: decodedIdToken.uid,
            email: decodedIdToken.email,

          },
          trace: "ID_TOKEN_VERIFIED",
          message: "Sesión verificada correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: null,
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// VERIFICA EL TOKEN Y DEVUELVE EL USER
export const getUserByJwt = (async (uid:string, response:any) => {
  if (response.code === 0) {
    const adminAuth = getAuth();

    await adminAuth.getUser(uid)
      .then((user) => {
        response = {
          body: {
            user: user,
          },
          trace: "USER_FOUNDED",
          message: "Usuario encontrado correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: {
            user: null,
          },
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// VERIFICA EL TOKEN Y DEVUELVE EL USER
export const getUserByEmail = (async (email:string, response:any) => {
  if (response.code === 0) {
    const adminAuth = getAuth();

    await adminAuth.getUserByEmail(email)
      .then((user) => {
        response = {
          body: {
            user: user,
          },
          trace: "USER_FOUNDED",
          message: "Usuario encontrado correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: {
            user: null,
          },
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// REVOCA LOS TOKENS DE UN USUARIO
export const revokeToken = (async (uid: string, response:any) => {
  const adminAuth = getAuth();

  if (response.code === 0) {
    await adminAuth
      .revokeRefreshTokens(uid)
      .then(() => {
        response = {
          body: null,
          trace: "REFRESH_TOKENS_REVOKED",
          message: "Sesión revocada correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: null,
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// CREA UN NUEVO USUARIO
export const createUser = (async (request:any, response:any) => {
  const adminAuth = getAuth();

  response = signUpUserValidations(response, request.body as SignUpUserProps);

  const {email, fullname, password} = request.body as SignUpUserProps;

  if (response.code === 0) {
    await adminAuth
      .createUser({
        displayName: fullname,
        email,
        password,
        disabled: true,
      })
      .then((user: UserRecord) => {
        response = {
          body: {
            user: {
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
            },
          },
          trace: "USER_CREATED",
          message: "Usuario creado correctamente.",
          code: 0,
        };
      })

      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: null,
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// SETEA VALORES PERSONALIZADOS A UN USUARIO
export const setCustomClaims = (async (request:any, response:any) => {
  const adminAuth = getAuth();

  response = customClaimsValidations(response, request.body as CustomClaimsRequestProps);

  const {uid, field, value} = request.body as CustomClaimsRequestProps;

  if (response.code === 0) {
    await adminAuth
      .setCustomUserClaims(uid, {[field]: value})
      .then(() => {
        response = {
          body: null,
          trace: "USER_CUSTOM_CLAIMS_ADDED",
          message: "Valores agregados correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: {
            user: null,
          },
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// ACTUALIZAR USUARIO
export const updateUser = (async (uid: string, request:any, response:any) => {
  const adminAuth = getAuth();

  if (response.code === 0) {
    await adminAuth
      .updateUser(uid, request.body)
      .then(() => {
        response = {
          body: null,
          trace: "USER_UPDATED",
          message: "Datos actualizados correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: {
            user: null,
          },
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// OBTENER VALORES PERSONALIZADOS A UN USUARIO
export const getCustomClaims = (async (uid:string, response:any) => {
  if (response.code === 0) {
    const adminAuth = getAuth();

    await adminAuth.getUser(uid)
      .then((user) => {
        response = {
          body: {
            claims: user.customClaims,
          },
          trace: "CLAIMS_FOUNDED",
          message: "Valores encontrados correctamente.",
          code: 0,
        };
      })
      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: {
            user: null,
          },
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// CREA UN NUEVO USUARIO
export const deleteUser = (async (request:any, response:any) => {
  const adminAuth = getAuth();

  response = deleteUserValidations(response, request.body as DeleteProps);

  const {uid} = request.body as DeleteProps;

  if (response.code === 0) {
    await adminAuth
      .deleteUser(uid)
      .then(() => {
        response = {
          body: null,
          trace: "USER_DELETED",
          message: "Usuario eliminado correctamente.",
          code: 0,
        };
      })

      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: null,
          trace,
          message,
          code,
        };
      });
  }

  return response;
});

// OBTENER USUARIOS
export const getUsers = (async (response:any) => {
  const adminAuth = getAuth();

  if (response.code === 0) {
    await adminAuth
      .listUsers()
      .then((list) => {
        response = {
          body: list.users,
          trace: "USERS_FOUNDED",
          message: "Información encontrada correctamente.",
          code: 0,
        };
      })

      .catch((error: Error) => {
        const {code, message, trace} = getErrorFormat(error);

        response = {
          body: null,
          trace,
          message,
          code,
        };
      });
  }

  return response;
});
