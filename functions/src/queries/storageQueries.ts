import {handleError} from "../constants/errors";
import {getStorage, getDownloadURL} from "firebase-admin/storage";
import {AddSetUpdateFileStorageRequestProps, GetFileStorageRequestProps} from "../interfaces/StorageInterfaces";
import {addSetUpdateFileValidations, getFileValidations} from "../helpers/storageValidations";

// DEVUELVE LOS DOCUMENTOS DE UNA COLLECTION
export const getImage = (async (request:any, response:any) => {
  response = getFileValidations(response, request.body as GetFileStorageRequestProps);

  if (response.code === 0) {
    const storage = getStorage().bucket();

    const {id} = request.body as GetFileStorageRequestProps;

    const file = storage.file(id);

    await getDownloadURL(file).then((url) => {
      response = {
        body: {
          url,
        },
        trace: "FILE_FOUNDED",
        message: "Información encontrada correctamente.",
        code: 0,
      };
    })
      .catch((error: Error) => handleError(error, response));
  }

  return response;
});

// AGREGA Y ACTUALIZA UN ARCHIVO AL STORAGE
export const addUpdateStorage = (async (request:any, response:any) => {
  response = addSetUpdateFileValidations(response, request.body as AddSetUpdateFileStorageRequestProps);

  if (response.code === 0) {
    const storage = getStorage().bucket();

    const {id, file} = request.body as AddSetUpdateFileStorageRequestProps;

    await storage.upload(file, {
      destination: id,
      metadata: {
        metadata: {
          // Puedes añadir metadatos adicionales si lo deseas
          customMetadata: {
            originalName: id,
          },
        },
      },
    }).then(async (resp) => {
      await getDownloadURL(resp[0]).then((url) => {
        response = {
          body: {
            url,
          },
          trace: "FILE_UPLOADED",
          message: "Archivo agregado con éxito.",
          code: 0,
        };
      })
        .catch((error: Error) => handleError(error, response));
    })
      .catch((error: Error) => handleError(error, response));
  }

  return response;
});

// ELIMINAR UN ARCHIVO AL STORAGE
export const deleteStorage = (async (request:any, response:any) => {
  response = getFileValidations(response, request.body as GetFileStorageRequestProps);

  if (response.code === 0) {
    const storage = getStorage().bucket();

    const {id} = request.body as GetFileStorageRequestProps;

    const regex = /\/o\/(.*?)\?alt/;

    const match = id.match(regex);

    const file = storage.file(match ? match[1] : id);

    // const file = storage.file(id);

    await file.delete().then(() => {
      response = {
        body: null,
        trace: "FILE_DELETED",
        message: "Archivo eliminado con éxito.",
        code: 0,
      };
    })
      .catch((error: Error) => handleError(error, response));
  }

  return response;
});
