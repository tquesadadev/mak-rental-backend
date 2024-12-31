import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {deletePayedProduct, markAsPayed, verifyPayedExistByData, verifyPayedExistById} from "../functions/payedFunctions";
import {deleteSoldValidations, markAsPayedValidations} from "../helpers/payedValidations";
import {UserRecord} from "firebase-admin/auth";

// INDICAR PAGO
export const startCreatePayed = (async (req:any, res:any) => {
  let response = initialResponse;

  console.log(1);

  response = await markAsPayedValidations(response, req.body);
  console.log(2);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response?.body?.email ?? "", response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(response.body?.user, "Administrador", response);

  if (response.code === 0) {
    response = await verifyPayedExistByData(req.body, false, response);

    if (response.body === null) {
      // response = await verifyLoteExist(req.body.loteNumber, response);

      if (response.body !== null) {
        response = await markAsPayed(response.body, user, req.body.loteNumber, req.body.week, response);
      } else {
        response = {
          body: null,
          trace: "DOCUMENTS_FOUNDED",
          message: "El lote indicado se encuentra vacío.",
          code: 1,
        };
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_FOUNDED",
        message: "Ya se encuentra paga la semana indicada.",
        code: 1,
      };
    }
  }

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ELIMINAR PAGO
export const startDeletePayed = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await deleteSoldValidations(response, req.body?.id);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = await response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyPayedExistById(req.body?.id, true, response);

  if (response.body !== null) {
    response = await deletePayedProduct(user, response.body, response);
  } else {
    response = {
      body: null,
      trace: "DOCUMENTS_FOUNDED",
      message: "El pago indicado no existe.",
      code: 1,
    };
  }
  console.log(9);

  res.status(response.code === 0 ? 200 : 500).json(response);
});
