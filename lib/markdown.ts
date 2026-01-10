/**
 * Markdown formatting utilities for MarkFlow AI
 * Rule-based formatting (local, no AI)
 */

/**
 * Normalize whitespace in markdown content
 * - Trim trailing spaces
 * - Remove excessive blank lines (max 2)
 * - Ensure file ends with single newline
 */
export function normalizeWhitespace(content: string): string {
  return content
    .split("\n")
    .map((line) => line.trimEnd()) // Remove trailing spaces
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
    .trim() + "\n"; // End with single newline
}

/**
 * Standardize list markers to use `-`
 * Converts `*` and `+` to `-`
 */
export function normalizeListMarkers(content: string): string {
  // Match lines starting with * or + followed by space (unordered list)
  return content.replace(/^(\s*)[\*\+]\s+/gm, "$1- ");
}

/**
 * Fix code block indentation
 * Ensures consistent 4-space indentation inside code blocks
 */
export function normalizeCodeBlocks(content: string): string {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let codeBlockIndent = 0;
  const result: string[] = [];

  for (const line of lines) {
    // Check for code block fence
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        // Opening fence - capture indentation
        codeBlockIndent = line.search(/\S/);
        codeBlockIndent = codeBlockIndent === -1 ? 0 : codeBlockIndent;
      }
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }

    // Inside code block - preserve content as-is
    if (inCodeBlock) {
      result.push(line);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Add proper spacing around headings
 * - Blank line before heading (unless at start)
 * - Single space after # symbols
 */
export function normalizeHeadings(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check if line is a heading
    if (/^#{1,6}\s/.test(trimmedLine)) {
      // Add blank line before heading if not at start and previous line isn't blank
      if (i > 0 && result[result.length - 1]?.trim() !== "") {
        result.push("");
      }
      // Normalize heading: ensure single space after #
      const normalized = trimmedLine.replace(/^(#{1,6})\s+/, "$1 ");
      result.push(normalized);
    } else {
      result.push(line);
    }
  }

  return result.join("\n");
}

/**
 * Apply all formatting rules
 * Main function to format markdown content
 */
export function formatMarkdown(content: string): string {
  let formatted = content;

  // Apply formatting rules in order
  formatted = normalizeWhitespace(formatted);
  formatted = normalizeListMarkers(formatted);
  formatted = normalizeCodeBlocks(formatted);
  formatted = normalizeHeadings(formatted);

  return formatted;
}

/**
 * Insert markdown syntax at cursor position
 * Returns the new content and cursor position
 */
export function insertMarkdownSyntax(
  content: string,
  cursorPosition: number,
  syntax: "bold" | "italic" | "code" | "link" | "heading" | "list" | "quote"
): { content: string; newCursorPosition: number } {
  const before = content.slice(0, cursorPosition);
  const after = content.slice(cursorPosition);

  let insertion = "";
  let cursorOffset = 0;

  switch (syntax) {
    case "bold":
      insertion = "**text**";
      cursorOffset = 2;
      break;
    case "italic":
      insertion = "*text*";
      cursorOffset = 1;
      break;
    case "code":
      insertion = "`code`";
      cursorOffset = 1;
      break;
    case "link":
      insertion = "[text](url)";
      cursorOffset = 1;
      break;
    case "heading":
      // Add heading at start of line
      const lastNewline = before.lastIndexOf("\n");
      const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
      const lineContent = before.slice(lineStart);
      if (lineContent.startsWith("#")) {
        // Already a heading, add one more #
        insertion = "#";
        cursorOffset = 1;
      } else {
        // New heading
        insertion = "## ";
        cursorOffset = 3;
      }
      break;
    case "list":
      insertion = "\n- ";
      cursorOffset = 3;
      break;
    case "quote":
      insertion = "\n> ";
      cursorOffset = 3;
      break;
  }

  return {
    content: before + insertion + after,
    newCursorPosition: cursorPosition + cursorOffset,
  };
}
