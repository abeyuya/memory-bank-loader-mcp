# systemPatterns.md

## Architecture

-   **MCP Server:** The core component is an MCP (Model Context Protocol) server implemented in TypeScript using the `@modelcontextprotocol/sdk`.
-   **Stdio Transport:** Communication with the client (e.g., Cline) happens via standard input/output (stdio) using `StdioServerTransport`.
-   **Single Tool:** Currently provides one tool: `load-memory-bank`.

## Key Technical Decisions

-   **TypeScript:** Chosen for type safety and compatibility with the MCP SDK.
-   **Node.js:** The runtime environment for the server.
-   **Vitest:** Used for Test-Driven Development (TDD) to ensure functionality and allow for safe refactoring.
-   **Recursive File Reading:** Implemented using Node.js `fs/promises.readdir` with `withFileTypes: true` and a recursive helper function (`getAllFilePaths`).
-   **Custom Sorting Logic:** A specific sorting order is implemented:
    1.  Root directory files first.
    2.  Within the root, priority files (`projectbrief.md`, etc.) are ordered specifically.
    3.  Other root files are sorted alphabetically by relative path.
    4.  Subdirectory files follow, sorted alphabetically by relative path.
-   **Output Formatting:** Uses Markdown headers (`# {relativePath}`), 4-backtick code blocks (```` ``` ````), and `---` separators for clarity and robustness, especially for AI consumption.

## Component Relationships

-   `src/index.ts`: Main entry point, defines the MCP server, the `load-memory-bank` tool, the core `loadMemoryBank` function, and the `getAllFilePaths` helper.
-   `src/index.test.ts`: Contains Vitest unit tests for the `loadMemoryBank` function, covering various scenarios (empty dir, single file, multiple files, subdirs, empty files, priority sorting).
-   `package.json`: Defines dependencies (`@modelcontextprotocol/sdk`, `zod`), dev dependencies (`typescript`, `vitest`, `@types/node`), build/test scripts, and package metadata.
-   `tsconfig.json`: Configures the TypeScript compiler (targeting ES2022, Node16 module resolution).