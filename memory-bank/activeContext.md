# activeContext.md

## Current Focus

-   Initializing and populating the core Memory Bank files based on the project's current state and the implementation of the `load-memory-bank` tool.

## Recent Changes

-   Implemented the `loadMemoryBank` function in `src/index.ts` using TDD with Vitest.
-   The function now recursively reads files, sorts them (prioritizing root files, then specific priority files within the root, then alphabetically by relative path), and formats the output using Markdown headers, 4-backtick code blocks, and `---` separators.
-   Multiple iterations of TDD cycles were performed to refine the sorting logic and output format based on user feedback.
-   Added Vitest as a dev dependency and configured `npm test`.
-   Updated source code comments to English.
-   Committed the implementation and subsequent refinements to Git.

## Next Steps

-   Populate the remaining Memory Bank core file (`progress.md`).
-   Review the populated Memory Bank files for accuracy and completeness.
-   Consider any further development or refinement of the `load-memory-bank` tool or the project itself.

## Active Decisions & Considerations

-   **Output Format:** Decided on the 4-backtick Markdown code block format for robustness against content collision, suitable for AI consumption.
-   **Sorting Logic:** Implemented a multi-stage sorting logic: root-first, then priority-root, then alphabetical relative path. This complexity was driven by evolving requirements.
-   **TDD Approach:** Consistently used TDD, which helped manage the frequent changes in requirements for sorting and formatting.

## Learnings & Project Insights

-   The exact requirements for sorting and formatting context for AI can be nuanced and may evolve. TDD is valuable for managing this.
-   Using 4 backticks for code fences is a good practice when the content itself might contain code fences.