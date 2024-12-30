import {startCreatePayed, startDeletePayed} from "../controllers/payedController";

const express = require("express");
const router = express.Router();

// /v1/payed

// INDICA PAGO
router.post("/createPayed", [], startCreatePayed);

// ELIMINAR PAGO
router.post("/deletePayed", [], startDeletePayed);

module.exports = router;
