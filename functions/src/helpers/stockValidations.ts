import {ResponseProps} from "../interfaces/AuthInterfaces";
import {StockProps, NewStockProps} from "../interfaces/StockInterfaces";

const createStockValidations = (
  response: ResponseProps,
  doc: NewStockProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      product,
      description,
      weight,
      serieNumber,
      totalAmount,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
    } = doc;

    if (product === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (product)",
        message: "Falta el campo product.",
        code: 1,
      };
    } else if (description === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (description)",
        message: "Falta el campo campo description.",
        code: 1,
      };
    } else if (weight === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (weight)",
        message: "Falta el campo campo weight.",
        code: 1,
      };
    } else if (serieNumber === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (serieNumber)",
        message: "Falta el campo campo serieNumber.",
        code: 1,
      };
    } else if (pricePerDay === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerDay)",
        message: "Falta el campo campo pricePerDay.",
        code: 1,
      };
    } else if (pricePerWeek === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerWeek)",
        message: "Falta el campo campo pricePerWeek.",
        code: 1,
      };
    } else if (pricePerMonth === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerMonth)",
        message: "Falta el campo campo pricePerMonth.",
        code: 1,
      };
    } else if (totalAmount === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (totalAmount)",
        message: "Falta el campo campo totalAmount.",
        code: 1,
      };
    }
  }

  return response;
};


const markNewStockValidations = (
  response: ResponseProps,
  doc: NewStockProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      product,
      description,
      weight,
      serieNumber,
      totalAmount,
      pricePerDay,
      pricePerWeek,
      pricePerMonth,
    } = doc;

    if (product === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (product)",
        message: "Falta el campo product.",
        code: 1,
      };
    } else if (description === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (description)",
        message: "Falta el campo campo description.",
        code: 1,
      };
    } else if (weight === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (weight)",
        message: "Falta el campo campo weight.",
        code: 1,
      };
    } else if (serieNumber === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (serieNumber)",
        message: "Falta el campo campo serieNumber.",
        code: 1,
      };
    } else if (pricePerDay === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerDay)",
        message: "Falta el campo campo pricePerDay.",
        code: 1,
      };
    } else if (pricePerWeek === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerWeek)",
        message: "Falta el campo campo pricePerWeek.",
        code: 1,
      };
    } else if (pricePerMonth === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (pricePerMonth)",
        message: "Falta el campo campo pricePerMonth.",
        code: 1,
      };
    } else if (totalAmount === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (totalAmount)",
        message: "Falta el campo campo totalAmount.",
        code: 1,
      };
    }
  }

  return response;
};

const stockExistValidations = (
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

const updateStockValidations = (
  response: ResponseProps,
  params: StockProps) => {
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

// const updateLoteValidations = (
//   response: ResponseProps,
//   params: LetsUpdateLoteProps) => {
//   if (params === undefined) {
//     response = {
//       body: {},
//       trace: "FIELD_MISSING (body)",
//       message: "Falta el campo body.",
//       code: 1,
//     };
//   } else {
//     const {
//       loteNumber,
//     } = params;

//     if (loteNumber === undefined) {
//       response = {
//         body: {},
//         trace: "FIELD_MISSING (loteNumber)",
//         message: "Falta el campo loteNumber.",
//         code: 1,
//       };
//     }
//   }

//   return response;
// };


export {
  createStockValidations,
  updateStockValidations,
  stockExistValidations,
  markNewStockValidations,
};
