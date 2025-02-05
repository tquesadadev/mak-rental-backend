import {startCreateWork, startDeleteWork, startPdfWork, startReturnDeletedWork, startUpdateWork} from "../controllers/workController";

const express = require("express");
const router = express.Router();

// /v1/work

// CREA UN WORK
router.post("/createWork", [], startCreateWork);

// ACTUALIZA UN WORK
router.post("/updateWork", [], startUpdateWork);

// ELIMINA UN WORK
router.post("/deleteWork", [], startDeleteWork);

// REINCORPORAR UN WORK ELIMINADO
router.post("/returnDeletedWork", [], startReturnDeletedWork);

// REINCORPORAR UN WORK ELIMINADO
router.post("/pdf", [], startPdfWork);

module.exports = router;
