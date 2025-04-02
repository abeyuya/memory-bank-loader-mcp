# activeContext.md

## Current Focus

-   Resolving npm publish warning related to the `bin` field in `package.json`.

## Recent Changes

-   Modified `package.json` to rename the command in the `bin` field from `load` to `memory-bank-loader-mcp`. This resolves the `npm warn publish "bin[load]" script name was cleaned` warning.
-   Implemented the `loadMemoryBank` function in `src/index.ts` using TDD with Vitest.
-   The function now recursively reads files, sorts them (prioritizing root files, then specific priority files within the root, then alphabetically by relative path), and formats the output using Markdown headers, 4-backtick code blocks, and `---` separators.
-   Multiple iterations of TDD cycles were performed to refine the sorting logic and output format based on user feedback.
-   Added Vitest as a dev dependency and configured `npm test`.
-   Updated source code comments to English.
-   Committed the implementation and subsequent refinements to Git.
-   Created `README.md` based on project structure and functionality.
-   Refined `README.md` content based on user feedback and external examples.
-   Updated the `load-memory-bank` tool description in `src/index.ts` for clarity.
-   Updated `.gitignore` to exclude the `build/` directory and removed tracked build files from the index.
-   Committed README creation/updates and related changes to Git.

## Next Steps

-   Update `progress.md` to reflect the resolution of the npm warning.
-   Review the updated Memory Bank files for accuracy and completeness.
-   Consider any further development or refinement of the `load-memory-bank` tool or the project itself.

## Active Decisions & Considerations

-   **Output Format:** Decided on the 4-backtick Markdown code block format for robustness against content collision, suitable for AI consumption.
-   **Sorting Logic:** Implemented a multi-stage sorting logic: root-first, then priority-root, then alphabetical relative path. This complexity was driven by evolving requirements.
-   **TDD Approach:** Consistently used TDD, which helped manage the frequent changes in requirements for sorting and formatting.
-   **README Content:** Included sections for Features, Installation, Usage (Server & Tool), Development, and License, referencing the GitHub MCP Server README as inspiration.

## Learnings & Project Insights

-   The exact requirements for sorting and formatting context for AI can be nuanced and may evolve. TDD is valuable for managing this.
-   Using 4 backticks for code fences is a good practice when the content itself might contain code fences.
-   Maintaining `.gitignore` correctly is important to avoid committing build artifacts.
