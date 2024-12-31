import {startCreateStock, startDeleteStock, startReturnDeletedStock, startUpdateStock} from "../controllers/stockController";

const express = require("express");
const router = express.Router();

// /v1/stock

// CREA UN STOCK
router.post("/createStock", [], startCreateStock);

// ACTUALIZA UN STOCK
router.post("/updateStock", [], startUpdateStock);

// ELIMINA UN STOCK
router.post("/deleteStock", [], startDeleteStock);

// REINCORPORAR UN STOCK ELIMINADO
router.post("/returnDeletedStock", [], startReturnDeletedStock);

module.exports = router;
