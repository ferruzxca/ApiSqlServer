import { Router } from "express";
import {
  createPelicula,
  deletePelicula,
  getPelicula,
  getPeliculaMasVista,
  getPeliculas,
  updatePelicula,
  getGeneroMasVisto,
  getTop10PeliculasMasVistas,
  getTop10PeliculasMenosVistas,
  getGeneroMenosVisto,
  getDiasMasVistos,
  getHistorialCliente,

} from "../controllers/peliculas.controllers.js";

const router = Router();

router.get("/peliculas", getPeliculas);
router.get("/peliculas/:id", getPelicula);
router.post("/peliculas", createPelicula);
router.put("/peliculas/:id", updatePelicula);
router.delete("/peliculas/:id", deletePelicula);

//Consultas Profesor
router.get("/pelicula/MasVista", getPeliculaMasVista);
router.get("/peliculas/Top10peliculasMasVistas", getTop10PeliculasMasVistas);
router.get("/genero/MasVisto", getGeneroMasVisto);
router.get("/peliculas/Top10PeliculasMenosVistas", getTop10PeliculasMenosVistas);
router.get("/genero/MenosVisto", getGeneroMenosVisto);
router.get("/dias/MasVistos", getDiasMasVistos);
router.get("/historial/cliente/:id", getHistorialCliente);

export default router;
