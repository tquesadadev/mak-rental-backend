import {ResponseProps} from "../interfaces/AuthInterfaces";
import {ClientProps, LetsUpdateLoteProps, NewClientProps} from "../interfaces/ClientInterfaces";

const createClientValidations = (
  response: ResponseProps,
  doc: NewClientProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      name,
      phone,
      lotes,
    } = doc;

    if (name === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (name)",
        message: "Falta el campo name.",
        code: 1,
      };
    } else if (phone === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (phone)",
        message: "Falta el campo campo phone.",
        code: 1,
      };
    } else if (lotes === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (lotes)",
        message: "Falta el campo campo lotes.",
        code: 1,
      };
    } else if (lotes !== undefined) {
      lotes.forEach((lote) => {
        if (lote.loteNumber === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.loteNumber)",
            message: "Falta el campo lote.loteNumber.",
            code: 1,
          };
        } else if (lote.price === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.price)",
            message: "Falta el campo lote.price.",
            code: 1,
          };
        } else if (lote.categoryId === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.categoryId)",
            message: "Falta el campo lote.categoryId.",
            code: 1,
          };
        }
      });
    }
  }

  return response;
};


const markNewClientValidations = (
  response: ResponseProps,
  doc: NewClientProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      name,
      phone,
      lotes,
    } = doc;

    if (name === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (name)",
        message: "Falta el campo name.",
        code: 1,
      };
    } else if (phone === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (phone)",
        message: "Falta el campo campo phone.",
        code: 1,
      };
    } else if (lotes === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (lotes)",
        message: "Falta el campo campo lotes.",
        code: 1,
      };
    } else if (lotes !== undefined) {
      lotes.forEach((lote) => {
        if (lote.loteNumber === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.loteNumber)",
            message: "Falta el campo lote.loteNumber.",
            code: 1,
          };
        } else if (lote.categoryId === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.categoryId)",
            message: "Falta el campo campo lote.categoryId.",
            code: 1,
          };
        } else if (lote.price === undefined) {
          response = {
            body: {},
            trace: "FIELD_MISSING (lote.price)",
            message: "Falta el campo campo lote.price.",
            code: 1,
          };
        }
      });
    }
  }

  return response;
};

const clientExistValidations = (
  response: ResponseProps,
  id: number) => {
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

const updateClientValidations = (
  response: ResponseProps,
  params: ClientProps) => {
  if (params === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else {
    const {
      id,
    } = params;

    if (id === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (id)",
        message: "Falta el campo id.",
        code: 1,
      };
    }
  }

  return response;
};

const updateLoteValidations = (
  response: ResponseProps,
  params: LetsUpdateLoteProps) => {
  if (params === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else {
    const {
      loteNumber,
    } = params;

    if (loteNumber === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (loteNumber)",
        message: "Falta el campo loteNumber.",
        code: 1,
      };
    }
  }

  return response;
};


export {
  createClientValidations,
  updateClientValidations,
  clientExistValidations,
  markNewClientValidations,
  updateLoteValidations,
};
