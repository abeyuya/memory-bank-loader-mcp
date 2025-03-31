# techContext.md

## Technologies Used

-   **Language:** TypeScript (configured via `tsconfig.json`)
-   **Runtime:** Node.js
-   **Package Manager:** npm (managed via `package.json` and `package-lock.json`)
-   **MCP Framework:** `@modelcontextprotocol/sdk`
-   **Schema Validation:** `zod` (used for defining the input schema of the `load-memory-bank` tool)
-   **Testing Framework:** `vitest`

## Development Setup

-   **Build:** Run `npm run build` (executes `tsc && chmod 755 build/index.js`) to compile TypeScript to JavaScript in the `build/` directory and make the output executable.
-   **Testing:** Run `npm test` (executes `vitest run`) to run the unit tests defined in `src/index.test.ts`.
-   **Running the Server:** The compiled server can be run directly using Node.js (e.g., `node build/index.js`) or potentially via the `bin` entry in `package.json` if installed globally or linked (e.g., `load`).

## Technical Constraints

-   Requires Node.js environment with npm installed.
-   Relies on the specific file system structure and naming conventions expected by the sorting logic (priority files in the root).
-   Output format is tailored for AI consumption, potentially less ideal for direct human reading compared to simpler concatenation, but more robust against content collision.

## Dependencies

-   `@modelcontextprotocol/sdk`: Core library for creating MCP servers and tools.
-   `zod`: Used for defining and validating the input arguments schema for the tool.
-   `typescript`, `@types/node`, `vitest`: Development dependencies for compilation, type definitions, and testing.