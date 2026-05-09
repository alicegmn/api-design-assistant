import { Router } from "express";
import {
	getDesign,
	listDesigns,
	postDesign,
	postGenerateDesign,
} from "../controllers/designs.controller.js";

export const designsRouter = Router();

designsRouter.get("/", listDesigns);
designsRouter.post("/", postDesign);
designsRouter.get("/:id", getDesign);
designsRouter.post("/:id/generate", postGenerateDesign);
