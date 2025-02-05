import {getFirestore} from "firebase-admin/firestore";
import { StockProps } from "../interfaces/StockInterfaces";
import { ClientProps } from "../interfaces/ClientInterfaces";

const formatTwoNumbers = (month: any) => {
  let m = month;

  if (m < 10) {
    m = `0${m}`;
  }

  return m;
};

export const fillWithCeros = (inputString: string, length: number) => {
  // Verificar la longitud actual del string
  if (inputString.length < length) {
    // Calcular la cantidad de ceros que se deben agregar
    const cerosLeft = length - inputString.length;

    // Completar con ceros a la izquierda
    const string = "0".repeat(cerosLeft) + inputString;

    return string;
  } else {
    // Si ya tiene 12 caracteres o más, devolver el string original
    return inputString;
  }
};

export const getFullDate = () => {
  // const date = new Date();

  // let fullDate = '';
  // const year = date.getFullYear();
  // const month = formatTwoNumbers(date.getMonth() + 1);
  // const day = formatTwoNumbers(date.getDate());
  // const hours = formatTwoNumbers(date.getHours());
  // const minutes = formatTwoNumbers(date.getMinutes());
  // const seconds = formatTwoNumbers(date.getSeconds());
  // const miliseconds = fillWithCeros(date.getMilliseconds().toString(), 3);

  // fullDate = `${year}${month}${day}${hours}${minutes}${seconds}${miliseconds}`;

  // return fullDate

  // ///////////////////////////////////////////////////////////////////////////

  const date = new Date();

  // Obtener la fecha en la zona horaria -3
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires", // Zona horaria de Buenos Aires
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);

  // Extraer las partes de la fecha
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const second = parts.find((p) => p.type === "second")?.value ?? "";
  const milliseconds = fillWithCeros(date.getMilliseconds().toString(), 3);

  // Concatenar la fecha completa
  const fullDate = `${year}${month}${day}${hour}${minute}${second}${milliseconds}`;

  return fullDate;
};


export const getDate = () => {
  const date = new Date();

  let fullDate = "";
  const year = date.getFullYear();
  const month = formatTwoNumbers(date.getMonth() + 1);
  const day = formatTwoNumbers(date.getDate());

  fullDate = `${year}${month}${day}`;

  return fullDate;
};

export const capitalizeFullName = (fullName: string) => {
  if (!fullName || typeof fullName !== "string") return ""; // Validación básica

  return fullName
    .trim() // Elimina espacios innecesarios al inicio y al final
    .split(" ") // Divide el nombre en palabras
    .map((word) => {
      // Asegúrate de que cada palabra sea capitalizada
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" "); // Une las palabras en una sola cadena
};

interface ActivityLogProps {
  userId: string; // ID del usuario que realiza la acción
  action: "createClient" | "updateClient" | "deleteClient" | "returnDeletedClient" | "createStock" | "updateStock" | "deleteStock" | "returnDeletedStock"
  | "markPayed" | "deletePayed" | "approveAccess" | "deleteAccess" | "createWork" | "updateWork" | "deleteWork" | "returnDeletedWork";
  timestamp?: number; // Fecha y hora de la acción, se genera automáticamente si no se pasa
  details: {
    before?: any;
    after: any;
  }; // Detalles específicos de la acción
}

export const logActivity = async (logData: ActivityLogProps) => {
  const firestore = getFirestore();
  const timestamp = logData.timestamp ?? parseInt(getFullDate()); // Genera la marca de tiempo si no está incluida

  const activityLog = {
    userId: logData.userId,
    action: logData.action,
    timestamp,
    details: logData.details,
  };

  try {
    await firestore.collection("Activity").add(activityLog);
    console.log("Actividad registrada:", activityLog);
  } catch (error) {
    console.error("Error al registrar la actividad:", error);
  }
};

export function cleanPriceText(texto: string) {
  return texto.replace(/\bde \b/i, "").replace(/pesos 00\/100 m\.n\./i, "").trim();
}

export const formatPrice = (price: number) => {

  let p: number = price;
  const internationarFormat = new Intl.NumberFormat('de-DE')

  const result: string = internationarFormat.format(p);

  return result;

}

export const formatDateYYYYmmDD = (date: number) => {

  let d = date.toString().slice(6, 8);
  let m = date.toString().slice(4, 6);
  let y = date.toString().slice(0, 4);

  return `${y}-${m}-${d}`;

}

export const formatDateText = (date: number) => {

  let month = '';

  let d = date.toString().slice(6, 8);
  let m = date.toString().slice(4, 6);
  let y = date.toString().slice(0, 4);

  switch (m) {
    case '01':
        month = 'Enero';
        break;
    case '02':
        month = 'Febrero';
        break;
    case '03':
        month = 'Marzo';
        break;
    case '04':
        month = 'Abril';
        break;
    case '05':
        month = 'Mayo';
        break;
    case '06':
        month = 'Junio';
        break;
    case '07':
        month = 'Juio';
        break;
    case '08':
        month = 'Agosto';
        break;
    case '09':
        month = 'Septiembre';
        break;
    case '10':
        month = 'Octubre';
        break;
    case '11':
        month = 'Noviembre';
        break;
    case '12':
        month = 'Diciembre';
        break;
  }

  return `${d} de ${month} de ${y}`;

}

export const getFullDateText = () => {

  const date = new Date();

  let month = '';

  let d = date.toString().slice(6, 8);
  let m = date.toString().slice(4, 6);
  let y = date.toString().slice(0, 4);

  switch (m) {
      case '01':
          month = 'Enero';
          break;
      case '02':
          month = 'Febrero';
          break;
      case '03':
          month = 'Marzo';
          break;
      case '04':
          month = 'Abril';
          break;
      case '05':
          month = 'Mayo';
          break;
      case '06':
          month = 'Junio';
          break;
      case '07':
          month = 'Juio';
          break;
      case '08':
          month = 'Agosto';
          break;
      case '09':
          month = 'Septiembre';
          break;
      case '10':
          month = 'Octubre';
          break;
      case '11':
          month = 'Noviembre';
          break;
      case '12':
          month = 'Diciembre';
          break;
  }

  return `${d} de ${month} de ${y}`;

}

export const getClientData = (clientsList: ClientProps[], clientId: number) => {

  return clientsList.find((client) => client.id === clientId)
}

export const getStockData = (stockList: StockProps[], clientId: number) => {

  return stockList.find((client) => client.id === clientId)
}