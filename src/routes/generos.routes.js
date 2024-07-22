import { Router } from "express";
import {
  createGenero,
  deleteGenero,
  getGeneros,
  getGenero,
  updateGenero,
} from "../controllers/generos.controllers.js";

const router = Router();

router.get("/Generos", getGeneros);
router.get("/Genero/:id", getGenero);
router.post("/Genero", createGenero);
router.put("/Genero/:id", updateGenero);
router.delete("/Genero/:id", deleteGenero);

export default router;
