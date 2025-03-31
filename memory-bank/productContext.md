# productContext.md

## Purpose

The `load-memory-bank` tool exists to consolidate project documentation files from a specified "memory bank" directory into a single, structured string. This consolidated context is primarily intended to be fed to AI models like Cline, ensuring they have a consistent and ordered understanding of the project's state and history.

## Problem Solved

-   **Context Fragmentation:** Prevents AI models from having to read numerous individual files, which can be inefficient and lead to inconsistent context understanding.
-   **Information Overload:** Provides a single, manageable input containing potentially large amounts of documentation.
-   **Context Ordering:** Enforces a specific, logical order for critical documentation files (like `projectbrief.md`, `productContext.md`, etc.) followed by other files, ensuring the AI processes information in the intended sequence.
-   **Standardized Format:** Delivers context in a predictable Markdown-based format that AI models can generally parse and understand effectively, while mitigating potential content collisions using fenced code blocks.

## How it Should Work

The tool should recursively scan the target directory, identify all files, sort them according to the defined priority and alphabetical rules (root-first, then priority-root, then alpha-root, then alpha-subdir), read their content, and format them into a single string using Markdown headers, 4-backtick code blocks, and `---` separators.

## User Experience Goals

-   **For AI:** Seamless context ingestion. The AI receives a well-structured string containing all necessary project information in the correct, prioritized order.
-   **For Developer:** Simple invocation by providing the path to the memory bank directory. The tool handles the complexity of reading, sorting, and formatting.