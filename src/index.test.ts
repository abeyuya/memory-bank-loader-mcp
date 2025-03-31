import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { loadMemoryBank } from "./index.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { tmpdir } from "node:os";

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
    expect(result.content).toEqual([{ type: "text", text: fileContent }]);
  });

  it("should return concatenated content of multiple files in the directory (alphabetical order)", async () => {
    const file1Path = path.join(tempDirPath, "file1.txt");
    const file1Content = "Content from file 1.";
    await fs.writeFile(file1Path, file1Content);

    const file2Path = path.join(tempDirPath, "file2.txt");
    const file2Content = "Content from file 2.";
    await fs.writeFile(file2Path, file2Content);

    const expectedContent = file1Content + file2Content;

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: expectedContent }]);
  });

  it("should recursively read files from subdirectories and concatenate content (alphabetical order)", async () => {
    const rootFilePath = path.join(tempDirPath, "root.txt");
    const rootFileContent = "Root file content.";
    await fs.writeFile(rootFilePath, rootFileContent);

    const subDirPath = path.join(tempDirPath, "subdir");
    await fs.mkdir(subDirPath);

    const subFilePath = path.join(subDirPath, "sub.txt");
    const subFileContent = "Sub directory file content.";
    await fs.writeFile(subFilePath, subFileContent);

    const anotherRootFilePath = path.join(tempDirPath, "another.txt");
    const anotherRootFileContent = "Another root file content.";
    await fs.writeFile(anotherRootFilePath, anotherRootFileContent);

    const expectedContent =
      anotherRootFileContent + rootFileContent + subFileContent;

    const result = await loadMemoryBank({
      memoryBankDirectoryPath: tempDirPath,
    });
    expect(result.content).toEqual([{ type: "text", text: expectedContent }]);
  });
});
