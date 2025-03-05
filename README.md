# Quillopy MCP Server

A Node.js server implementing Model Context Protocol (MCP) for Quillopy document search operations.

## Overview

This MCP server allows AI assistants to search package documentation through the Quillopy API, retrieving relevant documentation for programming languages and libraries.

## Features

- Document search for programming packages and libraries
- Language-specific queries
- Namespace filtering
- Formatted document responses with semantic identifiers and links

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/quillopy/quillopy-mcp.git
   cd quillopy-mcp
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "quillopy": {
      "command": "node",
      "args": ["/path/to/quillopy-mcp/build/index.js"]
    }
  }
}
```

## Development

- Source code is in the `src/` directory
- TypeScript configuration in `tsconfig.json`
- Built files are generated in the `build/` directory (not included in Git)
