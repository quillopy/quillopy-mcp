# Quillopy MCP Server

A Node.js server implementing Model Context Protocol (MCP) for [Quillopy](https://quillopy.com) document search operations.

## Overview

This MCP server allows AI assistants to search package documentation through the Quillopy API, retrieving relevant documentation for programming languages and libraries.

## How to Use

Invoke the Quillopy tool directly in conversation by typing `@quillopy` or `@quillopy[documentation_name]`. Provide your search query and documentation name. You can optionally specify the programming language and installation name (if different from the documentation name) to improve search accuracy. The tool will retrieve and display relevant documentation with links.

#### API Key Requirement

**Important:** You need a Quillopy API key to use this MCP server. Visit https://quillopy.com to sign up and obtain your API key.

You can also visit the Quillopy homepage to:

- Check the list of currently indexed documentation
- Request new documentation to be indexed for your projects or favorite libraries

## Installing via Smithery (recommended)

Smithery provides the easiest way to install and configure the Quillopy MCP across various AI assistant platforms.

```
# Claude
npx -y @smithery/cli@latest install @quillopy/quillopy-mcp --client claude

# Cursor
npx -y @smithery/cli@latest install @quillopy/quillopy-mcp --client cursor

# Windsurf
npx -y @smithery/cli@latest install @quillopy/quillopy-mcp --client windsurf
```

For more information and additional integration options, visit https://smithery.ai/server/@quillopy/quillopy-mcp

## Manual installation

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "quillopy": {
      "command": "npx",
      "args": ["-y", "@quillopy/mcp"],
      "env": {
        "QUILLOPY_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

### Usage with Cursor

1. Navigate to Cursor Settings > features
2. Enable the MCP Servers option
3. Add new MCP server with:
   ```json
   {
     "name": "quillopy",
     "type": "command",
     "command": "npx",
     "args": ["-y", "@quillopy/mcp"],
     "env": {
       "QUILLOPY_API_KEY": "<your-api-key>"
     }
   }
   ```

### Usage with Continue.dev

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
           args: ["-y", "@quillopy/mcp"]
           env: { "QUILLOPY_API_KEY": "<your-api-key>" }
   ```

   JSON format:

   ```json
   {
     "experimental": {
       "modelContextProtocolServers": [
         {
           "transport": {
             "type": "stdio",
             "command": "npx",
             "args": ["-y", "@quillopy/mcp"],
             "env": { "QUILLOPY_API_KEY": "<your-api-key>" }
           }
         }
       ]
     }
   }
   ```

3. Save the file - Continue will automatically refresh to apply the new configuration. If the changes don't take effect immediately, try restarting your IDE.
