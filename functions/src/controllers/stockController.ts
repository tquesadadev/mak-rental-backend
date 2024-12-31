import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {letsCreateNewStock, letsDeleteStock, letsReturnDeletedStock, letsUpdateStock, verifyStockExistById} from "../functions/stockFunctions";
import {markNewStockValidations, updateStockValidations} from "../helpers/stockValidations";
import {UserRecord} from "firebase-admin/auth";

// CREA UN STOCK
export const startCreateStock = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await markNewStockValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await letsCreateNewStock(user, req.body, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ACTUALIZA UN STOCK
export const startUpdateStock = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateStockValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyStockExistById(req.body.id, true, response);

  response = await letsUpdateStock(user, response.body, req.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ELIMINAR STOCK
export const startDeleteStock = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateStockValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyStockExistById(req.body.id, true, response);

  response = await letsDeleteStock(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// REINCORPORAR STOCK
export const startReturnDeletedStock = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateStockValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyStockExistById(req.body.id, true, response);

  response = await letsReturnDeletedStock(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});
