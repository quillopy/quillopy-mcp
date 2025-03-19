import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const QUILLOPY_API_BASE = "https://quillopy.fly.dev/v1";

const server = new McpServer({
  name: "quillopy",
  version: "1.0.0",
});

interface Document {
  link: string;
  content: string;
  semantic_identifier: string;
}

interface ApiResponse {
  instructions: string[];
  documents: Document[];
}

interface RequestBody {
  query: string;
  package_name?: string;
  common_name?: string;
  language?: string;
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

function formatDocument(document: Document): string {
  return [
    `Semantic Identifier: ${document.semantic_identifier}`,
    `Link: ${document.link}`,
    `Content: ${document.content}`,
  ].join("\n");
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

    if (!response || !response.documents || response.documents.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "No documentation found.",
          },
        ],
      };
    }

    const formattedDocs = response.documents.slice(0, 10).map(formatDocument);

    let instructionsText = "";
    if (response.instructions && response.instructions.length > 0) {
      instructionsText =
        "Instructions:\n" +
        response.instructions
          .map((instruction) => `- ${instruction}`)
          .join("\n") +
        "\n\n";
    }

    return {
      content: [
        {
          type: "text",
          text: `Found the following relevant library documentation:\n\n${formattedDocs.join(
            "\n\n"
          )}\n\n${instructionsText}`,
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
