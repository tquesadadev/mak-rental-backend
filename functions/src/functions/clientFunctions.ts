import {GetDocumentsRequestProps} from "../interfaces/FirestoreInterfaces";
import {addDocument, deleteDocument, getDocuments, updateDocument} from "../queries/firestoreQueries";
import {ClientProps, LetsUpdateClientProps, LoteProps, NewClientProps} from "../interfaces/ClientInterfaces";
import {capitalizeFullName, getDate, getFullDate, logActivity} from "../utils/Utilities";
import {createClientValidations, clientExistValidations, updateClientValidations, markNewClientValidations} from "../helpers/clientValidations";
import {deleteSoldValidations} from "../helpers/payedValidations";
import {getFirestore} from "firebase-admin/firestore";
import {UserRecord} from "firebase-admin/auth";

// OBTENER DOCUMENTOS
export const getAllProducts = (async (response:any) => {
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

      const date = parseInt(getDate());

      const lotesList : LoteProps[] = body.lotes.map((value) => {
        return {
          loteNumber: value.loteNumber,
          categoryId: value.categoryId,
          price: value.price,
          originalStartDate: date,
          startDate: date,
          endDate: null,
        } as LoteProps;
      });

      const newClient : ClientProps = {
        id: fulldate,
        name: capitalizeFullName(body.name),
        phone: body.phone.trim(),
        status: "active",
        lotes: lotesList.length > 0 ? lotesList : [],
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

const updateLoteLogic = async (
  params: {
    clientId?: number | null;
    loteNumber?: number;
    data: {
      clientId?: number | null;
      categoryId?: number;
      price?: number;
    };
  },
  client: ClientProps,
  user: UserRecord,
  response: any
) => {
  if (response.code !== 0) return response;

  const firestore = getFirestore();
  const date = parseInt(getDate());

  let targetClient;
  let loteToUpdate: any;

  if (params.loteNumber) {
    targetClient = client; // Solo el primer cliente encontrado
    loteToUpdate = targetClient.lotes.find(
      (lote: LoteProps) => lote.loteNumber === params.loteNumber && lote.endDate === null
    );
  } else if (params.clientId) {
    // Buscar directamente por clientId
    const doc = await firestore.collection("Clients").doc(String(params.clientId)).get();

    if (!doc.exists) {
      return {
        body: null,
        trace: "CLIENT_NOT_FOUND",
        message: `No se encontró el cliente con ID ${params.clientId}.`,
        code: 1,
      };
    }

    targetClient = doc.data();
    loteToUpdate = null; // No se está modificando un lote específico
  }

  if (!targetClient) {
    return {
      body: null,
      trace: "CLIENT_NOT_FOUND",
      message: "No se encontró el cliente.",
      code: 1,
    };
  }

  let newLotes: LoteProps[] = [...targetClient.lotes];

  // Nueva condición para finalizar el lote si clientId es null
  if (params.data?.clientId === null && params.loteNumber && loteToUpdate) {
    newLotes = newLotes.map((lote: LoteProps) =>
      lote.loteNumber === params.loteNumber && lote.endDate === null ?
        {...lote, endDate: date} : // Finaliza el lote
        lote
    );

    const updatedClient: any = {
      ...targetClient,
      lotes: newLotes,
    };

    response = await updateClientDocument(updatedClient, response);
    return response;
  }

  // Lógica existente: actualizar precio, categoría, o cambiar de cliente
  if (loteToUpdate) {
    // Actualización de lote activo
    if (
      params.data?.price &&
      params.data?.price !== undefined &&
      loteToUpdate.price !== params.data?.price
    ) {
      newLotes = newLotes.map((lote: LoteProps) =>
        lote.loteNumber === params.loteNumber && lote.endDate === null ?
          {...lote, price: params.data?.price ?? loteToUpdate.price} :
          lote
      );
    }

    if (
      params.data?.categoryId &&
      params.data?.categoryId !== undefined &&
      loteToUpdate.categoryId !== params.data?.categoryId
    ) {
      // Finalizar lote actual y crear uno nuevo
      newLotes = newLotes.map((lote) =>
        lote.loteNumber === params.loteNumber && lote.endDate === null ?
          {...lote, endDate: date} :
          lote
      );
      newLotes.push({
        loteNumber: params.loteNumber ?? 0,
        categoryId: params.data?.categoryId ?? loteToUpdate.categoryId,
        price: loteToUpdate.price,
        originalStartDate: loteToUpdate.originalStartDate,
        startDate: date,
        endDate: null,
      });
    }

    if (
      params.data?.clientId &&
      params.data?.clientId !== undefined &&
      params.data?.clientId !== targetClient.id
    ) {
      // Cambiar de cliente
      newLotes = newLotes.map((lote) =>
        lote.loteNumber === params.loteNumber && lote.endDate === null ?
          {...lote, endDate: date} :
          lote
      );

      const newClientDoc = await firestore
        .collection("Clients")
        .doc(String(params.data.clientId))
        .get();

      if (!newClientDoc.exists) {
        return {
          body: null,
          trace: "NEW_CLIENT_NOT_FOUND",
          message: `No se encontró el cliente con ID ${params.data.clientId}.`,
          code: 1,
        };
      }

      const newClient = newClientDoc.data();
      const newClientLotes: LoteProps[] = newClient?.lotes && newClient?.lotes.length > 0 ? [...newClient.lotes] : [];
      newClientLotes.push({
        loteNumber: params.loteNumber ?? 0,
        categoryId: params.data.categoryId ?? loteToUpdate.categoryId,
        price: params.data.price ?? loteToUpdate.price,
        originalStartDate: date,
        startDate: date,
        endDate: null,
      });

      await updateClientDocument({...newClient, lotes: newClientLotes} as any, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "updateLote",
          details: {
            after: {
              loteNumber: params.loteNumber,
            },
          },
        });
      }
    }
  }

  const updatedClient: any = {
    ...targetClient,
    lotes: newLotes,
  };

  response = await updateClientDocument(updatedClient, response);

  if (response.code === 0) {
    await logActivity({
      userId: user.displayName ?? user.email ?? "",
      action: "updateLote",
      details: {
        after: {
          loteNumber: params.loteNumber,
        },
      },
    });
  }

  return response;
};


// ACTUALIZAR CLIENTE
export const letsUpdateClient = async (user: UserRecord, client: ClientProps, body: LetsUpdateClientProps, response: any ) => {
  if (response.code === 0) {
    response = updateClientValidations(response, {id: body.id} as any);

    if (response.code === 0) {
      const date = parseInt(getDate());

      // Obtener solo los lotes actuales (sin fechaFin)
      const activeLotesList = client.lotes.filter((lote) => !lote.endDate);
      const assignedLotesIds = body.data?.lotes?.map((lote) => lote.loteNumber);

      let newLotes = [...client.lotes];

      // Procesar Lotes Asignados (Agregar o Actualizar)
      body.data?.lotes?.forEach((loteNuevo) => {
        const loteExistente : LoteProps | undefined = activeLotesList.find(
          (lote) => lote.loteNumber === loteNuevo.loteNumber && lote.endDate === null
        );


        if (!loteExistente) {
          // Agregar lote nuevo o reactivar lote previamente finalizado
          newLotes.push({
            price: activeLotesList.length > 0 ? activeLotesList[0].price : loteNuevo.price,
            loteNumber: loteNuevo.loteNumber,
            categoryId: loteNuevo.categoryId,
            originalStartDate: date,
            startDate: date,
            endDate: null,
          });
        } else if (loteExistente.categoryId !== loteNuevo.categoryId) {
          // Finalizar lote existente y crear uno nuevo con la nueva categoría
          newLotes = newLotes.map((lote) =>
            lote.loteNumber === loteNuevo.loteNumber && lote.endDate === null ?
              {...lote, endDate: date} :
              lote
          );
          newLotes.push({
            price: loteExistente.price,
            loteNumber: loteExistente.loteNumber,
            categoryId: loteNuevo.categoryId,
            originalStartDate: loteExistente.originalStartDate,
            startDate: date,
            endDate: null,
          });
        } else if (loteExistente.price !== loteNuevo.price) {
          // Actualizar precio del lote activo sin cambiar categoría
          newLotes = newLotes.map((lote) =>
            lote.loteNumber === loteNuevo.loteNumber && lote.endDate === null ?
              {...lote, price: loteNuevo.price, startDate: date} :
              lote
          );
        }
      });

      // Finalizar Lotes No Asignados
      activeLotesList.forEach((lote) => {
        if (!assignedLotesIds?.includes(lote.loteNumber)) {
          // Finalizar el lote si ya no está en `body.data?.lotes`
          newLotes = newLotes.map((l) =>
            l.loteNumber === lote.loteNumber && l.endDate === null ? {...l, endDate: date} : l
          );
        }
      });

      const updateClient: ClientProps = {
        ...client,
        name: body.data?.name ? capitalizeFullName(body.data?.name) : client.name,
        phone: body.data?.phone ? body.data?.phone.trim() : client.phone,
        lotes: newLotes ?? client.lotes,
      };

      response = await updateClientDocument(updateClient, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "updateClient",
          details: {
            before: {
              name: capitalizeFullName(client.name) !== capitalizeFullName(updateClient.name) ? capitalizeFullName(client.name) : undefined,
              phone: client.phone !== updateClient.phone ? client.phone : undefined,
              lotes: client.lotes !== updateClient.lotes ? client.lotes : undefined,
            },
            after: {
              name: capitalizeFullName(client.name) !== capitalizeFullName(updateClient.name) ? capitalizeFullName(updateClient.name) : undefined,
              phone: client.phone !== updateClient.phone ? updateClient.phone : undefined,
              lotes: client.lotes !== updateClient.lotes ? updateClient.lotes : undefined,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar actualizar el cliente.",
        code: 1,
      };
    }
  }

  return response;
};


// // ACTUALIZAR LOTE
// export const letsUpdateLote = async (
//   body: {
//     loteNumber: number;
//     data: {
//       clientId?: number | null;
//       categoryId?: number;
//       price?: number;
//     };
//   },
//   response: any
// ) => {
//   if (response.code === 0) {
//     const date = parseInt(getDate());

//     // Buscar el documento de cliente que contiene el lote activo
//     response = await getAllProducts(response);

//     if (response.code === 0) {

//       const clients = response.body; // Implementa esta función para obtener los clientes desde la base de datos
//       const clientWithLote = clients.find((client: ClientProps) =>
//         client.lotes.some((lote: LoteProps) => lote.loteNumber === body.loteNumber && lote.endDate === null)
//       );

//       if (!clientWithLote) {
//         return {
//           body: null,
//           trace: "LOTE_NOT_FOUND",
//           message: `No se encontró un lote activo con loteNumber ${body.loteNumber}.`,
//           code: 1,
//         };
//       }

//       const clientIdActual = clientWithLote.id;
//       const loteActual = clientWithLote.lotes.find(
//         (lote: LoteProps) => lote.loteNumber === body.loteNumber && lote.endDate === null
//       );

//       if (!loteActual) {
//         return {
//           body: null,
//           trace: "ACTIVE_LOTE_NOT_FOUND",
//           message: `No se encontró un lote activo con loteNumber ${body.loteNumber}.`,
//           code: 1,
//         };
//       }

//       let newLotes = [...clientWithLote.lotes];
//       let newClientLotes = null;

//       // Actualización del precio
//       if (body.data.price !== undefined && loteActual.price !== body.data.price) {
//         newLotes = newLotes.map((lote) =>
//           lote.loteNumber === body.loteNumber && lote.endDate === null
//             ? { ...lote, price: body.data.price }
//             : lote
//         );
//       }

//       // Cambio de categoría
//       if (body.data.categoryId !== undefined && loteActual.categoryId !== body.data.categoryId) {
//         newLotes = newLotes.map((lote) =>
//           lote.loteNumber === body.loteNumber && lote.endDate === null
//             ? { ...lote, endDate: date }
//             : lote
//         );
//         newLotes.push({
//           loteNumber: body.loteNumber,
//           categoryId: body.data.categoryId,
//           price: loteActual.price,
//           originalStartDate: loteActual.originalStartDate,
//           startDate: date,
//           endDate: null,
//         });
//       }

//       // Cambio de cliente
//       if (body.data.clientId !== undefined && body.data.clientId !== clientIdActual) {
//         // Finalizar el lote en el cliente actual
//         newLotes = newLotes.map((lote) =>
//           lote.loteNumber === body.loteNumber && lote.endDate === null
//             ? { ...lote, endDate: date }
//             : lote
//         );

//         // Obtener al nuevo cliente
//         const newClient = clients.find((client: ClientProps) => client.id === body.data.clientId);
//         if (!newClient) {
//           return {
//             body: null,
//             trace: "NEW_CLIENT_NOT_FOUND",
//             message: `No se encontró el cliente con ID ${body.data.clientId}.`,
//             code: 1,
//           };
//         }

//         newClientLotes = [...newClient.lotes];
//         newClientLotes.push({
//           loteNumber: body.loteNumber,
//           categoryId: body.data.categoryId ?? loteActual.categoryId,
//           price: body.data.price ?? loteActual.price,
//           originalStartDate: loteActual.originalStartDate,
//           startDate: date,
//           endDate: null,
//         });

//         // Actualizar al nuevo cliente
//         const updatedNewClient = {
//           ...newClient,
//           lotes: newClientLotes,
//         };
//         await updateClientDocument(updatedNewClient, response);
//       }

//       // Actualizar al cliente original
//       const updatedClient = {
//         ...clientWithLote,
//         lotes: newLotes,
//       };

//       response = await updateClientDocument(updatedClient, response);

//     }

//   }

//   return response;
// };

export const letsUpdateClientV2 = async (
  client: ClientProps,
  user: UserRecord,
  body: LetsUpdateClientProps,
  response: any
) => {
  return await updateLoteLogic(
    {
      clientId: client.id,
      data: body.data as any,
    },
    client,
    user,
    response
  );
};


export const letsUpdateLote = async (
  client: ClientProps,
  user: UserRecord,
  body: {
    loteNumber: number;
    data: {
      clientId?: number | null;
      categoryId?: number;
      price?: number;
    };
  },
  response: any
) => {
  return await updateLoteLogic(
    {
      loteNumber: body.loteNumber,
      data: body.data,
    },
    client,
    user,
    response
  );
};


// ELIMINAR CLIENTE
export const letsDeleteClient = (async (user: UserRecord, client: ClientProps, response:any) => {
  if (response.code === 0) {
    response = updateClientValidations(response, client);

    if (response.code === 0) {
      const lotesList : LoteProps[] = client.lotes.map((value) => {
        return {
          loteNumber: value.loteNumber,
          categoryId: value.categoryId,
          price: value.price,
          originalStartDate: value.originalStartDate,
          startDate: value.startDate,
          endDate: value.endDate === null ? parseInt(getDate()) : value.endDate,
        } as LoteProps;
      });

      const newClient : ClientProps = {
        ...client,
        status: "deleted",
        lotes: lotesList,
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

// VERIFICA SI UN LOTE EXISTE
export const verifyLoteExist = (async (loteNumber: number, response:any) => {
  if (response.code === 0) {
    response = clientExistValidations(response, loteNumber);

    if (response.code === 0) {
      response = await getAllProducts(response);

      if (response.code === 0) {
        let item : ClientProps | null = null;

        if (response.body.length > 0) {
          response.body.forEach((value : ClientProps) => {
            const loteActivo = value.lotes.find((lote) => lote.loteNumber === loteNumber && lote.endDate === null);

            if (loteActivo) {
              item = value;
            }
          });
        }

        response = {
          body: item ?? null,
          trace: item !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
          message: item !== null ? "Información encontrada correctamente." : "Información no encontrada.",
          code: 0,
        };
      }
    }
  }

  return response;
});
