import {ResponseProps} from "../interfaces/AuthInterfaces";
import {MarkAsPayedProps, PayedProps} from "../interfaces/PayedInterfaces";

const createPayedValidations = (
  response: ResponseProps,
  doc: PayedProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      id,
      amount,
      date,
      author,
      clientId,
      lotes,
      week,
    } = doc;

    if (id === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (id)",
        message: "Falta el campo id.",
        code: 1,
      };
    } else if (amount === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (amount)",
        message: "Falta el campo amount.",
        code: 1,
      };
    } else if (date === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (date)",
        message: "Falta el campo campo date.",
        code: 1,
      };
    } else if (clientId === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (clientId)",
        message: "Falta el campo campo clientId.",
        code: 1,
      };
    } else if (lotes === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (lotes)",
        message: "Falta el campo campo lotes.",
        code: 1,
      };
    } else if (week === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (week)",
        message: "Falta el campo campo week.",
        code: 1,
      };
    } else if (author === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (author)",
        message: "Falta el campo campo author.",
        code: 1,
      };
    }
  }

  return response;
};

const deleteSoldValidations = (
  response: ResponseProps,
  id: number) => {
  if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo id.",
      code: 1,
    };
  }

  return response;
};

const payedExistValidations = (
  response: ResponseProps,
  id: number) => {
  if (id === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (id)",
      message: "Falta el campo id.",
      code: 1,
    };
  }

  return response;
};

const markAsPayedValidations = (
  response: ResponseProps,
  body: MarkAsPayedProps) => {
  const {week, loteNumber} = body;

  if (body === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (body)",
      message: "Falta el campo body.",
      code: 1,
    };
  } else if (week === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (week)",
      message: "Falta el campo week.",
      code: 1,
    };
  } else if (week.startDate === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (week.startDate)",
      message: "Falta el campo week.startDate.",
      code: 1,
    };
  } else if (week.endDate === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (week.endDate)",
      message: "Falta el campo week.endDate.",
      code: 1,
    };
  } else if (loteNumber === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (loteNumber)",
      message: "Falta el campo loteNumber.",
      code: 1,
    };
  }

  return response;
};

export {
  createPayedValidations,
  deleteSoldValidations,
  markAsPayedValidations,
  payedExistValidations,
};
