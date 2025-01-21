import {initialResponse} from "../constants/initialStates";
import {getUserByEmail, verifyToken} from "../queries/authQueries";
import {validateRolePermissions} from "../functions/authFunctions";
import {markNewWorkValidations, updateWorkValidations} from "../helpers/workValidations";
import {UserRecord} from "firebase-admin/auth";
import {letsCreateNewWork, letsDeleteWork, letsReturnDeletedWork, letsUpdateWork, verifyWorkExistById} from "../functions/workFunctions";
const puppeteer = require('puppeteer');

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

  response = await updateWorkValidations(response, req.body);

  response = await verifyToken(req, response);

  response = await getUserByEmail(response.body?.email, response);

  const user : UserRecord = response.body?.user;

  response = await validateRolePermissions(user, "Administrador", response);

  response = await verifyWorkExistById(req.body.id, true, response);

  // response = await letsGeneratePdfWork(user, response.body, req.body, response);

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Aquí defines tu contenido HTML y CSS
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .header {
              background-color: #ffcc00;
              padding: 10px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
            .container {
              padding: 20px;
              border: 1px solid #ddd;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 8px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="header">Presupuesto</div>
          <div class="container">
            <p>Detalles del presupuesto generado automáticamente.</p>
            <table>
              <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>Alquiler de equipo</td>
                <td>2</td>
                <td>283.50</td>
                <td>567.00</td>
              </tr>
              <tr>
                <td>Flete</td>
                <td>1</td>
                <td>200.00</td>
                <td>200.00</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">Total sin I.V.A.</td>
                <td>767.00</td>
              </tr>
            </table>
          </div>
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generar el PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    res.setHeader('Content-disposition', 'attachment; filename=presupuesto.pdf');
    res.setHeader('Content-type', 'application/pdf');
    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    res.status(500).send('Error al generar el PDF');
  }

  // CREAR DOCUMENTO DE LA ACTIVIDAD

  res.status(response.code === 0 ? 200 : 500).json(response);
});
