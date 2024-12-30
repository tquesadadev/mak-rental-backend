import {initialResponse} from "../constants/initialStates";
import {deleteUserMemberValidations, fullnameValidations, setUpdateUserRoleValidations} from "../helpers/authValidations";
import {createUser, getCustomClaims, getUserByEmail, updateUser, verifyToken} from "../queries/authQueries";
import {approveRequestAccess, deleteMember, getMembersAndRequestAccess, setUpdateUserRole, validateRolePermissions} from "../functions/authFunctions";
import {logActivity} from "../utils/Utilities";
import {UserRecord} from "firebase-admin/auth";

// CREAR USUARIO Y ASIGNAR ROL NULO
export const startCreateANewUser = (async (req:any, res:any) => {
  let response = initialResponse;
  let response1 = initialResponse;

  response = await createUser(req, response);

  response1 = await setUpdateUserRole("None", response.body?.user.email, response);

  res.status(response.code === 0 && response1.code === 0 ? 200 : 500).json(response);
});

// ACTUALIZAR NOMBRE Y APELLIDO DEL USUARIO
export const startUpdateFullnameUser = (async (req:any, res:any) => {
  let response = initialResponse;

  response = fullnameValidations(response, req.body.displayName);

  response = await verifyToken(req, response);

  response = await updateUser(response.body?.uid, req, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// OBTENER TODOS LOS MIEMBROS
export const startGetAllMembersAndAccessUsers = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  response = await validateRolePermissions(response.body?.user, "Administrador", response);

  response = await getMembersAndRequestAccess(response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ASIGNAR ROL
export const startSetRole = (async (req:any, res:any) => {
  let response = initialResponse;

  response = setUpdateUserRoleValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  response = await validateRolePermissions(response.body?.user, "Administrador", response);

  response = await setUpdateUserRole(req.body.role, req.body.email, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// OBTENER ROL
export const startGetRole = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await verifyToken(req, response);

  response = await getCustomClaims(response.body?.uid, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});


// ELIMINAR USUARIO
export const startDeleteUserMember = (async (req:any, res:any) => {
  let response = initialResponse;

  response = deleteUserMemberValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await deleteMember(req.body.email, response);

  if (response.code === 0) {
    await logActivity({
      userId: user.displayName ?? user.email ?? "",
      action: "deleteAccess",
      details: {
        after: req.body,
      },
    });
  }

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// APROBAR USUARIO
export const startApproveAccessMember = (async (req:any, res:any) => {
  let response = initialResponse;

  response = setUpdateUserRoleValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await approveRequestAccess(req.body.role, req.body.email, response);

  if (response.code === 0) {
    await logActivity({
      userId: user.displayName ?? user.email ?? "",
      action: "approveAccess",
      details: {
        after: req.body,
      },
    });
  }


  res.status(response.code === 0 ? 200 : 500).json(response);
});
