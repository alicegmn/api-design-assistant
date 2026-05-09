export type Endpoint = {
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	path: string;
	purpose: string;
	requestExample?: Record<string, unknown>;
	responseExample?: Record<string, unknown>;
};

export type ApiDesign = {
	id: string;
	title: string;
	description: string;
	status: "draft" | "generated";
	endpoints?: Endpoint[];
	dataModel?: string;
	testCases?: string[];
	risks?: string[];
	summary?: string;
	createdAt: string;
	updatedAt: string;
};
