import type { Endpoint } from "../types/apiDesign.js";

export type AgentResult = {
	summary: string;
	endpoints: Endpoint[];
	dataModel: string;
	testCases: string[];
	risks: string[];
};

type DomainConfig = {
	resourceName: string;
	collectionPath: string;
	fields: string[];
};

function inferDomain(description: string): DomainConfig {
	const text = description.toLowerCase();

	if (text.includes("room") || text.includes("booking")) {
		return {
			resourceName: "Booking",
			collectionPath: "/bookings",
			fields: [
				"id",
				"roomId",
				"userId",
				"startTime",
				"endTime",
				"status",
				"createdAt",
			],
		};
	}

	if (text.includes("task") || text.includes("todo")) {
		return {
			resourceName: "Task",
			collectionPath: "/tasks",
			fields: ["id", "title", "description", "status", "dueDate", "createdAt"],
		};
	}

	if (text.includes("user") || text.includes("account")) {
		return {
			resourceName: "User",
			collectionPath: "/users",
			fields: ["id", "name", "email", "role", "createdAt"],
		};
	}

	return {
		resourceName: "Resource",
		collectionPath: "/resources",
		fields: ["id", "name", "createdAt", "updatedAt"],
	};
}

function buildEndpoints(config: DomainConfig): Endpoint[] {
	const singular = config.resourceName.toLowerCase();

	return [
		{
			method: "GET",
			path: config.collectionPath,
			purpose: `List ${config.resourceName.toLowerCase()} records`,
			responseExample: {
				items: [],
			},
		},
		{
			method: "POST",
			path: config.collectionPath,
			purpose: `Create a new ${singular}`,
			requestExample: Object.fromEntries(
				config.fields
					.filter(
						(field) =>
							!["id", "createdAt", "updatedAt", "status"].includes(field)
					)
					.map((field) => [field, `example-${field}`])
			),
			responseExample: {
				id: `${singular}-id`,
				status: "created",
			},
		},
		{
			method: "GET",
			path: `${config.collectionPath}/:id`,
			purpose: `Fetch one ${singular} by id`,
		},
		{
			method: "PATCH",
			path: `${config.collectionPath}/:id`,
			purpose: `Update an existing ${singular}`,
		},
		{
			method: "DELETE",
			path: `${config.collectionPath}/:id`,
			purpose: `Delete or cancel an existing ${singular}`,
		},
	];
}

function buildTestCases(config: DomainConfig): string[] {
	const singular = config.resourceName.toLowerCase();

	return [
		`Should create a ${singular} with valid input`,
		"Should reject missing required fields",
		"Should return 404 when the resource is not found",
		"Should prevent unauthorized access",
		"Should return consistent error responses",
	];
}

function buildRisks(config: DomainConfig): string[] {
	const risks = [
		"Input validation needs to be clearly defined",
		"Authentication and authorization rules should be specified",
		"Error responses should be consistent across endpoints",
		"Pagination may be needed for list endpoints",
	];

	if (config.resourceName === "Booking") {
		risks.push(
			"Overlapping bookings and timezone handling need careful validation"
		);
	}

	return risks;
}

export async function runApiDesignAgent(
	description: string
): Promise<AgentResult> {
	const trimmedDescription = description.trim();
	const domain = inferDomain(trimmedDescription);

	return {
		summary: `Suggested REST API design for: "${trimmedDescription}"`,
		endpoints: buildEndpoints(domain),
		dataModel: `${domain.resourceName}: ${domain.fields.join(", ")}`,
		testCases: buildTestCases(domain),
		risks: buildRisks(domain),
	};
}
