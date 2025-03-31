import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Create server instance
const server = new McpServer({
  name: "memory-bank-loader",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Helper function to recursively get all file paths
async function getAllFilePaths(dirPath: string): Promise<string[]> {
  let filePaths: string[] = [];
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });
    for (const dirent of dirents) {
      const fullPath = path.join(dirPath, dirent.name);
      if (dirent.isDirectory()) {
        // If it's a directory, recurse
        filePaths = filePaths.concat(await getAllFilePaths(fullPath));
      } else if (dirent.isFile()) {
        // If it's a file, add it to the list
        filePaths.push(fullPath);
      }
    }
  } catch (error: any) {
    // Ignore errors like directory not found, return empty list
    if (error.code !== "ENOENT") {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }
  return filePaths;
}

export async function loadMemoryBank(args: {
  memoryBankDirectoryPath: string;
}) {
  let combinedText = "";
  try {
    // 1. Recursively get all file paths
    const allPaths = await getAllFilePaths(args.memoryBankDirectoryPath);

    // 2. Sort file paths alphabetically
    allPaths.sort((a, b) => a.localeCompare(b));

    // 3. Read files and prepare sections
    const fileSections: string[] = [];
    for (const filePath of allPaths) {
      const relativePath = path.relative(
        args.memoryBankDirectoryPath,
        filePath
      );
      const fileContent = await fs.readFile(filePath, "utf-8");
      // Format section: Header + optional content with double newline
      const sectionHeader = `# ${relativePath}`;
      const section = fileContent
        ? `${sectionHeader}\n\n${fileContent}`
        : sectionHeader;
      fileSections.push(section);
    }

    // 4. Join sections with "\n\n---\n\n", avoiding trailing newline
    combinedText = fileSections.join("\n\n---\n\n");
  } catch (error: any) {
    // ENOENT should be handled within getAllFilePaths, but catch other errors just in case
    console.error("Error in loadMemoryBank:", error);
    // Return empty string on error (as per test specification)
  }

  return {
    content: [
      {
        type: "text" as const,
        text: combinedText, // Return the combined content
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
