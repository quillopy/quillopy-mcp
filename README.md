<h3 align="center">
  <a href="https://quillopy.com">🏠 Home page</a>
  <a href="https://discord.gg/HuyzbYRzwu">💬 Discord</a>
  <a href="https://quillopy.com/documentation/all">📚 Check docs</a>
  <a href="https://quillopy.com/add">➕ Add docs</a>
</h4>

# Quillopy MCP — Real Docs. Real Code. Zero Hallucination.

<div align="center">
<img src="assets/demo.gif">
</div>

## 🧠 Your LLM is smart. But it can’t see the latest docs.

### ❌ Without Quillopy:

- You get code that references functions that were deprecated two years ago
- You spend time debugging things that were never supposed to work
- Answers are vague, outdated, or flat-out wrong

### ✅ With Quillopy:

Quillopy pipes accurate documentation directly into your code assistant’s context — so it generates **real**, **working**, **up-to-date** code.

No manual uploads. No stale info. No wasted time.

---

### How it works:

1. Ask your question in Cursor (or any assistant that supports the MCPs)
2. Behind the scenes, Quillopy injects the right docs — automatically
3. You get a code completion that actually runs

To explicitly activate Quillopy, just add `@quillopy` to your question — or use `@quillopy[package_name]` to specify exactly what library to pull in.

No hacks. No guessing. Just code that *works*.

---

### Try it with questions like:

> “How to code an agent browsing the web to fetch the latest news using browser-use? @quillopy[browser-use]”\
> “How do I store and retrieve JSON data in Supabase? @quillopy”\
> “How do I secure routes with the newest NextAuth? @quillopy”

---

### Why devs are switching to Quillopy:

✅ Zero setup — no uploads or config\
✅ 600+ libraries pre-indexed and updated in real time\
✅ Optimized for minimal context usage (perfect for LLMs)\
✅ Works with any library, any version, anytime


## 🛠️ Getting Started

### 1. Create an API key

**Important:** You need a Quillopy API key to use this MCP server. Visit https://quillopy.com to sign up and obtain your API key (free).

### 2. Install the Quillopy MCP

#### Option 1: Use Smithery (Recommended)

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

#### Option 2: Manual Setup

##### Cursor

1. Navigate to `Settings` -> `Cursor Settings` -> `MCP` -> `+ Add new global MCP server`
2. Copy paste the following config in `~/.cursor/.mcp.json`
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
3. Replace `<your-api-key>` with your actual API key

Check the [Cursor MCP docs](https://docs.cursor.com/context/model-context-protocol) for more infos.

##### Windsurf
Add this to your Windsurf MCP config file. Check the [Windsurf MCP docs](https://docs.windsurf.com/windsurf/mcp) for more infos.
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

##### Claude Desktop

Add this to your `claude_desktop_config.json`.

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

##### Continue.dev

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

Check [Continue MCP docs](https://docs.continue.dev/customize/deep-dives/mcp) for more infos.
