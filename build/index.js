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
async function getAllFilePaths(dirPath) {
    let filePaths = [];
    try {
        const dirents = await fs.readdir(dirPath, { withFileTypes: true });
        for (const dirent of dirents) {
            const fullPath = path.join(dirPath, dirent.name);
            if (dirent.isDirectory()) {
                // If it's a directory, recurse
                filePaths = filePaths.concat(await getAllFilePaths(fullPath));
            }
            else if (dirent.isFile()) {
                // If it's a file, add it to the list
                filePaths.push(fullPath);
            }
        }
    }
    catch (error) {
        // Ignore errors like directory not found, return empty list
        if (error.code !== "ENOENT") {
            console.error(`Error reading directory ${dirPath}:`, error);
        }
    }
    return filePaths;
}
export async function loadMemoryBank(args) {
    let combinedText = "";
    try {
        // 1. Recursively get all file paths
        const allPaths = await getAllFilePaths(args.memoryBankDirectoryFullPath);
        // 2. Sort file paths: prioritize specific files, then alphabetically
        const priorityOrder = [
            "projectbrief.md",
            "productContext.md",
            "systemPatterns.md",
            "techContext.md",
            "activeContext.md",
            "progress.md",
        ];
        allPaths.sort((a, b) => {
            const isARoot = path.dirname(a) === args.memoryBankDirectoryFullPath;
            const isBRoot = path.dirname(b) === args.memoryBankDirectoryFullPath;
            // 1. Root files come before subdirectory files
            if (isARoot && !isBRoot)
                return -1;
            if (!isARoot && isBRoot)
                return 1;
            // If both are root OR both are subdirectories:
            const baseA = path.basename(a);
            const baseB = path.basename(b);
            // 2. Apply priority sort ONLY if both are root files
            if (isARoot && isBRoot) {
                const indexA = priorityOrder.indexOf(baseA);
                const indexB = priorityOrder.indexOf(baseB);
                if (indexA !== -1 && indexB !== -1)
                    return indexA - indexB; // Both priority root
                if (indexA !== -1)
                    return -1; // Only A priority root
                if (indexB !== -1)
                    return 1; // Only B priority root
                // Fall through if neither is priority root
            }
            // 3. Sort alphabetically by relative path otherwise
            const relA = path.relative(args.memoryBankDirectoryFullPath, a);
            const relB = path.relative(args.memoryBankDirectoryFullPath, b);
            return relA.localeCompare(relB);
        });
        // 3. Read files and prepare sections
        const fileSections = [];
        for (const filePath of allPaths) {
            const relativePath = path.relative(args.memoryBankDirectoryFullPath, filePath);
            const fileContent = await fs.readFile(filePath, "utf-8");
            // Format section: Header + Code block (even if empty)
            // Add newline before closing backticks only if content is not empty
            const section = `# ${relativePath}\n\n\`\`\`\`\n${fileContent}${fileContent ? "\n" : ""}\`\`\`\``;
            fileSections.push(section);
        }
        // 4. Join sections with "\n\n---\n\n", avoiding trailing newline
        combinedText = fileSections.join("\n\n---\n\n");
    }
    catch (error) {
        // ENOENT should be handled within getAllFilePaths, but catch other errors just in case
        console.error("Error in loadMemoryBank:", error);
        // Return empty string on error (as per test specification)
    }
    return {
        content: [
            {
                type: "text",
                text: combinedText,
            },
        ],
    };
}
server.tool("load-memory-bank", "Load memory bank", {
    memoryBankDirectoryFullPath: z
        .string()
        .describe("Full path to the memory bank directory"),
}, loadMemoryBank);
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Memory Bank Loader MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
