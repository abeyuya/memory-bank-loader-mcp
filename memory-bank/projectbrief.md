# projectbrief.md

## Core Goal

To create an MCP server tool named `load-memory-bank`.

## Core Functionality

-   Accepts a directory path (`memoryBankDirectoryPath`) as input.
-   Recursively reads all files within the specified directory.
-   Sorts the found files based on the following rules:
    1.  Files directly within the `memoryBankDirectoryPath` come first.
    2.  Among root files, a specific priority list (`projectbrief.md`, `productContext.md`, etc.) determines the order.
    3.  Non-priority root files are sorted alphabetically by relative path after the priority files.
    4.  Files within subdirectories come after all root files.
    5.  Files within subdirectories (and subdirectories themselves relative to each other) are sorted alphabetically by their relative path.
-   Combines the content of the sorted files into a single string.
-   Formats the output with:
    -   A Markdown header (`# {relativePath}`) for each file.
    -   The file content enclosed in a 4-backtick Markdown code block (```` ``` ````). Empty files have an empty code block.
    -   Sections separated by `\n\n---\n\n`.
    -   No trailing separator or newline after the last file section.
-   Returns the combined string within the standard MCP tool output structure.