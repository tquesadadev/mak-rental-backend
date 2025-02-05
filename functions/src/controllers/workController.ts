import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import { getPdfValidations, markNewWorkValidations, updateWorkValidations} from "../helpers/workValidations";
import {UserRecord} from "firebase-admin/auth";
import {letsCreateNewWork, letsDeleteWork, letsReturnDeletedWork, letsUpdateWork, verifyWorkExistById} from "../functions/workFunctions";
import { calculateTotalAmountAndProfit, cleanPriceText, formatDateText, formatPrice, getActiveStock, getClientData, getDate } from "../utils/Utilities";
import {WorkProps } from "../interfaces/WorkInterfaces";
import { getAllProducts } from "../functions/stockFunctions";
import { getAllClients } from "../functions/clientFunctions";
import { StockProps } from "../interfaces/StockInterfaces";
import { initialStateNewStock } from "../utils/Jsons";
const puppeteer = require("puppeteer");
const convertir = require('numero-a-letras');
const fs = require('fs');
const path = require('path');

// CREA UN WORK
export const startCreateWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await markNewWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await letsCreateNewWork(user, req.body, response);

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ACTUALIZA UN WORK
export const startUpdateWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsUpdateWork(user, response.body, req.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// ELIMINAR WORK
export const startDeleteWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsDeleteWork(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// REINCORPORAR WORK
export const startReturnDeletedWork = (async (req:any, res:any) => {
  let response = initialResponse;

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  response = await letsReturnDeletedWork(user, response.body, response);

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});

// DEVUELVE UN PDF
export const startPdfWork = (async (req:any, res:any) => {

  let response = initialResponse;

  console.log(req.body);
  console.log(req.body);
  console.log(req.body);
  
  response = await getPdfValidations(response, req.body);

  // response = await verifyToken(req, response);

  // response = await getUserByEmail(response.body?.email, response);

  // const user : UserRecord = response.body?.user;

  // response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  if (req.body.extension && response.body.extension === null) {
    response = {
      body: null,
      trace: "WORK_ERROR",
      message: "El alquiler no posee plazo extendido.",
      code: 1,
    };
  }

  const work: WorkProps = req.body.extension ? response.body?.extension : response.body;

  let stockResponse = initialResponse; 

  let clientsResponse = initialResponse; 

  stockResponse = await getAllProducts(response);

  clientsResponse = await getAllClients(stockResponse);

  if (response.code === 0 && stockResponse.code === 0 && clientsResponse.code === 0) {

    try {
      const browser = await puppeteer.launch({
          headless: true, // Modo headless
      });
      const page = await browser.newPage();

      const imagePath = path.join(process.cwd(), 'src', 'images', 'mak-logo-text.webp');
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
      const imageSrc = `data:image/webp;base64,${imageBase64}`;

      // Contenido HTML que será renderizado en el PDF
      const htmlContent = `
      <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Presupuesto N° ${work.quote.id.toString().padStart(8, '0')}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 800px;
              margin: 20px auto;
              background: #fafafa;
              border: 1px solid #ccc;
              min-height: 1100px;
              height: 100%;
              position: relative;
            }
            .header {
              position: relative;
              background-color: #000;
              height: 150px;
              border-bottom: 3px solid #fef9c9;;
            }
            .header-content {
              width: 45%;
              height: 100%;
              padding-left: 3%;
              background-color: #FFBB00;
              display: flex;
              align-items: center;
            }
            .header-text {
              color: #000;
            }
            .logo {
              position: absolute;
              top: 7px;
              right: 30px;
              text-align: center;
            }
            .logo img {
              width: 350px;
              height: auto;
              object-fit: contain;
            }
            .client-info {
              display: flex;
              padding: 10px 16px;
            }

            .client-info .left {
              width: 60%;
              font-size: 14px;
            }
            .client-info .left strong {
              font-size: 16px;
            }

            .client-info .left p {
              margin: 5px;
            }
            .client-info .right {
              width: 25%;
              text-align: right;
              display: flex;
              justify-content: flex-end;
              align-items: end;
              font-size: 14px;
            }
            .content {
              padding: 0px 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            table thead {
              border-top: 1px solid #333;
              border-bottom: 1px solid #333;
            }
            table th {
              padding: 8px;
              text-align: center;
            }

            table th:first-of-type {
              text-align: center;
            }
            table td {
              padding: 8px;
              text-align: left;
            }
            table th {
              font-weight: bold;
            }
            table td.text-right {
              text-align: center;
            }
            .footer {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            
            }
            .footer-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 1px solid #333;
              margin: 0px 16px;
              gap: 40px
            }

            .footer-text {
              display: flex;
              align-items: start;
              gap: 0px
            }

            .footer-text p {
              margin-left: 15px;
              text-transform: uppercase;
            }
            .footer-price {
              display: flex;
              gap: 30px;
              justify-content: space-between;
              align-items: center;
              margin-right: 50px;
              white-space: nowrap;
            }
            .footer-bottom {
              margin-top: 20px;
              padding: 30px ;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              background-color: #FFFFFF;
            }
            .footer-logo {
              width: 128px;
              height: 128px;
              background: #f4f4f4;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
            .contact-info {
              font-size: 12px;
              color: #666;
            }
            .total-box {
              width: 180px;
              height: 40px;
              background: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header -->
            <div class="header">
              <div class="header-content">
                <div class="header-text">
                  <p>Fecha: ${formatDateText(parseInt(getDate()))}</p>
                  <p>PRESUPUESTO N° ${work.quote.id.toString().padStart(8, '0')}</p>
                </div>
              </div>
              <div class="logo">
                  <img src="${imageSrc}" alt="Logo Mak Rental"/>
              </div>
            </div>

            <!-- Client Info -->
            <div class="client-info">
              <div class="left">
                ${
                  getClientData(clientsResponse.body, work.clientId)?.name 
                  ? `<p>${getClientData(clientsResponse.body, work.clientId)?.name.toUpperCase()}</p>`
                  : ''
                }
                ${
                  getClientData(clientsResponse.body, work.clientId)?.address 
                  ? `<p>${getClientData(clientsResponse.body, work.clientId)?.address}</p>`
                  : ''
                }
                ${
                  getClientData(clientsResponse.body, work.clientId)?.document 
                  ? `<p>${getClientData(clientsResponse.body, work.clientId)?.document}</p>`
                  : ''
                }
              </div>
            </div>

            <!-- Table -->
            <div class="content">
              <table>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th class="text-right">Precio Unitario</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    (work.stock.length > 0) ? work.stock.map((value) => {

                      const getStockProductInWork = () => {

                          let productValue: StockProps = initialStateNewStock

                          getActiveStock(stockResponse.body).find((product: StockProps) => { if (value.id === product.id) productValue = product })

                          return productValue
                      }

                      return `
                        <tr>
                          <td>${getStockProductInWork().product.toUpperCase()}<br><span style="color: #666;">${getStockProductInWork().description.toUpperCase()}</span></td>
                          <td class="text-right">$${formatPrice(calculateTotalAmountAndProfit([getStockProductInWork()], [], [], 0, work.daysAmount, false).totalAmount)}</td>
                        </tr>
                      `
                    }).join('') : '<div></div>'
                  }

                  ${
                    (work.thirdPartyStock && work.thirdPartyStock.data.length > 0) ? work.thirdPartyStock.data.map((value) => `
                        <tr>
                          <td>${value.product.toUpperCase()}<br><span style="color: #666;">${value.description.toUpperCase()}</span></td>
                          <td class="text-right">$${formatPrice(value.clientPrice)}</td>
                        </tr>
                      `
                    ).join('') : '<div></div>'
                  }

                  ${
                    (work.shipping.length > 0) ? work.shipping.map((value, index) => `
                        <tr>
                          <td>FLETE #${index + 1} (ENVIO Y RETIRO)<br><span style="color: #666;">${work.address.toUpperCase()}</span></td>
                          <td class="text-right">$${formatPrice(value.amount)}</td>
                        </tr>
                      `
                    ).join('') : '<div></div>'
                  }
                </tbody>
              </table>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div class="footer-top">
                <div class="footer-text">
                  <p>SON</p>
                  <p>${cleanPriceText(convertir.NumerosALetras(calculateTotalAmountAndProfit(work.stock, work.thirdPartyStock?.data ?? [], work.shipping, work.payment.discount, work.daysAmount, true).totalAmount))}</p>
                </div>
                <div class="footer-price">
                  <p style="color: #666;">Total sin I.V.A.</p>
                  <p style="font-size: 24px; font-weight: bold;">$${formatPrice(calculateTotalAmountAndProfit(work.stock, work.thirdPartyStock?.data ?? [], work.shipping, work.payment.discount, work.daysAmount, true).totalAmount)}</p>
                </div>
              </div>

              <div class="footer-bottom">
                <div class="footer-logo">LOGO</div>
                <div class="contact-info">
                  <p>Colectora Panamericana KM 40.5</p>
                  <p>Ramal Pilar - Del viso - Bs. As. - C.P. 1669</p>
                  <p>Tel.: 02304429474</p>
                  <p>info@unirental.com.ar</p>
                  <p>www.unirental.com.ar</p>
                </div>
                <div class="total-box">LOGO</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        path: 'probando.pdf',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        displayHeaderFooter: false,
      });
      
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Presupuesto N ${work.quote.id.toString().padStart(8, '0')}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.end(pdfBuffer);

    } catch (error) {
      console.error(error);
      response = {
        body: null,
        trace: "PDF_ERROR",
        message: "Ocurrió un error al generar el pdf.",
        code: 1,
      };
      res.status(500).json(response);
    }

  } else {
    res.status(500).json(response);
  }


});
