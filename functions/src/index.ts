
import {onRequest} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
const cors = require("cors");
const express = require("express");

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: false}));

const corsUrls = [
  "http://localhost:3000",
  "http://localhost:3000/*",
  "https://feria-paso-del-rey.pages.dev",
  "https://feria-paso-del-rey.pages.dev/*",
  "https://staging.feria-paso-del-rey.pages.dev",
  "https://staging.feria-paso-del-rey.pages.dev/*",
  "https://paseodelrey.com.ar",
  "https://paseodelrey.com.ar/*",
];

app.use(
  cors({
    origin: corsUrls,
  })
);

app.use((req: any, res: any, next: any) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");

  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }

  next();
});

initializeApp();

app.use("/v1/auth", require("./routes/auth"));
app.use("/v1/client", require("./routes/client"));
app.use("/v1/stock", require("./routes/stock"));
app.use("/v1/payed", require("./routes/payed"));

exports.api = onRequest({cors: corsUrls}, app);
