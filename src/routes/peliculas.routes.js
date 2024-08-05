import { Router } from "express";
import {
  createPelicula,
  deletePelicula,
  getPelicula,
  getPeliculaMasVista,
  getPeliculas,
  updatePelicula,
  getGeneroMasVisto,
  getTop10MV,
  getGeneroMenosVisto,
  getDiasMasVistos,
  getHistorialCliente,
  getTop10MenosV,

} from "../controllers/peliculas.controllers.js";

const router = Router();

router.get("/peliculas", getPeliculas);
router.get("/peliculas/:id", getPelicula);
router.post("/peliculas", createPelicula);
router.put("/peliculas/:id", updatePelicula);
router.delete("/pelicula/:id", deletePelicula);

//Consultas Profesor
router.get("/pelicula/MasVista", getPeliculaMasVista);
router.get("/genero/MasVisto", getGeneroMasVisto);
router.get("/genero/MenosVisto", getGeneroMenosVisto);
router.get("/dias/MasVistos", getDiasMasVistos);
router.get("/historial/cliente/:id", getHistorialCliente);

router.get("/top10MV", getTop10MV);
router.get("/top10MenosV", getTop10MenosV);


export default router;
