import {GetDocumentsRequestProps} from "../interfaces/FirestoreInterfaces";
import {addDocument, deleteDocument, getDocuments, updateDocument} from "../queries/firestoreQueries";
import {ClientProps, LetsUpdateClientProps, NewClientProps} from "../interfaces/ClientInterfaces";
import {capitalizeFullName, getFullDate, logActivity} from "../utils/Utilities";
import {createClientValidations, updateClientValidations, markNewClientValidations} from "../helpers/clientValidations";
import {deleteSoldValidations} from "../helpers/payedValidations";
import {UserRecord} from "firebase-admin/auth";

// OBTENER DOCUMENTOS
export const getAllClients = (async (response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Clients",
        id: null,
        where: null,
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.documents : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "Información encontrada correctamente." : "Información no encontrada.",
      code: response.body !== null ? 0 : 1,
    };
  }

  return response;
});

// VERIFICA SI UN CLIENTE EXISTE
export const verifyClientExistById = (async (clientId: number, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Clients",
        id: clientId.toString(),
        where: null,
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El cliente con este nombre y apellido ya existe." : "El cliente con este nombre y apellido no existe.",
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// VERIFICA SI UN CLIENTE EXISTE
export const verifyClientExistByName = (async (name: string, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Clients",
        id: null,
        where: {field: "name", filter: "==", value: capitalizeFullName(name)},
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El cliente con este nombre y apellido ya existe." : "El cliente con este nombre y apellido no existe.",
      // code: response.body === null && returnError ? 1 : 0,
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// CREA UN CLIENTE
export const createClientDocument = (async (client: ClientProps, response:any) => {
  if (response.code === 0) {
    response = createClientValidations(response, client);

    if (response.code === 0) {
      if (response.code === 0) {
        const newReq : {body: {collection: string, id: string, doc: ClientProps}} = {
          body: {
            collection: "Clients",
            id: client.id.toString(),
            doc: client,
          },
        };

        response = await addDocument(newReq, response);
      }
    }
  }
  return response;
});

// ACTUALIZA UN CLIENTE
export const updateClientDocument = (async (client: ClientProps, response:any) => {
  if (response.code === 0) {
    response = updateClientValidations(response, client);
    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string, doc: ClientProps}} = {
        body: {
          collection: "Clients",
          id: client.id.toString(),
          doc: client,
        },
      };

      response = await updateDocument(newReq, response);
    }
  }

  return response;
});

// ELIMINAR PRODUCTO VENDIDO
export const deleteProduct = (async (user: UserRecord, clientId: number, response:any) => {
  if (response.code === 0) {
    response = deleteSoldValidations(response, clientId);

    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string}} = {
        body: {
          collection: "Clients",
          id: clientId.toString(),
        },
      };

      response = await getDocuments(newReq, response);

      const item = response.body;

      response = await deleteDocument(newReq, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "deletePayed",
          details: {
            after: item,
          },
        });
      }
    }
  }

  return response;
});

// CREAR CLIENTE
export const letsCreateNewClient = (async (user: UserRecord, body: NewClientProps, response:any) => {
  if (response.code === 0) {
    response = markNewClientValidations(response, body);

    if (response.code === 0) {
      const fulldate = parseInt(getFullDate());

      const newClient : ClientProps = {
        id: fulldate,
        name: capitalizeFullName(body.name),
        phone: body.phone.trim(),
        address: body.address.trim(),
        document: body.document.trim(),
        mail: body.mail.trim(),
        status: "active",
      };

      response = await createClientDocument(newClient, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "createClient",
          details: {
            after: {
              name: capitalizeFullName(body.name),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar crear el cliente.",
        code: 1,
      };
    }
  }

  return response;
});

// ACTUALIZAR CLIENTE
export const letsUpdateClient = (async (user: UserRecord, client: ClientProps, body: LetsUpdateClientProps, response:any) => {
  if (response.code === 0) {
    response = updateClientValidations(response, client);

    if (response.code === 0) {
      const updateClient : ClientProps = {
        ...client,
        name: body.data.name ? capitalizeFullName(body.data.name) : client.name,
        document: body.data.document ? body.data.document.trim() : client.document,
        phone: body.data.phone ? body.data.phone.trim() : client.phone,
        mail: body.data.mail ? body.data.mail.trim() : client.mail,
        address: body.data.address ? body.data.address.trim() : client.address,
      };

      response = await updateClientDocument(updateClient, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "updateClient",
          details: {
            after: {
              ...updateClient,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el cliente.",
        code: 1,
      };
    }
  }

  return response;
});

// ELIMINAR CLIENTE
export const letsDeleteClient = (async (user: UserRecord, client: ClientProps, response:any) => {
  if (response.code === 0) {
    response = updateClientValidations(response, client);

    if (response.code === 0) {
      const newClient : ClientProps = {
        ...client,
        status: "deleted",
      };

      response = await updateClientDocument(newClient, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "deleteClient",
          details: {
            after: {
              name: capitalizeFullName(client.name),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el cliente.",
        code: 1,
      };
    }
  }

  return response;
});

// REINCORPORAR CLIENTE
export const letsReturnDeletedClient = (async (user:UserRecord, client: ClientProps, response:any) => {
  if (response.code === 0) {
    response = updateClientValidations(response, client);

    if (response.code === 0) {
      const newClient : ClientProps = {
        ...client,
        status: "active",
      };

      response = await updateClientDocument(newClient, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "returnDeletedClient",
          details: {
            after: {
              name: capitalizeFullName(client.name),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el cliente.",
        code: 1,
      };
    }
  }

  return response;
});

// // VERIFICA SI UN LOTE EXISTE
// export const verifyLoteExist = (async (loteNumber: number, response:any) => {
//   if (response.code === 0) {
//     response = clientExistValidations(response, loteNumber);

//     if (response.code === 0) {
//       response = await getAllProducts(response);

//       if (response.code === 0) {
//         let item : ClientProps | null = null;

//         if (response.body.length > 0) {
//           response.body.forEach((value : ClientProps) => {
//             const loteActivo = value.lotes.find((lote) => lote.loteNumber === loteNumber && lote.endDate === null);

//             if (loteActivo) {
//               item = value;
//             }
//           });
//         }

//         response = {
//           body: item ?? null,
//           trace: item !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
//           message: item !== null ? "Información encontrada correctamente." : "Información no encontrada.",
//           code: 0,
//         };
//       }
//     }
//   }

//   return response;
// });
