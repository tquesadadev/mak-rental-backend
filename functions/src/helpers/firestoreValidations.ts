import {ResponseProps} from "../interfaces/AuthInterfaces";
import {AddSetDocumentRequestProps, DeleteDocumentRequestProps, GetDocumentsRequestProps, UpdateDocumentRequestProps} from "../interfaces/FirestoreInterfaces";

const getDocumentsValidations = (
  response: ResponseProps,
  body: GetDocumentsRequestProps) => {
  const {collection, id, where, order} = body;

  if (collection === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (collection)",
      message: "Falta el campo colección.",
      code: 1,
    };
  } else if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo identificador documento.",
      code: 1,
    };
  } else if (where === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (where)",
      message: "Falta el campo campo donde.",
      code: 1,
    };
  } else if (where !== null && where?.field === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (where.field)",
      message: "Falta el campo donde > campo.",
      code: 1,
    };
  } else if (where !== null && where?.filter === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (where.filter)",
      message: "Falta el campo donde > filtro.",
      code: 1,
    };
  } else if (where !== null && where?.value === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (where.value)",
      message: "Falta el campo donde > valor.",
      code: 1,
    };
  } else if (order === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (order)",
      message: "Falta el campo campo donde.",
      code: 1,
    };
  } else if (order !== null && order?.field === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (order.field)",
      message: "Falta el campo donde > campo.",
      code: 1,
    };
  } else if (order !== null && order?.direction === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (order.?.direction)",
      message: "Falta el campo donde > filtro.",
      code: 1,
    };
  }

  return response;
};

const addDocumentValidations = (
  response: ResponseProps,
  body: AddSetDocumentRequestProps | UpdateDocumentRequestProps) => {
  const {collection, id, doc} = body;

  if (collection === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (collection)",
      message: "Falta el campo colección.",
      code: 1,
    };
  } else if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo documento.",
      code: 1,
    };
  } else if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo campo id.",
      code: 1,
    };
  }

  return response;
};

const deleteDocumentValidations = (
  response: ResponseProps,
  body: DeleteDocumentRequestProps) => {
  const {collection, id} = body;

  if (collection === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (collection)",
      message: "Falta el campo colección.",
      code: 1,
    };
  } else if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo campo id.",
      code: 1,
    };
  }

  return response;
};

const getDocumentsWhereValidations = (
  response: ResponseProps,
  collection: string,
  field: string,
  where: FirebaseFirestore.WhereFilterOp,
  value: string) => {
  if (!collection) {
    response = {
      body: {},
      trace: "FIELD_MISSING (collection)",
      message: "Falta el campo colección.",
      code: 1,
    };
  } else if (collection.trim() === null ||
  collection.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (collection)",
      message: "Falta completar el campo colección.",
      code: 1,
    };
  } else if (!field) {
    response = {
      body: {},
      trace: "FIELD_MISSING (field)",
      message: "Falta el campo field.",
      code: 1,
    };
  } else if (field.trim() === null ||
  field.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (field)",
      message: "Falta completar el campo field.",
      code: 1,
    };
  } else if (!where) {
    response = {
      body: {},
      trace: "FIELD_MISSING (where)",
      message: "Falta el campo where.",
      code: 1,
    };
  } else if (where.trim() === null ||
  where.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (where)",
      message: "Falta completar el campo where.",
      code: 1,
    };
  } else if (!value) {
    response = {
      body: {},
      trace: "FIELD_MISSING (value)",
      message: "Falta el campo value.",
      code: 1,
    };
  } else if (value.trim() === null ||
  value.trim().length === 0) {
    response = {
      body: {},
      trace: "FIELD_INCOMPLETE (value)",
      message: "Falta completar el campo value.",
      code: 1,
    };
  }
  return response;
};

export {
  addDocumentValidations,
  getDocumentsValidations,
  getDocumentsWhereValidations,
  deleteDocumentValidations,
};
