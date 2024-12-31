import {startCreateClient, startUpdateClient, startDeleteClient, startReturnDeletedClient} from "../controllers/clientController";

const express = require("express");
const router = express.Router();

// /v1/client

// CREA UN CLIENTE
router.post("/createClient", [], startCreateClient);

// ACTUALIZA UN CLIENTE
router.post("/updateClient", [], startUpdateClient);

// ELIMINA UN CLIENTE
router.post("/deleteClient", [], startDeleteClient);

// REINCORPORAR UN CLIENTE ELIMINADO
router.post("/returnDeletedClient", [], startReturnDeletedClient);

module.exports = router;
