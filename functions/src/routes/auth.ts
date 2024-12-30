import {startApproveAccessMember, startCreateANewUser, startDeleteUserMember, startGetAllMembersAndAccessUsers, startGetRole, startSetRole, startUpdateFullnameUser} from "../controllers/authController";

const express = require("express");
const router = express.Router();

// /v1/auth

// CREAR NUEVO USUARIO
router.post("/createUser", [], startCreateANewUser);

// ACTUALIZAR NOMBRE Y APELLIDO DEL USUARIO
router.post("/updateFullnameUser", [], startUpdateFullnameUser);

// OBTENER TODOS LOS MIEMBROS
router.get("/members", [], startGetAllMembersAndAccessUsers);

// ELIMINAR USUARIO
router.post("/deleteMember", [], startDeleteUserMember);

// APROBAR USUARIO
router.post("/approveAccess", [], startApproveAccessMember);

// ASIGNAR ROL
router.post("/setRole", [], startSetRole);

// OBTENER ROL
router.get("/getRole", [], startGetRole);

module.exports = router;
