import * as logger from "firebase-functions/logger";

export const handleError = (error: Error, response: any) => {
  logger.error(error);
  console.error(error);

  const {code, message, trace} = getErrorFormat(error);

  response = {
    body: null,
    trace,
    message,
    code,
  };

  return response;
};

export const getErrorFormat = (error: Error) => {
  let err = error.toString();

  err = err.replace("FirebaseError: Firebase: Error (", "");
  err = err.replace(").", "");

  switch (err) {
  case "auth/claims-too-large":
    return {
      trace: "AUTH_CLAIMS_TOO_LARGE (" + err + ")",
      message: `Hay demasiados reclamos en este momento. 
      Intentá en unos minutos.`,
      code: 2,
    };
  case "auth/email-already-exists":
    return {
      trace: "AUTH_EMAIL_ALREADY_EXISTS (" + err + ")",
      message: "El email que ingresó ya se encuentra registrado.",
      code: 3,
    };
  case "auth/email-already-in-use":
    return {
      trace: "AUTH_EMAIL_ALREADY_IN_USE (" + err + ")",
      message: "El email que ingresó ya se encuentra en uso.",
      code: 4,
    };
  case "auth/wrong-password":
    return {
      trace: "AUTH_EMAIL_ALREADY_EXISTS (" + err + ")",
      message: "La contraseña que ingresó es incorrecta.",
      code: 5,
    };
  case "auth/id-token-expired":
    return {
      trace: "AUTH_TOKEN_EXPIRED (" + err + ")",
      message: "La sesión expiró. Inicie sesión nuevamente.",
      code: 6,
    };
  case "auth/id-token-revoked":
    return {
      trace: "AUTH_TOKEN_REVOKED (" + err + ")",
      message: "La sesión fué revocada. Inicie sesión nuevamente.",
      code: 7,
    };
  case "auth/insufficient-permission":
    return {
      trace: "AUTH_INSUFFICIENT_PERMISSION (" + err + ")",
      message: "No posees permisos para realizar la acción.",
      code: 8,
    };
  case "auth/internal-error":
    return {
      trace: "AUTH_INTERNAL_ERROR (" + err + ")",
      message: "Ocurrió un error en el servidor. Intentá en unos minutos.",
      code: 9,
    };
  case "auth/too-many-requests":
    return {
      trace: "AUTH_TOO_MANY_REQUESTS (" + err + ")",
      message: "Ya intentaste realizar esta acción. Intentá en unos minutos.",
      code: 10,
    };
  case "auth/invalid-argument":
    return {
      trace: "AUTH_INVALID_ARGUMENT (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 11,
    };
  case "auth/invalid-claims":
    return {
      trace: "AUTH_INVALID_CLAIMS (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 12,
    };
  case "auth/invalid-continue-uri":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 13,
    };
  case "auth/invalid-creation-time":
    return {
      trace: "AUTH_INVALID_CREATION_TIME (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 14,
    };
  case "auth/invalid-disabled-field":
    return {
      trace: "AUTH_INVALID_DISABLED_FIELD (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 15,
    };
  case "auth/invalid-display-name":
    return {
      trace: "AUTH_INVALID_DISPLAY_NAME (" + err + ")",
      message: `El nombre que ingresaste es invalido. 
      Verificá la información ingresada.`,
      code: 16,
    };
  case "auth/invalid-credential":
    return {
      trace: "AUTH_INVALID_CREDENTIAL (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 17,
    };
  case "auth/invalid-dynamic-link-domain":
    return {
      trace: "AUTH_INVALID_DYNAMIC_LINK_DOMAIN (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 18,
    };
  case "auth/invalid-email":
    return {
      trace: "AUTH_INVALID_EMAIL (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 19,
    };
  case "auth/invalid-email-verified":
    return {
      trace: "AUTH_INVALID_EMAIL_VERIFIED (" + err + ")",
      message: "Falta verificar tu mail. Revisá tu correo electrónico.",
      code: 20,
    };
  case "auth/invalid-hash-algorithm":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 21,
    };
  case "auth/invalid-hash-block-size":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 22,
    };
  case "auth/invalid-hash-derived-key-length":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 23,
    };
  case "auth/invalid-hash-key":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 24,
    };
  case "auth/invalid-hash-memory-cost":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 25,
    };
  case "auth/invalid-hash-parallelization":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 26,
    };
  case "auth/invalid-hash-rounds":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 27,
    };
  case "auth/invalid-hash-salt-separator":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 28,
    };
  case "auth/invalid-id-token":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 29,
    };
  case "auth/invalid-last-sign-in-time":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 30,
    };
  case "auth/invalid-page-token":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 31,
    };
  case "auth/invalid-password":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 32,
    };
  case "auth/invalid-password-hash":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 33,
    };
  case "auth/invalid-password-salt":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 34,
    };
  case "auth/invalid-phone-number":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 35,
    };
  case "auth/invalid-photo-url":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 36,
    };
  case "auth/invalid-provider-data":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 37,
    };
  case "auth/invalid-provider-id":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 38,
    };
  case "auth/invalid-oAUTH_responsetype":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 39,
    };
  case "auth/invalid-session-cookie-duration":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 40,
    };
  case "auth/invalid-uid":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 41,
    };
  case "auth/invalid-user-import":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 42,
    };
  case "auth/maximum-user-count-exceeded":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 43,
    };
  case "auth/missing-android-pkg-name":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 44,
    };
  case "auth/missing-continue-uri":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 45,
    };
  case "auth/missing-hash-algorithm":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 46,
    };
  case "auth/missing-ios-bundle-id":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 47,
    };
  case "auth/missing-uid":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 48,
    };
  case "auth/missing-oAUTH_client-secret":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 49,
    };
  case "auth/operation-not-allowed":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 50,
    };
  case "auth/phone-number-already-exists":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 51,
    };
  case "auth/project-not-found":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 52,
    };
  case "auth/reserved-claims":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 53,
    };
  case "auth/session-cookie-expired":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 54,
    };
  case "auth/session-cookie-revoked":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 55,
    };
  case "auth/uid-already-exists":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 56,
    };
  case "auth/unauthorized-continue-uri":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 57,
    };
  case "auth/user-not-found":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 58,
    };
  case "storage/unknown":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 59,
    };
  case "storage/object-not-found":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 60,
    };
  case "storage/bucket-not-found":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 61,
    };
  case "storage/project-not-found":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 62,
    };
  case "storage/quota-exceeded":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 63,
    };
  case "storage/unauthenticated":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 64,
    };
  case "storage/unauthorized":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 65,
    };
  case "storage/retry-limit-exceeded":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 66,
    };
  case "storage/invalid-checksum":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 67,
    };
  case "storage/canceled":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 68,
    };
  case "storage/invalid-event-name":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 69,
    };
  case "storage/invalid-url":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 70,
    };
  case "storage/invalid-argument":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 71,
    };
  case "storage/no-default-bucket":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 72,
    };
  case "storage/cannot-slice-blob":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 73,
    };
  case "storage/server-file-wrong-size":
    return {
      trace: "AUTH_INVALID_CONTINUE_URI (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 74,
    };
  case "Error: The Firebase ID token has been revoked.":
    return {
      trace: "AUTH_ID_TOKEN_REVOKED (" + err + ")",
      message: "La sesión fué revocada. Inicie sesión nuevamente.",
      code: 75,
    };
  case "Error: Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.":
    return {
      trace: "AUTH_ID_TOKEN_EXPIRED (" + err + ")",
      message: "Estuviste mucho tiempo inactivo y se venció tu sesión.",
      code: 76,
    };
  default:
    return {
      trace: "GENERIC_ERROR (" + err + ")",
      message: "Ocurrió un error. Intentá en unos minutos.",
      code: 1,
    };
  }
};
