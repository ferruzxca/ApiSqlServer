import { Router } from "express";
import {
  createSuscripcion,
  deleteSuscripcion,
  getSuscripciones,
  getSuscripcion,
  updateSuscripcion,
} from "../controllers/suscripciones.controllers.js";

const router = Router();

router.get("/Suscripciones", getSuscripciones);
router.get("/Suscripcion/:id", getSuscripcion);
router.post("/Suscripciones", createSuscripcion);
router.put("/Suscripciones/:id", updateSuscripcion);
router.delete("/Suscripciones/:id", deleteSuscripcion);

export default router;
