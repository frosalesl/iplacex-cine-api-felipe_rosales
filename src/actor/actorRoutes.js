import express from "express";
import controller from "./controller.js";

const router = express.Router();

router.post("/actor", controller.handleInsertActorRequest);
router.get("/actores", controller.handleGetActoresRequest);
router.get("/actor/:id", controller.handleGetActorByIdRequest);
router.get("/actores/pelicula/:pelicula", controller.handleGetActoresByPeliculaIdRequest);

export default router;