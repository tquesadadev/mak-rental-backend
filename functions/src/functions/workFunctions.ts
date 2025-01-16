import {GetDocumentsRequestProps} from "../interfaces/FirestoreInterfaces";
import {addDocument, deleteDocument, getDocuments, updateDocument} from "../queries/firestoreQueries";
import {WorkProps, LetsUpdateWorkProps, NewWorkProps} from "../interfaces/WorkInterfaces";
import {capitalizeFullName, getFullDate, logActivity} from "../utils/Utilities";
import {createWorkValidations, updateWorkValidations, markNewWorkValidations} from "../helpers/workValidations";
import {deleteSoldValidations} from "../helpers/payedValidations";
import {UserRecord} from "firebase-admin/auth";

// OBTENER DOCUMENTOS
export const getAllWorks = (async (response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Works",
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

// VERIFICA SI UN WORK EXISTE
export const verifyWorkExistById = (async (workId: number, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Works",
        id: workId.toString(),
        where: null,
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El alquiler con esta información ya existe." : "El alquiler con esta información no existe.",
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// VERIFICA SI UN WORK EXISTE
export const verifyWorkExistByName = (async (name: string, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Works",
        id: null,
        where: {field: "name", filter: "==", value: capitalizeFullName(name)},
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El work con este nombre y apellido ya existe." : "El work con este nombre y apellido no existe.",
      // code: response.body === null && returnError ? 1 : 0,
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// CREA UN WORKE
export const createWorkDocument = (async (work: WorkProps, response:any) => {
  if (response.code === 0) {
    response = createWorkValidations(response, work);

    if (response.code === 0) {
      if (response.code === 0) {
        const newReq : {body: {collection: string, id: string, doc: WorkProps}} = {
          body: {
            collection: "Works",
            id: work.id.toString(),
            doc: work,
          },
        };

        response = await addDocument(newReq, response);
      }
    }
  }
  return response;
});

// ACTUALIZA UN WORKE
export const updateWorkDocument = (async (work: WorkProps, response:any) => {
  if (response.code === 0) {
    response = updateWorkValidations(response, work);
    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string, doc: WorkProps}} = {
        body: {
          collection: "Works",
          id: work.id.toString(),
          doc: work,
        },
      };

      response = await updateDocument(newReq, response);
    }
  }

  return response;
});

// ELIMINAR PRODUCTO VENDIDO
export const deleteProduct = (async (user: UserRecord, workId: number, response:any) => {
  if (response.code === 0) {
    response = deleteSoldValidations(response, workId);

    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string}} = {
        body: {
          collection: "Works",
          id: workId.toString(),
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

// CREAR WORKE
export const letsCreateNewWork = (async (user: UserRecord, body: NewWorkProps, response:any) => {
  if (response.code === 0) {
    response = markNewWorkValidations(response, body);

    if (response.code === 0) {
      const fulldate = parseInt(getFullDate());

      const newWork : WorkProps = {
        id: fulldate,
        address: body.address.trim(),
        clientId: body.clientId,
        comments: [],
        createdDate: fulldate,
        daysAmount: body.daysAmount,
        deliveryDate: body.deliveryDate,
        retirementDate: body.retirementDate,
        payment: body.payment,
        shipping: body.shipping,
        stock: body.stock,
        activity: body.activity,
        state: body.state,
        quote: body.quote,
        thirdPartyStock: body.thirdPartyStock,
        creator: user.displayName ?? user.email ?? user.uid,
        status: "active",
      };

      response = await createWorkDocument(newWork, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "createWork",
          details: {
            after: {
              work: body,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar crear el work.",
        code: 1,
      };
    }
  }

  return response;
});

// ACTUALIZAR WORKE
export const letsUpdateWork = (async (user: UserRecord, work: WorkProps, body: LetsUpdateWorkProps, response:any) => {
  if (response.code === 0) {
    response = updateWorkValidations(response, work);

    if (response.code === 0) {
      const updateWork : WorkProps = {
        id: work.id,
        address: body.data.address ? body.data.address.trim() : work.address,
        clientId: body.data.clientId ? body.data.clientId : work.clientId,
        activity: body.data.activity ? body.data.activity : work.activity,
        comments: body.data.comments ? body.data.comments : work.comments,
        daysAmount: body.data.daysAmount ? body.data.daysAmount : work.daysAmount,
        deliveryDate: body.data.deliveryDate ? body.data.deliveryDate : work.deliveryDate,
        payment: body.data.payment ? body.data.payment : work.payment,
        quote: body.data.quote ? body.data.quote : work.quote,
        retirementDate: body.data.retirementDate ? body.data.retirementDate : work.retirementDate,
        shipping: body.data.shipping ? body.data.shipping : work.shipping,
        state: body.data.state ? body.data.state : work.state,
        stock: body.data.stock ? body.data.stock : work.stock,
        thirdPartyStock: body.data.thirdPartyStock ? body.data.thirdPartyStock : work.thirdPartyStock,
        createdDate: work.createdDate,
        creator: work.creator,
        status: work.status,
      };

      response = await updateWorkDocument(updateWork, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "updateWork",
          details: {
            after: {
              ...updateWork,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el work.",
        code: 1,
      };
    }
  }

  return response;
});

// ELIMINAR WORKE
export const letsDeleteWork = (async (user: UserRecord, work: WorkProps, response:any) => {
  if (response.code === 0) {
    response = updateWorkValidations(response, work);

    if (response.code === 0) {
      const newWork : WorkProps = {
        ...work,
        status: "deleted",
      };

      response = await updateWorkDocument(newWork, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "deleteWork",
          details: {
            after: {
              work: work,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el work.",
        code: 1,
      };
    }
  }

  return response;
});

// REINCORPORAR WORKE
export const letsReturnDeletedWork = (async (user:UserRecord, work: WorkProps, response:any) => {
  if (response.code === 0) {
    response = updateWorkValidations(response, work);

    if (response.code === 0) {
      const newWork : WorkProps = {
        ...work,
        status: "active",
      };

      response = await updateWorkDocument(newWork, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "returnDeletedWork",
          details: {
            after: {
              work: work,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el work.",
        code: 1,
      };
    }
  }

  return response;
});

