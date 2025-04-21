#!/usr/bin/env node

import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { makeQuillopyRequest, makeChatWithCodeRequest } from "./lib/api.js";

const VERSION = "0.1.0";

const server = new McpServer({
  name: "quillopy",
  version: VERSION,
});

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

      // Check if response exists
      if (!response) {
        throw new Error(
          "Failed to retrieve documentation: No response received"
        );
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
      let errorMessage = "An error occurred while retrieving documentation";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Error in Quillopy documentation search:", errorMessage);

      return {
        content: [
          {
            type: "text",
            text: `Documentation search error: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

server.tool(
  "quillopy_chat_with_code",
  "This tool enables chat with code in a GitHub repository. Only use when explicitly requested by the user. Inform the user that responses may take up to 1 minute to generate.",
  {
    query: z.string().describe("The question about the GitHub repository code"),
    githubRepoUrl: z.string().describe("The URL of the GitHub repository"),
  },
  async ({ query, githubRepoUrl }) => {
    try {
      const response = await makeChatWithCodeRequest({
        query,
        githubRepoUrl,
      });

      // Check if response exists
      if (!response) {
        throw new Error("Failed to chat with code: No response received");
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
      let errorMessage = "An error occurred while chatting with code";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Error in Quillopy code chat:", errorMessage);

      return {
        content: [
          {
            type: "text",
            text: `Code chat error: ${errorMessage}`,
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
