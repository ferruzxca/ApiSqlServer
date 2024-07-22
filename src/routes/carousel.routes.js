import { Router } from "express";
import {
 getUrlImg
} from "../controllers/carousel.controllers.js";

const router = Router();

router.get("/urlimag",getUrlImg, get);
export default router;