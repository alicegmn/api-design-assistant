import type { Endpoint } from "../types/apiDesign.js";

export type AgentResult = {
	summary: string;
	endpoints: Endpoint[];
	dataModel: string;
	testCases: string[];
	risks: string[];
};

export async function runApiDesignAgent(
	description: string
): Promise<AgentResult> {
	const trimmedDescription = description.trim();

	return {
		summary: `API design suggestion based on: "${trimmedDescription}"`,
		endpoints: [
			{
				method: "GET",
				path: "/resources",
				purpose: "List resources",
				responseExample: { items: [] },
			},
			{
				method: "POST",
				path: "/resources",
				purpose: "Create a resource",
				requestExample: { name: "Example" },
				responseExample: { id: "resource-id", name: "Example" },
			},
			{
				method: "GET",
				path: "/resources/:id",
				purpose: "Fetch one resource by id",
			},
		],
		dataModel: "Resource: id, name, createdAt, updatedAt",
		testCases: [
			"Should create a resource with valid input",
			"Should reject missing required fields",
			"Should return 404 when resource is not found",
		],
		risks: [
			"Input validation needs to be defined",
			"Authentication and authorization are not specified",
			"Error responses should be consistent",
		],
	};
}
