import {ResponseProps} from "../interfaces/AuthInterfaces";
import {GetFileStorageRequestProps, AddSetUpdateFileStorageRequestProps, DeleteFileStorageRequestProps} from "../interfaces/StorageInterfaces";

const getFileValidations = (
  response: ResponseProps,
  body: GetFileStorageRequestProps) => {
  const {id} = body;

  if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo identificador documento.",
      code: 1,
    };
  }

  return response;
};

const addSetUpdateFileValidations = (
  response: ResponseProps,
  body: AddSetUpdateFileStorageRequestProps) => {
  const {id, file} = body;

  if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo campo id.",
      code: 1,
    };
  } else if (file === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (file)",
      message: "Falta el campo campo file.",
      code: 1,
    };
  }

  return response;
};

const deleteFileValidations = (
  response: ResponseProps,
  body: DeleteFileStorageRequestProps) => {
  const {id} = body;

  if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo campo id.",
      code: 1,
    };
  }

  return response;
};

export {
  getFileValidations,
  addSetUpdateFileValidations,
  deleteFileValidations,
};
