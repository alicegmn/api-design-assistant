import type { Request, Response } from "express";
import {
	createDesign,
	generateDesign,
	getAllDesigns,
	getDesignById,
} from "../services/designs.service.js";

function getParam(value: string | string[]): string {
	return Array.isArray(value) ? value[0] : value;
}

export function listDesigns(_req: Request, res: Response) {
	return res.json(getAllDesigns());
}

export function getDesign(req: Request, res: Response) {
	const design = getDesignById(getParam(req.params.id));

	if (!design) {
		return res.status(404).json({ message: "Design not found" });
	}

	return res.json(design);
}

export function postDesign(req: Request, res: Response) {
	const { title, description } = req.body;

	if (!title || !description) {
		return res.status(400).json({
			message: "Title and description are required",
		});
	}

	const design = createDesign({ title, description });
	return res.status(201).json(design);
}

export async function postGenerateDesign(req: Request, res: Response) {
	const design = await generateDesign(getParam(req.params.id));

	if (!design) {
		return res.status(404).json({ message: "Design not found" });
	}

	return res.json(design);
}
