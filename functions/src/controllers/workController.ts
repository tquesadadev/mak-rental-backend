import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {markNewWorkValidations, updateWorkValidations} from "../helpers/workValidations";
import {UserRecord} from "firebase-admin/auth";
import {letsCreateNewWork, letsDeleteWork, letsReturnDeletedWork, letsUpdateWork, verifyWorkExistById} from "../functions/workFunctions";
const puppeteer = require("puppeteer");

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
  // let response = initialResponse;

  // response = await updateWorkValidations(response, req.body);

  // response = await verifyToken(req, response);

  // response = await getUserByEmail(response.body?.email, response);

  // const user : UserRecord = response.body?.user;

  // response = await validateRolePermissions(user, "Administrador", response);

  // response = await verifyWorkExistById(req.body.id, true, response);

  // response = await letsGeneratePdfWork(user, response.body, req.body, response);

  try {
    const browser = await puppeteer.launch({
        headless: true, // Modo headless
    });
    const page = await browser.newPage();

    // Contenido HTML que será renderizado en el PDF
    const htmlContent = `
   <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Presupuesto</title>
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
            background: #fff;
            border: 1px solid #ccc;
            min-height: 1100px;
            position: relative;
          }
          .header {
            position: relative;
          }
          .header-bg {
            background-color: #FFBB00;
            height: 140px;
            clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
          }
          .header-content {
            padding: 16px;
          }
          .header-text {
            color: #000;
          }
          .header-text p {
            margin: 0;
          }
          .logo {
            position: absolute;
            top: 24px;
            right: 32px;
            text-align: center;
          }
          .logo-box {
            width: 280px;
            height: 60px;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          .client-info {
            padding: 16px;
            background: #f9f9f9;
            border-top: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
          }
          .client-info .left, .client-info .right {
            display: inline-block;
            vertical-align: top;
          }
          .client-info .left {
            width: 70%;
          }
          .client-info .right {
            width: 30%;
            text-align: right;
          }
          .content {
            padding: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          table th, table td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ccc;
          }
          table th {
            font-weight: bold;
          }
          table td.text-right {
            text-align: right;
          }
          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 16px;
          }
          .footer-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-top: 1px solid #ccc;
            padding-top: 16px;
          }
          .footer-bottom {
            margin-top: 48px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
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
            <div class="header-bg"></div>
            <div class="header-content">
              <div class="header-text">
                <p>Fecha: 31 de Octubre de 2024</p>
                <p>PRESUPUESTO U-00001-00010124</p>
              </div>
            </div>
            <div class="logo">
              <div class="logo-box">
                <span>LOGO</span>
              </div>
              <p>Unirental S.R.L.</p>
            </div>
          </div>

          <!-- Client Info -->
          <div class="client-info">
            <div class="left">
              <p><strong>1,242 PUNTO GALAICO S.R.L</strong></p>
              <p>LA RIOJA 1294 Piso:4 Dpto:14</p>
              <p>CIUDAD AUTONOMA BL Buenos Aires</p>
            </div>
            <div class="right">
              <p>30-71620400-2</p>
            </div>
          </div>

          <!-- Table -->
          <div class="content">
            <table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Descripción</th>
                  <th class="text-right">Cantidad</th>
                  <th class="text-right">Pr. Unitario</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HA12IP X DIA</td>
                  <td>BRAZO ARTICULADO HA12IP ALQUILER X DIA<br><span style="color: #666;">1 EQUIPO POR 2 DIAS, PLAZO MINIMO DE ALQUILER</span></td>
                  <td class="text-right">2</td>
                  <td class="text-right">283.50</td>
                  <td class="text-right">567.00</td>
                </tr>
                <tr>
                  <td>FLETE HA12</td>
                  <td>FLETE (ENVIO Y RETIRO) BRAZO ART. HA12IP<br><span style="color: #666;">LOMAS DE ZAMORA</span></td>
                  <td class="text-right">1</td>
                  <td class="text-right">200.00</td>
                  <td class="text-right">200.00</td>
                </tr>
              </tbody>
            </table>
            <p style="margin-top: 16px; font-size: 12px; color: #666;">COTIZACION EXPRESADA EN DOLARES (VALOR BNA)<br>LOS PRECIOS NO INCLUYEN I.V.A.</p>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-top">
              <p>SON SETECIENTOS SESENTA Y SIETE</p>
              <div>
                <p style="color: #666;">Total sin I.V.A.</p>
                <p style="font-size: 24px; font-weight: bold;">767.00</p>
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

    await page.setContent(htmlContent);
    // await page.goto('https://softwaretracker.com.ar/', {
    //   waitUntil: 'networkidle0',
      
    // });
    // Generar el PDF en memoria
    const pdfBuffer = await page.pdf({
        format: 'A4', // Formato de página
        path: 'probando.pdf',
        printBackground: true, // Incluir estilos CSS de fondo
    });

    await browser.close();

    // Configurar encabezados para descargar el archivo como PDF
    res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename="presupuesto.pdf"');
    res.status(200).send(pdfBuffer); // Enviar el archivo PDF como respuesta
} catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Error al generar el PDF');
}
  // CREAR DOCUMENTO DE LA ACTIVIDAD

  // res.status(response.code === 0 ? 200 : 500).json(response);
});
