# Quillopy MCP Server

A Node.js server implementing Model Context Protocol (MCP) for Quillopy document search operations.

## Overview

This MCP server allows AI assistants to search package documentation through the Quillopy API, retrieving relevant documentation for programming languages and libraries.

## Features

- Document search for programming packages and libraries
- Language-specific queries
- Namespace filtering
- Formatted document responses with semantic identifiers and links

## How to Use

Invoke the Quillopy tool directly in conversation by typing `@quillopy` or `@quillopy[package_name]`. You can then specify your query, programming language, and optionally a namespace to narrow the search. The tool will retrieve and display relevant documentation and links.

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

## Usage with Cursor

1. Navigate to Cursor Settings > features
2. Enable the MCP Servers option
3. Add new MCP server with:
   ```json
   {
     "name": "quillopy",
     "type": "command",
     "command": "node",
     "args": ["/path/to/quillopy-mcp/build/index.js"]
   }
   ```

## Usage with Continue.dev

1. Open your Continue.dev configuration file in either format:

   - YAML:
     - MacOS/Linux: `~/.continue/config.yaml`
     - Windows: `%USERPROFILE%\.continue\config.yaml`
   - JSON:
     - Same location as above, but named `config.json`

2. Add the configuration using either format:

   YAML format:

   ```yaml
   experimental:
     modelContextProtocolServers:
       - transport:
           type: stdio
           command: node
           args: ["/path/to/quillopy-mcp/build/index.js"]
   ```

   JSON format:

   ```json
   {
     "experimental": {
       "modelContextProtocolServers": [
         {
           "transport": {
             "type": "stdio",
             "command": "node",
             "args": ["/path/to/quillopy-mcp/build/index.js"]
           }
         }
       ]
     }
   }
   ```

3. Save the file - Continue will automatically refresh to apply the new configuration

## Development

- Source code is in the `src/` directory
- TypeScript configuration in `tsconfig.json`
- Built files are generated in the `build/` directory (not included in Git)
