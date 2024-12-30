import {handleError} from "../constants/errors";
import {addDocumentValidations, deleteDocumentValidations, getDocumentsValidations} from "../helpers/firestoreValidations";
import {AddSetDocumentRequestProps, DeleteDocumentRequestProps, GetDocumentsRequestProps, UpdateDocumentRequestProps} from "../interfaces/FirestoreInterfaces";
import {getFirestore} from "firebase-admin/firestore";

// DEVUELVE LOS DOCUMENTOS DE UNA COLLECTION
export const getDocuments = (async (request:any, response:any) => {
  response = getDocumentsValidations(response, request.body as GetDocumentsRequestProps);

  if (response.code === 0) {
    const firestore = getFirestore();

    const {collection, id, where, order} = request.body as GetDocumentsRequestProps;

    if (id === null) {
      if ( where !== null ) {
        if ( order !== null ) {
          await firestore
            .collection(collection)
            .orderBy(order.field, order.direction)
            .where(where.field, where.filter, where.value)
            .get()
            .then(async (docsRef) => {
              if (!docsRef.empty) {
                let docsList: any = [];

                docsRef.docs.forEach((value) => {
                  docsList = [
                    ...docsList,
                    value.data(),
                  ];
                });

                response = {
                  body: {
                    documents: docsList,
                  },
                  trace: "DOCUMENTS_FOUNDED",
                  message: "Información encontrada correctamente.",
                  code: 0,
                };
              } else {
                response = {
                  body: null,
                  trace: "DOCUMENTS_NOT_FOUNDED",
                  message: "Información no encontrada.",
                  code: 1,
                };
              }
            })
            .catch((error: Error) => handleError(error, response));
        } else {
          await firestore
            .collection(collection)
            .where(where.field, where.filter, where.value)
            .get()
            .then(async (docsRef) => {
              if (!docsRef.empty) {
                let docsList: any = [];

                docsRef.docs.forEach((value) => {
                  docsList = [
                    ...docsList,
                    value.data(),
                  ];
                });

                response = {
                  body: {
                    documents: docsList,
                  },
                  trace: "DOCUMENTS_FOUNDED",
                  message: "Información encontrada correctamente.",
                  code: 0,
                };
              } else {
                response = {
                  body: null,
                  trace: "DOCUMENTS_NOT_FOUNDED",
                  message: "Información no encontrada.",
                  code: 1,
                };
              }
            })
            .catch((error: Error) => handleError(error, response));
        }
      } else {
        if ( order !== null ) {
          await firestore
            .collection(collection)
            .orderBy(order.field, order.direction)
            .get()
            .then(async (docsRef) => {
              if (!docsRef.empty) {
                let docsList: any = [];

                docsRef.docs.forEach((value) => {
                  docsList = [
                    ...docsList,
                    value.data(),
                  ];
                });

                response = {
                  body: {
                    documents: docsList,
                  },
                  trace: "DOCUMENTS_FOUNDED",
                  message: "Información encontrada correctamente.",
                  code: 0,
                };
              } else {
                response = {
                  body: null,
                  trace: "DOCUMENTS_NOT_FOUNDED",
                  message: "Información no encontrada.",
                  code: 1,
                };
              }
            })
            .catch((error: Error) => handleError(error, response));
        } else {
          await firestore
            .collection(collection)
            .get()
            .then(async (docsRef) => {
              if (!docsRef.empty) {
                let docsList: any = [];

                docsRef.docs.forEach((value) => {
                  docsList = [
                    ...docsList,
                    value.data(),
                  ];
                });

                response = {
                  body: {
                    documents: docsList,
                  },
                  trace: "DOCUMENTS_FOUNDED",
                  message: "Información encontrada correctamente.",
                  code: 0,
                };
              } else {
                response = {
                  body: null,
                  trace: "DOCUMENTS_NOT_FOUNDED",
                  message: "Información no encontrada.",
                  code: 1,
                };
              }
            })
            .catch((error: Error) => handleError(error, response));
        }
      }
    } else {
      await firestore.collection(collection).doc(id).get()
        .then(async (docsRef) => {
          if (docsRef.exists) {
            response = {
              body: {
                document: docsRef.data(),
              },
              trace: "DOCUMENT_FOUNDED",
              message: "Información encontrada correctamente.",
              code: 0,
            };
          } else {
            response = {
              body: null,
              trace: "DOCUMENT_NOT_FOUNDED",
              message: "Información no encontrada.",
              code: 1,
            };
          }
        })
        .catch((error: Error) => handleError(error, response));
    }
  }

  return response;
});

// AGREGA EL DOCUMENTO A UNA COLLECTION
export const addDocument = (async (request:any, response:any) => {
  response = addDocumentValidations(response, request.body as AddSetDocumentRequestProps);

  if (response.code === 0) {
    const firestore = getFirestore();

    const {collection, id, doc} = request.body as AddSetDocumentRequestProps;

    if (id === null) {
      await firestore
        .collection(collection)
        .add(doc)
        .then(async (docsRef) => {
          if (docsRef) {
            response = {
              body: {
                collection: docsRef.parent,
                id: docsRef.id,
                path: docsRef.path,
                firestore: docsRef.firestore,
                document: request.body.doc,
              },
              trace: "DOCUMENT_ADDED",
              message: "Documento agregado con éxito.",
              code: 0,
            };
          } else {
            response = {
              body: null,
              trace: "DOCUMENT_NOT_ADDED",
              message: "Ocurrió un error al agregar el documento.",
              code: 1,
            };
          }
        })
        .catch((error: Error) => handleError(error, response));
    } else {
      await firestore
        .collection(collection)
        .doc(id)
        .set(doc)
        .then(async (docsRef) => {
          if (docsRef) {
            response = {
              body: {
                collection: request.body.collection,
                id: request.body.id,
                writeTime: docsRef.writeTime,
                document: request.body.doc,
              },
              trace: "DOCUMENT_SETTED",
              message: "Documento agregado con éxito.",
              code: 0,
            };
          } else {
            response = {
              body: null,
              trace: "DOCUMENT_NOT_SETTED",
              message: "Ocurrió un error al agregar el documento.",
              code: 1,
            };
          }
        })
        .catch((error: Error) => handleError(error, response));
    }
  }

  return response;
});

// ACTUALIZA EL DOCUMENTO DE UNA COLLECTION
export const updateDocument = (async (request:any, response:any) => {
  response = addDocumentValidations(response, request.body as UpdateDocumentRequestProps);

  if (response.code === 0) {
    const firestore = getFirestore();

    const {collection, id, doc} = request.body as UpdateDocumentRequestProps;

    await firestore
      .collection(collection)
      .doc(id)
      .update(doc)
      .then(async (docsRef) => {
        if (docsRef) {
          response = {
            body: {
              collection: request.body.collection,
              id: request.body.id,
              writeTime: docsRef.writeTime,
              document: request.body.doc,
            },
            trace: "DOCUMENT_UPDATED",
            message: "Documento actualizado con éxito.",
            code: 0,
          };
        } else {
          response = {
            body: null,
            trace: "DOCUMENT_NOT_UPDATED",
            message: "Ocurrió un error al actualizar el documento.",
            code: 1,
          };
        }
      })
      .catch((error: Error) => handleError(error, response));
  }

  return response;
});

// ELIMINAR UN DOCUMENTO DE LA COLLECCIÓN
export const deleteDocument = (async (request:any, response:any) => {
  response = deleteDocumentValidations(response, request.body as DeleteDocumentRequestProps);

  if (response.code === 0) {
    const firestore = getFirestore();

    const {collection, id} = request.body as DeleteDocumentRequestProps;

    await firestore
      .collection(collection)
      .doc(id)
      .delete()
      .then(async (docsRef) => {
        if (docsRef) {
          response = {
            body: {
              collection: request.body.collection,
              id: request.body.id,
              writeTime: docsRef.writeTime,
            },
            trace: "DOCUMENT_DELETED",
            message: "Documento eliminado con éxito.",
            code: 0,
          };
        } else {
          response = {
            body: null,
            trace: "DOCUMENT_NOT_DELETED",
            message: "Ocurrió un error al eliminar el documento.",
            code: 1,
          };
        }
      })
      .catch((error: Error) => handleError(error, response));
  }

  return response;
});


export type QueryCondition = {
  field: string;
  filter: FirebaseFirestore.WhereFilterOp;
  value: any;
};

export const fetchWithConditions = (async (options: QueryCondition[], response:any) => {
  if (response.code === 0) {
    const firestore = getFirestore();

    // Inicializa la consulta con la colección
    let query: FirebaseFirestore.Query = firestore.collection("Payed");

    // Agrega condiciones dinámicamente
    if (options && options.length > 0) {
      for (const condition of options) {
        query = query.where(condition.field, condition.filter, condition.value);
      }
    }

    // Ejecuta la consulta
    const snapshot = await query.get();

    // Mapea los documentos obtenidos
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
  }

  return response;
});
