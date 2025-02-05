import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {letsCreateNewClient, letsDeleteClient, letsReturnDeletedClient, letsUpdateClient, verifyClientExistById} from "../functions/clientFunctions";
import {markNewClientValidations, updateClientValidations} from "../helpers/clientValidations";
import {UserRecord} from "firebase-admin/auth";

// CREA UN CLIENTE
export const startCreateClient = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await markNewClientValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  // response = await verifyClientExistByName(req.body.name, false, response);

  response = await letsCreateNewClient(user, req.body, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ACTUALIZA UN CLIENTE
export const startUpdateClient = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateClientValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyClientExistById(req.body.id, true, response);

  response = await letsUpdateClient(user, response.body, req.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ELIMINAR CLIENTE
export const startDeleteClient = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateClientValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyClientExistById(req.body.id, true, response);

  response = await letsDeleteClient(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// REINCORPORAR CLIENTE
export const startReturnDeletedClient = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateClientValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyClientExistById(req.body.id, true, response);

  response = await letsReturnDeletedClient(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});
