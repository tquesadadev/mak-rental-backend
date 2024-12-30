import {UpdateRequest, UserRecord} from "firebase-admin/auth";
import {RoleTypes} from "../interfaces/AuthInterfaces";
import {deleteUser, getUserByEmail, getUsers, setCustomClaims, updateUser} from "../queries/authQueries";

// OBTENER SOLICITUDES DE ACCESO Y MIEMBROS
export const getMembersAndRequestAccess = (async (response:any) => {
  if (response.code === 0) {
    response = await getUsers(response);

    if (response.code === 0) {
      response = {
        ...response,
        body: response.body.map((user: UserRecord) => {
          return {
            name: user.displayName,
            email: user.email,
            disabled: user.disabled,
            role: user.customClaims?.role ?? undefined,
          };
        }),

      };
    }
  }

  return response;
});

// VERIFICA SI EL USUARIO TIENE PERMISOS PARA LA ACCION
export const validateRolePermissions = (async (user: UserRecord, roleRequired: RoleTypes, response:any) => {
  if (response.code === 0) {
    if (roleRequired !== null || roleRequired === user.customClaims?.role) {
      response = {
        body: null,
        trace: "PERMISSIONS_SUCCESS",
        message: "Posee permisos para realizar la operación.",
        code: 0,
      };
    } else {
      response = {
        body: null,
        trace: "PERMISSIONS_DENIED",
        message: "No posee permisos para realizar la operación.",
        code: 1,
      };
    }
  }

  return response;
});

// ASIGNAR ROL
export const setUpdateUserRole = (async (role: RoleTypes, emailToUpdate: string, response:any) => {
  if (response.code === 0) {
    response = await getUserByEmail(emailToUpdate, response);

    if (response.code === 0) {
      const user = response.body.user as UserRecord;


      if (response.code === 0) {
        const newReq = {
          body: {
            uid: user.uid,
            field: "role",
            value: role,
          },
        };

        if (user.customClaims === undefined || user.customClaims?.role === undefined || user.customClaims.role !== role) {
          response = await setCustomClaims(newReq, response);
        } else {
          response = {
            body: null,
            trace: "USER_CUSTOM_CLAIMS_EQUAL",
            message: "El usuario ya posee estos valores.",
            code: 0,
          };
        }
      }
    }
  }

  return response;
});

// ELIMINAR MIEMBRO
// ELIMINAR UNA SOLICITUD DE ACCESO
export const deleteMember = (async (emailToDelete: string, response:any) => {
  if (response.code === 0) {
    response = await getUserByEmail(emailToDelete, response);

    if (response.code === 0) {
      if (response.body?.user.customClaims.role === "Administrador") {
        response = {
          body: null,
          trace: "PERMISSION_DENIED",
          message: "No se puede eliminar a un miembro con el rol de administrador.",
          code: 1,
        };
      }

      if (response.code === 0) {
        const user = response.body.user as UserRecord;

        const newReq = {
          body: {
            uid: user.uid,
          },
        };

        response = await deleteUser(newReq, response);
      }
    }
  }

  return response;
});

// APROBAR UNA SOLICITUD DE ACCESO
export const approveRequestAccess = (async (role: RoleTypes, emailToApprove: string, response:any) => {
  if (response.code === 0) {
    response = await getUserByEmail(emailToApprove, response);

    if (response.code === 0) {
      if (response.body.user.customClaims.role === "Administrador") {
        response = {
          body: null,
          trace: "PERMISSION_DENIED",
          message: "No se puede modificar el rol a un administrador.",
          code: 1,
        };
      }

      if (response.code === 0) {
        const user = response.body.user as UserRecord;

        if (user.disabled) {
          const newReq : {body: UpdateRequest} = {
            body: {
              disabled: false,
            },
          };

          response = await updateUser(user.uid, newReq, response);
        }

        if (response.code === 0) {
          response = await setUpdateUserRole(role, emailToApprove, response);
        }

        if (response.code === 0) {
          response = {
            body: null,
            trace: "REQUEST_ACCESS_APPROVED",
            message: "Solicitud de acceso aprobada.",
            code: 0,
          };
        }
      }
    }
  }

  return response;
});

