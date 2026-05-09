import { randomUUID } from "node:crypto";
import type { ApiDesign } from "../types/apiDesign.js";
import { runApiDesignAgent } from "../agents/runApiDesignAgent.js";

const designs: ApiDesign[] = [];

export function getAllDesigns(): ApiDesign[] {
	return designs;
}

export function getDesignById(id: string): ApiDesign | undefined {
	return designs.find((design) => design.id === id);
}

export function createDesign(input: {
	title: string;
	description: string;
}): ApiDesign {
	const now = new Date().toISOString();

	const design: ApiDesign = {
		id: randomUUID(),
		title: input.title,
		description: input.description,
		status: "draft",
		createdAt: now,
		updatedAt: now,
	};

	designs.push(design);

	return design;
}

export async function generateDesign(
	id: string
): Promise<ApiDesign | undefined> {
	const design = getDesignById(id);

	if (!design) {
		return undefined;
	}

	const result = await runApiDesignAgent(design.description);

	design.status = "generated";
	design.summary = result.summary;
	design.endpoints = result.endpoints;
	design.dataModel = result.dataModel;
	design.testCases = result.testCases;
	design.risks = result.risks;
	design.updatedAt = new Date().toISOString();

	return design;
}
