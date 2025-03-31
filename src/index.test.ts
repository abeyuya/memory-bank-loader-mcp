import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";
import { loadMemoryBank } from "./index.js";

describe("loadMemoryBank", () => {
  let tempDirPath: string;

  beforeEach(async () => {
    tempDirPath = await fs.mkdtemp(path.join(tmpdir(), "memory-bank-test-"));
  });

  afterEach(async () => {
    await fs.rm(tempDirPath, { recursive: true, force: true });
  });

  it("should return empty content for an empty directory", async () => {
    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: "" }]);
  });

  it("should return content of a single file in the directory", async () => {
    const filePath = path.join(tempDirPath, "test.txt");
    const fileContent = "Hello from test file!";
    await fs.writeFile(filePath, fileContent);

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    const relativePath = path.relative(tempDirPath, filePath);
    const expectedText = `# ${relativePath}

${fileContent}`;
    expect(result.content).toEqual([{ type: "text", text: expectedText }]);
  });

  it("should prioritize specific files then sort alphabetically", async () => {
    // Non-priority files
    const file1Path = path.join(tempDirPath, "file1.txt");
    const file1Content = "Content from file 1.";
    await fs.writeFile(file1Path, file1Content);
    const file2Path = path.join(tempDirPath, "file2.txt");
    const file2Content = "Content from file 2.";
    await fs.writeFile(file2Path, file2Content);

    // Priority files (out of order)
    const techContextPath = path.join(tempDirPath, "techContext.md");
    const techContextContent = "Tech context content.";
    await fs.writeFile(techContextPath, techContextContent);
    const projectBriefPath = path.join(tempDirPath, "projectbrief.md");
    const projectBriefContent = "Project brief content.";
    await fs.writeFile(projectBriefPath, projectBriefContent);

    const relPathFile1 = path.relative(tempDirPath, file1Path);
    const relPathFile2 = path.relative(tempDirPath, file2Path);
    const relPathTech = path.relative(tempDirPath, techContextPath);
    const relPathBrief = path.relative(tempDirPath, projectBriefPath);

    // Expected order: projectbrief.md -> techContext.md -> file1.txt -> file2.txt
    const expectedText = `# ${relPathBrief}

${projectBriefContent}

---

# ${relPathTech}

${techContextContent}

---

# ${relPathFile1}

${file1Content}

---

# ${relPathFile2}

${file2Content}`;

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: expectedText }]);
  });

  it("should prioritize specific files then sort others alphabetically, including subdirectories", async () => {
    // Non-priority files
    const rootFilePath = path.join(tempDirPath, "zzz_root.txt"); // Ensure alphabetical last among non-priority
    const rootFileContent = "Root file content.";
    await fs.writeFile(rootFilePath, rootFileContent);
    const subDirPath = path.join(tempDirPath, "subdir");
    await fs.mkdir(subDirPath);
    const subFilePath = path.join(subDirPath, "aaa_sub.txt"); // Ensure alphabetical first in subdir
    const subFileContent = "Sub directory file content.";
    await fs.writeFile(subFilePath, subFileContent);
    const anotherRootFilePath = path.join(tempDirPath, "bbb_another.txt"); // Ensure alphabetical middle
    const anotherRootFileContent = "Another root file content.";
    await fs.writeFile(anotherRootFilePath, anotherRootFileContent);

    // Priority files
    const systemPatternsPath = path.join(tempDirPath, "systemPatterns.md"); // Priority 3
    const systemPatternsContent = "System patterns content.";
    await fs.writeFile(systemPatternsPath, systemPatternsContent);
    const progressPath = path.join(subDirPath, "progress.md"); // Priority 6 (in subdir)
    const progressContent = "Progress content.";
    await fs.writeFile(progressPath, progressContent);

    const relPathRoot = path.relative(tempDirPath, rootFilePath);
    const relPathSub = path.relative(tempDirPath, subFilePath);
    const relPathAnother = path.relative(tempDirPath, anotherRootFilePath);
    const relPathSysPatterns = path.relative(tempDirPath, systemPatternsPath);
    const relPathProgress = path.relative(tempDirPath, progressPath);

    // Expected order: systemPatterns.md (priority root) -> bbb_another.txt -> zzz_root.txt (root files first) -> subdir/aaa_sub.txt -> subdir/progress.md (then subdirs)
    const expectedText = `# ${relPathSysPatterns}

${systemPatternsContent}

---

# ${relPathAnother}

${anotherRootFileContent}

---

# ${relPathRoot}

${rootFileContent}

---

# ${relPathSub}

${subFileContent}

---

# ${relPathProgress}

${progressContent}`;

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: expectedText }]);
  });

  it("should handle empty files correctly, including header and newlines", async () => {
    // Create an empty file
    const emptyFilePath = path.join(tempDirPath, "empty.txt");
    await fs.writeFile(emptyFilePath, "");

    // Create a non-empty file (for order check)
    const nonEmptyFilePath = path.join(tempDirPath, "nonempty.txt");
    const nonEmptyFileContent = "This file is not empty.";
    await fs.writeFile(nonEmptyFilePath, nonEmptyFileContent);

    const relativeEmptyPath = path.relative(tempDirPath, emptyFilePath);
    const relativeNonEmptyPath = path.relative(tempDirPath, nonEmptyFilePath);

    // Empty file should still have header (with 2 trailing newlines), separated by ---
    const expectedText = `# ${relativeEmptyPath}

---

# ${relativeNonEmptyPath}

${nonEmptyFileContent}`;

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: expectedText }]);
  });
});
