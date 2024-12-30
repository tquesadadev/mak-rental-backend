import {addDocument, deleteDocument, fetchWithConditions, getDocuments, QueryCondition} from "../queries/firestoreQueries";
import {ClientProps, LoteProps} from "../interfaces/ClientInterfaces";
import {getFullDate, logActivity} from "../utils/Utilities";
import {createPayedValidations, deleteSoldValidations, markAsPayedValidations} from "../helpers/payedValidations";
import {MarkAsPayedProps, PayedProps, WeekPayedProps} from "../interfaces/PayedInterfaces";
import {GetDocumentsRequestProps} from "../interfaces/FirestoreInterfaces";
import {UserRecord} from "firebase-admin/auth";

// VERIFICA SI UN PAGO EXISTE
export const verifyPayedExistByData = (async (body: MarkAsPayedProps, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    response = markAsPayedValidations(response, body );

    if (response.code === 0) {
      const conditions : QueryCondition[] = [
        {field: "week", filter: "==", value: body.week},
      ];

      const documentExists = await fetchWithConditions(conditions, response).then((resp) => {
        if (resp.length > 0) {
          let doc: PayedProps[] = [];

          resp.forEach((item : PayedProps) => {
            item.lotes?.forEach((value) => {
              if (value.loteNumber === body.loteNumber) {
                doc = [...doc, item];
              }
            });
          });

          return doc;
        }

        return [];
      });


      response = {
        body: documentExists.length > 0 ? documentExists[0] : null,
        trace: documentExists.length > 0 ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
        message: documentExists.length > 0 ? "Información encontrada correctamente." : "Información no encontrada.",
        code: mustExists ? (documentExists.length > 0 ? 0 : 1) : (documentExists.length > 0 ? 1 : 0),
      };
    }
  }

  return response;
});


// VERIFICA SI UN PAGO EXISTE
export const verifyPayedExistById = (async (id: number, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Payed",
        id: id.toString(),
        where: null,
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    const documentExists = response.body !== null;

    response = {
      body: documentExists ? response.body.document : null,
      trace: documentExists ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: documentExists ? "Información encontrada correctamente." : "Información no encontrada.",
      code: documentExists ? 0 : 1,
    };
  }

  return response;
});

// CREAR PAGO
export const createPayed = (async (payed: PayedProps, response:any) => {
  if (response.code === 0) {
    response = createPayedValidations(response, payed);

    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string | null, doc: PayedProps}} = {
        body: {
          collection: "Payed",
          id: payed.id.toString(),
          doc: {
            ...payed,
          },
        },
      };

      response = await addDocument(newReq, response);
    }
  }

  return response;
});


// ELIMINAR PAGO
export const deletePayedProduct = (async (user: UserRecord, payed: PayedProps, response:any) => {
  if (response.code === 0) {
    response = await deleteSoldValidations(response, payed.id);

    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string}} = {
        body: {
          collection: "Payed",
          id: payed.id.toString(),
        },
      };

      response = await deleteDocument(newReq, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "deletePayed",
          details: {
            after: payed,
          },
        });
      }
    }
  }

  return response;
});

// INDICAR PAGO
export const markAsPayed = (async (client: ClientProps, user: UserRecord, loteNumber: number, week: WeekPayedProps, response:any) => {
  if (response.code === 0) {
    console.log(client);
    console.log(loteNumber);

    response = await markAsPayedValidations(response, {loteNumber, week});

    console.log(1);


    if (response.code === 0) {
      const date = parseInt(getFullDate());

      const lotes : LoteProps[] = client.lotes.filter((value) => {
        return value.loteNumber === loteNumber && value.endDate === null;
      });
      const lotesArray : LoteProps[] = client.lotes.filter((value) => {
        return value.endDate === null;
      });
      console.log("------------------------");
      console.log(lotes);
      console.log(lotesArray);

      if (lotes.length > 0) {
        const newPayed : PayedProps = {
          id: date,
          amount: lotes[0]?.price ?? 0,
          clientId: client.id,
          author: user.displayName ?? user.email ?? "",
          date,
          lotes: lotesArray,
          week,
        };

        response = await createPayed(newPayed, response);

        if (response.code === 0) {
          await logActivity({
            userId: user.displayName ?? user.email ?? "",
            action: "markPayed",
            details: {
              after: {
                amount: lotes[0]?.price ?? 0,
                clientId: client.id,
                loteNumber,
                week,
              },
            },
          });
        }
      } else {
        response = {
          body: null,
          trace: "DOCUMENTS_INCONSISTANCE",
          message: "Error al intentar marcar como pagado.",
          code: 1,
        };
      }
    }
  }

  return response;
});
