import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const QUILLOPY_API_BASE = "http://localhost:8000/v1";

// Create server instance
const server = new McpServer({
  name: "quillopy",
  version: "1.0.0",
});

interface Document {
  link: string;
  content: string;
  semantic_identifier: string;
}

interface RequestBody {
  query: string;
  package_name: string;
  language: string;
  namespace?: string;
}

// Function to call Quillopy's API
async function makeQuillopyRequest({
  query,
  package_name,
  language,
  namespace,
}: {
  query: string;
  package_name: string;
  language: string;
  namespace?: string;
}): Promise<Document[] | null> {
  // TODO headers with authentication

  try {
    const url = `${QUILLOPY_API_BASE}/document-search`;

    const requestBody: RequestBody = {
      query,
      package_name,
      language,
    };

    if (namespace) requestBody.namespace = namespace;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return (await response.json()) as Document[];
  } catch (error) {
    console.error("Error making Quillopy request: ", error);
    return null;
  }
}

// Format document
function formatDocument(document: Document): string {
  return [
    `Semantic Identifier: ${document.semantic_identifier}`,
    `Link: ${document.link}`,
    `Content: ${document.content}`,
  ].join("\n");
}

// Register tool
server.tool(
  "search-library-docs",
  "Search and retrieve relevant documentation for programming libraries and packages.",
  {
    query: z
      .string()
      .describe("The search query to find specific documentation"),
    package_name: z
      .string()
      .describe(
        "The name of the library or package to search documentation for"
      ),
    language: z
      .string()
      .describe(
        "The programming language of the package (e.g., python, javascript, java)"
      ),
    namespace: z
      .string()
      .optional()
      .describe(
        "Optional namespace or module within the package to narrow the search"
      ),
  },
  async ({ query, package_name, language, namespace }) => {
    const documents = await makeQuillopyRequest({
      query,
      package_name: package_name.toLowerCase(),
      language: language.toLowerCase(),
      namespace: namespace?.toLowerCase(),
    });

    if (!documents || documents.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No documentation found.",
          },
        ],
      };
    }

    // Use 10 first documents
    const formattedDocs = documents.slice(0, 10).map(formatDocument);

    return {
      content: [
        {
          type: "text",
          text: `Found the following relevant library documentation:\n\n${formattedDocs.join(
            "\n\n"
          )}\n\n`,
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
