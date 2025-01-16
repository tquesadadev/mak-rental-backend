import {ResponseProps} from "../interfaces/AuthInterfaces";
import { NewWorkProps, WorkProps } from "../interfaces/WorkInterfaces";

const createWorkValidations = (
  response: ResponseProps,
  doc: WorkProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      comments,
      createdDate,
      creator,
      id,
      status,
      activity,
      address,
      clientId,
      daysAmount,
      deliveryDate,
      payment,
      quote,
      retirementDate,
      shipping,
      state,
      stock,
      thirdPartyStock
    } = doc;

    if (clientId === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (clientId)",
        message: "Falta el campo clientId.",
        code: 1,
      };
    } else if (address === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (address)",
        message: "Falta el campo campo address.",
        code: 1,
      };
    } else if (daysAmount === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (daysAmount)",
        message: "Falta el campo campo daysAmount.",
        code: 1,
      };
    } else if (deliveryDate === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (deliveryDate)",
        message: "Falta el campo campo deliveryDate.",
        code: 1,
      };
    } else if (retirementDate === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (retirementDate)",
        message: "Falta el campo campo retirementDate.",
        code: 1,
      };
    } else if (payment === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (payment)",
        message: "Falta el campo campo payment.",
        code: 1,
      };
    } else if (shipping === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (shipping)",
        message: "Falta el campo campo shipping.",
        code: 1,
      };
    } else if (activity === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (activity)",
        message: "Falta el campo campo activity.",
        code: 1,
      };
    } else if (quote === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (quote)",
        message: "Falta el campo campo quote.",
        code: 1,
      };
    } else if (state === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (state)",
        message: "Falta el campo campo state.",
        code: 1,
      };
    } else if (stock === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (stock)",
        message: "Falta el campo campo stock.",
        code: 1,
      };
    } else if (thirdPartyStock === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (thirdPartyStock)",
        message: "Falta el campo campo thirdPartyStock.",
        code: 1,
      };
    } else if (id === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (id)",
        message: "Falta el campo campo id.",
        code: 1,
      };
    } else if (status === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (status)",
        message: "Falta el campo campo status.",
        code: 1,
      };
    } else if (comments === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (comments)",
        message: "Falta el campo campo comments.",
        code: 1,
      };
    } else if (createdDate === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (createdDate)",
        message: "Falta el campo campo createdDate.",
        code: 1,
      };
    } else if (creator === undefined) {
      response = {
        body: {},
        trace: "FIELD_MISSING (creator)",
        message: "Falta el campo campo creator.",
        code: 1,
      };
    }
  }

  return response;
};


const markNewWorkValidations = (
  response: ResponseProps,
  doc: NewWorkProps) => {
  if (doc === undefined) {
    response = {
      body: {},
      trace: "FIELD_MISSING (doc)",
      message: "Falta el campo doc.",
      code: 1,
    };
  } else {
    const {
      activity,
      address,
      clientId,
      daysAmount,
      deliveryDate,
      payment,
      quote,
     retirementDate,
     shipping,
     state,
     stock,
     thirdPartyStock
   } = doc;

   if (clientId === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (clientId)",
       message: "Falta el campo clientId.",
       code: 1,
     };
   } else if (address === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (address)",
       message: "Falta el campo campo address.",
       code: 1,
     };
   } else if (daysAmount === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (daysAmount)",
       message: "Falta el campo campo daysAmount.",
       code: 1,
     };
   } else if (deliveryDate === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (deliveryDate)",
       message: "Falta el campo campo deliveryDate.",
       code: 1,
     };
   } else if (retirementDate === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (retirementDate)",
       message: "Falta el campo campo retirementDate.",
       code: 1,
     };
   } else if (payment === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (payment)",
       message: "Falta el campo campo payment.",
       code: 1,
     };
   } else if (shipping === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (shipping)",
       message: "Falta el campo campo shipping.",
       code: 1,
     };
   } else if (activity === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (activity)",
       message: "Falta el campo campo activity.",
       code: 1,
     };
   } else if (quote === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (quote)",
       message: "Falta el campo campo quote.",
       code: 1,
     };
   } else if (state === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (state)",
       message: "Falta el campo campo state.",
       code: 1,
     };
   } else if (stock === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (stock)",
       message: "Falta el campo campo stock.",
       code: 1,
     };
   } else if (thirdPartyStock === undefined) {
     response = {
       body: {},
       trace: "FIELD_MISSING (thirdPartyStock)",
       message: "Falta el campo campo thirdPartyStock.",
       code: 1,
     };
   }
 }

  return response;
};

const workExistValidations = (
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

const updateWorkValidations = (
  response: ResponseProps,
  params: WorkProps) => {
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

export {
  createWorkValidations,
  updateWorkValidations,
  workExistValidations,
  markNewWorkValidations,
};
