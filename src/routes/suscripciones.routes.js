import { Router } from "express";
import {
  createSuscripcion,
  deleteSuscripcion,
  getSuscripciones,
  getSuscripcion,
  updateSuscripcion,
  updateTipoSuscripcion,
  calcularCostoAnual,
  ahorroAnual,
} from "../controllers/suscripciones.controllers.js";

const router = Router();

router.get("/suscripciones", getSuscripciones);
router.get("/suscripcion/:id", getSuscripcion);
router.post("/suscripcion", createSuscripcion);
router.delete("/suscripciones/:id", deleteSuscripcion);
router.put("/suscripcionActualizar/:id", updateSuscripcion);
router.put("/suscripcion/tipo/:id", updateTipoSuscripcion);
router.get("/suscripciones/costoanual/:id", calcularCostoAnual);
router.get("/ahorroanual/:id", ahorroAnual);
export default router;
