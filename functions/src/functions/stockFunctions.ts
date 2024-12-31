import {GetDocumentsRequestProps} from "../interfaces/FirestoreInterfaces";
import {addDocument, deleteDocument, getDocuments, updateDocument} from "../queries/firestoreQueries";
import {StockProps, LetsUpdateStockProps, NewStockProps} from "../interfaces/StockInterfaces";
import {capitalizeFullName, getFullDate, logActivity} from "../utils/Utilities";
import {createStockValidations, updateStockValidations, markNewStockValidations} from "../helpers/stockValidations";
import {deleteSoldValidations} from "../helpers/payedValidations";
import {UserRecord} from "firebase-admin/auth";

// OBTENER DOCUMENTOS
export const getAllProducts = (async (response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Stock",
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

// VERIFICA SI UN STOCK EXISTE
export const verifyStockExistById = (async (stockId: number, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Stock",
        id: stockId.toString(),
        where: null,
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El stock con este nombre y apellido ya existe." : "El stock con este nombre y apellido no existe.",
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// VERIFICA SI UN STOCK EXISTE
export const verifyStockExistByName = (async (name: string, mustExists: boolean, response:any) => {
  if (response.code === 0) {
    const newReq : {body: GetDocumentsRequestProps} = {
      body: {
        collection: "Stock",
        id: null,
        where: {field: "name", filter: "==", value: capitalizeFullName(name)},
        order: null,
      },
    };

    response = await getDocuments(newReq, response);

    response = {
      body: response.body !== null ? response.body.document : null,
      trace: response.body !== null ? "DOCUMENTS_FOUNDED" : "DOCUMENTS_NOT_FOUNDED",
      message: response.body !== null ? "El stock con este nombre y apellido ya existe." : "El stock con este nombre y apellido no existe.",
      // code: response.body === null && returnError ? 1 : 0,
      code: mustExists ? (response.body === null ? 1 : 0) : (response.body != null ? 1 : 0),
    };
  }

  return response;
});

// CREA UN STOCKE
export const createStockDocument = (async (stock: StockProps, response:any) => {
  if (response.code === 0) {
    response = createStockValidations(response, stock);

    if (response.code === 0) {
      if (response.code === 0) {
        const newReq : {body: {collection: string, id: string, doc: StockProps}} = {
          body: {
            collection: "Stock",
            id: stock.id.toString(),
            doc: stock,
          },
        };

        response = await addDocument(newReq, response);
      }
    }
  }
  return response;
});

// ACTUALIZA UN STOCKE
export const updateStockDocument = (async (stock: StockProps, response:any) => {
  if (response.code === 0) {
    response = updateStockValidations(response, stock);
    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string, doc: StockProps}} = {
        body: {
          collection: "Stock",
          id: stock.id.toString(),
          doc: stock,
        },
      };

      response = await updateDocument(newReq, response);
    }
  }

  return response;
});

// ELIMINAR PRODUCTO VENDIDO
export const deleteProduct = (async (user: UserRecord, stockId: number, response:any) => {
  if (response.code === 0) {
    response = deleteSoldValidations(response, stockId);

    if (response.code === 0) {
      const newReq : {body: {collection: string, id: string}} = {
        body: {
          collection: "Stock",
          id: stockId.toString(),
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

// CREAR STOCKE
export const letsCreateNewStock = (async (user: UserRecord, body: NewStockProps, response:any) => {
  if (response.code === 0) {
    response = markNewStockValidations(response, body);

    if (response.code === 0) {
      const fulldate = parseInt(getFullDate());

      const newStock : StockProps = {
        id: fulldate,
        product: capitalizeFullName(body.product),
        description: body.description.trim(),
        serieNumber: body.serieNumber.trim(),
        weight: body.weight.trim(),
        totalAmount: 1,
        status: "active",
      };

      response = await createStockDocument(newStock, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "createStock",
          details: {
            after: {
              product: capitalizeFullName(body.product),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar crear el stocke.",
        code: 1,
      };
    }
  }

  return response;
});

// ACTUALIZAR STOCKE
export const letsUpdateStock = (async (user: UserRecord, stock: StockProps, body: LetsUpdateStockProps, response:any) => {
  if (response.code === 0) {
    response = updateStockValidations(response, stock);

    if (response.code === 0) {
      const updateStock : StockProps = {
        ...stock,
        product: body.data.product ? capitalizeFullName(body.data.product) : stock.product,
        description: body.data.description ? body.data.description.trim() : stock.description,
        serieNumber: body.data.serieNumber ? body.data.serieNumber.trim() : stock.serieNumber,
        weight: body.data.weight ? body.data.weight.trim() : stock.weight,
        totalAmount: 1,
      };

      response = await updateStockDocument(updateStock, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "updateStock",
          details: {
            after: {
              ...updateStock,
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el stocke.",
        code: 1,
      };
    }
  }

  return response;
});

// ELIMINAR STOCKE
export const letsDeleteStock = (async (user: UserRecord, stock: StockProps, response:any) => {
  if (response.code === 0) {
    response = updateStockValidations(response, stock);

    if (response.code === 0) {
      const newStock : StockProps = {
        ...stock,
        status: "deleted",
      };

      response = await updateStockDocument(newStock, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "deleteStock",
          details: {
            after: {
              product: capitalizeFullName(stock.product),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el stocke.",
        code: 1,
      };
    }
  }

  return response;
});

// REINCORPORAR STOCKE
export const letsReturnDeletedStock = (async (user:UserRecord, stock: StockProps, response:any) => {
  if (response.code === 0) {
    response = updateStockValidations(response, stock);

    if (response.code === 0) {
      const newStock : StockProps = {
        ...stock,
        status: "active",
      };

      response = await updateStockDocument(newStock, response);

      if (response.code === 0) {
        await logActivity({
          userId: user.displayName ?? user.email ?? "",
          action: "returnDeletedStock",
          details: {
            after: {
              product: capitalizeFullName(stock.product),
            },
          },
        });
      }
    } else {
      response = {
        body: null,
        trace: "DOCUMENTS_INCONSISTANCE",
        message: "Error al intentar eliminar el stocke.",
        code: 1,
      };
    }
  }

  return response;
});

// // VERIFICA SI UN LOTE EXISTE
// export const verifyLoteExist = (async (loteNumber: number, response:any) => {
//   if (response.code === 0) {
//     response = stockExistValidations(response, loteNumber);

//     if (response.code === 0) {
//       response = await getAllProducts(response);

//       if (response.code === 0) {
//         let item : StockProps | null = null;

//         if (response.body.length > 0) {
//           response.body.forEach((value : StockProps) => {
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
