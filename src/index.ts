import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "memory-bank-loader",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

async function loadMemoryBank(args: { memoryBankDirectoryPath: string }) {
  return {
    content: [
      {
        type: "text" as const,
        text: "todo",
      },
    ],
  };
}

server.tool(
  "load-memory-bank",
  "Load memory bank",
  {
    memoryBankDirectoryPath: z
      .string()
      .describe("Path to the memory bank directory"),
  },
  loadMemoryBank
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Memory Bank Loader MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
