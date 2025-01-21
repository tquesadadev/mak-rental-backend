import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {markNewWorkValidations, updateWorkValidations} from "../helpers/workValidations";
import {UserRecord} from "firebase-admin/auth";
import {letsCreateNewWork, letsDeleteWork, letsGeneratePdfWork, letsReturnDeletedWork, letsUpdateWork, verifyWorkExistById} from "../functions/workFunctions";

// CREA UN WORK
export const startCreateWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await markNewWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await letsCreateNewWork(user, req.body, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ACTUALIZA UN WORK
export const startUpdateWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsUpdateWork(user, response.body, req.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ELIMINAR WORK
export const startDeleteWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsDeleteWork(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// REINCORPORAR WORK
export const startReturnDeletedWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsReturnDeletedWork(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});


// DEVUELVE UN PDF
export const startPdfWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsGeneratePdfWork(user, response.body, req.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});
