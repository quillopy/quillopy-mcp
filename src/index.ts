import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const QUILLOPY_API_BASE = "https://api.quillopy.com/v1";
const VERSION = "0.1.0";
const QUILLOPY_API_KEY = process.env.QUILLOPY_API_KEY;

const server = new McpServer({
  name: "quillopy",
  version: VERSION,
});

interface ApiResponse {
  response: string;
}

interface RequestBody {
  query: string;
  documentation_name: string;
  installation_name?: string;
  language?: string;
}

async function makeQuillopyRequest({
  query,
  documentation_name,
  installation_name,
  language,
}: RequestBody): Promise<ApiResponse | null> {
  // Check if the QUILLOPY_API_KEY environment variable is set
  if (!QUILLOPY_API_KEY) {
    throw new Error(
      "QUILLOPY_API_KEY environment variable not set. Please set this variable to use the Quillopy API."
    );
  }

  try {
    const url = `${QUILLOPY_API_BASE}/document-search`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

    const requestBody: RequestBody = {
      query,
      documentation_name,
    };

    if (installation_name) {
      requestBody.installation_name = installation_name;
    }

    if (language) {
      requestBody.language = language;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${QUILLOPY_API_KEY}`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Request timed out after 10 seconds");
    } else {
      console.error("Error making Quillopy request: ", error);
    }
    return null;
  }
}

server.tool(
  "quillopy_search",
  "This MCP searches and fetches documentation for programming libraries, packages, and frameworks. When a user types @quillopy or @quillopy[documentation_name], they are requesting to use this tool to access programming documentation.",
  {
    query: z
      .string()
      .describe("The search query to find specific documentation"),
    documentation_name: z
      .string()
      .describe(
        "Common name to refer to the package/framework to search, e.g. sklearn"
      ),
    installation_name: z
      .string()
      .optional()
      .describe(
        "Name used to install the package/framework, only provide when relevant to improve search accuracy. E.g. scikit-learn for `pip install scikit-learn`"
      ),
    language: z
      .string()
      .optional()
      .describe(
        "The programming language of the package/framework (e.g., python, javascript, java), only provide when relevant to improve search accuracy"
      ),
  },
  async ({ query, documentation_name, installation_name, language }) => {
    try {
      const response = await makeQuillopyRequest({
        query,
        documentation_name: documentation_name.toLowerCase(),
        installation_name: installation_name?.toLowerCase(),
        language: language?.toLowerCase(),
      });

      if (!response) {
        return {
          content: [
            {
              type: "text",
              text: "Unable to retrieve documentation. The service might be unavailable or experiencing issues. Please check your internet connection and try again later.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: response.response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${
              error instanceof Error ? error.message : "Unknown error occurred"
            }`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Quillopy MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
