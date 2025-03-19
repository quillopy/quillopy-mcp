import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const QUILLOPY_API_BASE = "https://quillopy.fly.dev/v1";
const VERSION = "1.0.0";

const server = new McpServer({
  name: "quillopy",
  version: VERSION,
});

interface ApiResponse {
  text: string;
}

interface RequestBody {
  query: string;
  package_name?: string;
  common_name?: string;
  language?: string;
  version: string;
}

async function makeQuillopyRequest({
  query,
  package_name,
  common_name,
  language,
}: {
  query: string;
  package_name?: string;
  common_name?: string;
  language?: string;
}): Promise<ApiResponse | null> {
  try {
    const url = `${QUILLOPY_API_BASE}/document-search`;

    const requestBody: RequestBody = {
      query,
      version: VERSION,
    };

    if (package_name) requestBody.package_name = package_name;
    if (common_name) requestBody.common_name = common_name;
    if (language) requestBody.language = language;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as ApiResponse;
  } catch (error) {
    console.error("Error making Quillopy request: ", error);
    return null;
  }
}

server.tool(
  "quillopy_search",
  "This tool searches and retrieves documentation for programming languages, libraries, frameworks, and technical platforms. Use @quillopy[name] for quick searches where 'name' is the common name of the technology (e.g., @quillopy[react], @quillopy[pandas]). For more specific queries, use @quillopy with detailed parameters to specify language, package name, or other attributes. Access comprehensive documentation to answer code questions, understand API usage, explore features, or find implementation examples.",
  {
    query: z
      .string()
      .describe("The search query to find specific documentation"),
    package_name: z
      .string()
      .optional()
      .describe(
        "The name used when installing the package via package managers (e.g., 'react', 'numpy', 'aws-sdk'). Optional if querying a technology that's not a specific package."
      ),
    common_name: z
      .string()
      .optional()
      .describe(
        "The name commonly used when referring to this technology, framework, or library (e.g., 'react', 'numpy', 'aws')"
      ),
    language: z
      .string()
      .optional()
      .describe(
        "The programming language associated with this query (e.g., 'python', 'javascript', 'java'). Optional for cross-language technologies or general concepts."
      ),
  },
  async ({ query, package_name, common_name, language }) => {
    const response = await makeQuillopyRequest({
      query,
      package_name: package_name?.toLowerCase(),
      language: language?.toLowerCase(),
      common_name: common_name?.toLowerCase(),
    });

    if (!response) {
      return {
        content: [
          {
            type: "text",
            text: "Error: Unable to retrieve documentation.",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: response.text,
        },
      ],
    };
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
