/**
 * A class that provides a wrapper around JavaScript's regular expression functionality,
 * designed to handle inline flags similar to Java's regex.  It processes flags within
 * the pattern (e.g., `(?i)` for case-insensitive) and converts them to standard
 * JavaScript RegExp flags.
 * @class
 */
export class JavaRegex {
  flags: string;
  pattern: string;
  jsPattern: RegExp;

  /**
   * Creates a new JavaRegex instance.
   * @param {string} pattern The regular expression pattern, potentially including inline flags.
   */
  constructor(pattern: string) {
    this.flags = '';
    this.pattern = pattern;
    this.jsPattern = this.convertPattern(pattern);
  }

  /**
   * Converts the pattern string, processing inline flags and creating the JavaScript RegExp object.
   * @private
   * @param {string} pattern The input pattern string.
   * @returns {RegExp} A JavaScript RegExp object.
   */
  private convertPattern(pattern: string): RegExp {
    const flagRegex = /\(\?([imxs-]+)\)/g;
    let match;

    const flagsToAdd = new Set<string>();
    const flagsToRemove = new Set<string>();

    while ((match = flagRegex.exec(pattern)) !== null) {
      const flagsInMatch = match[1];

      for (let i = 0; i < flagsInMatch.length; i++) {
        const char = flagsInMatch[i];
        if (char === '-') {
          for (
            let j = i + 1;
            j < flagsInMatch.length && flagsInMatch[j] !== '-';
            j++
          ) {
            flagsToRemove.add(flagsInMatch[j]);
            flagsToAdd.delete(flagsInMatch[j]); // Remove from add set if present
          }
        } else if (!flagsToRemove.has(char)) {
          flagsToAdd.add(char);
        }
      }
    }

    // Update the flags property
    this.flags = Array.from(flagsToAdd).join('');

    // Remove all flag groups from the pattern
    pattern = pattern.replace(flagRegex, '');

    return new RegExp(pattern, this.flags || undefined);
  }

  /**
   * Gets the original pattern string (including inline flags).
   * @returns {string} The original pattern string.
   */
  public getPattern(): string {
    return this.pattern;
  }

  /**
   * Tests if a string matches the regular expression.
   * @param {string} str The string to test.
   * @returns {RegExpMatchArray | null} An array containing matching information, or null if no match is found.
   */
  public match(str: string): RegExpMatchArray | null {
    const regexToUse = new RegExp(this.jsPattern.source, this.flags);
    return str.match(regexToUse);
  }

  /**
   * Replaces all matches in a string with a replacement string.
   * @param {string} str The string to perform replacements on.
   * @param {string} replacement The replacement string.
   * @returns {string} The string with replacements made.
   */
  public replace(str: string, replacement: string): string {
    let flagsToUse = 'g';
    if (this.flags) {
      flagsToUse = this.flags + 'g';
    }
    const regexWithGlobal = new RegExp(this.jsPattern.source, flagsToUse);
    return str.replace(regexWithGlobal, replacement);
  }

  /**
   * Searches a string for a match and returns the index of the match.
   * @param {string} str The string to search.
   * @returns {number} The index of the first match, or -1 if no match is found.
   */
  public search(str: string): number {
    const regexToUse = new RegExp(this.jsPattern.source, this.flags);
    return str.search(regexToUse);
  }
}
