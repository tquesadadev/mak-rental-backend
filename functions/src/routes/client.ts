import {startCreateClient, startUpdateClient, startDeleteClient, startUpdateLote, startReturnDeletedClient, startUpdateClientV2} from "../controllers/clientController";

const express = require("express");
const router = express.Router();

// /v1/client

// CREA UN CLIENTE
router.post("/createClient", [], startCreateClient);

// ACTUALIZA UN CLIENTE
router.post("/updateClient", [], startUpdateClient);

// ACTUALIZA UN CLIENTE
router.post("/updateClientV2", [], startUpdateClientV2);

// ELIMINA UN CLIENTE
router.post("/deleteClient", [], startDeleteClient);

// REINCORPORAR UN CLIENTE ELIMINADO
router.post("/returnDeletedClient", [], startReturnDeletedClient);

// ACTUALIZAR UN LOTE
router.post("/updateLote", [], startUpdateLote);

module.exports = router;
