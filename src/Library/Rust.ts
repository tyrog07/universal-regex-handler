/**
 * A class that provides a wrapper around JavaScript's regular expression functionality,
 * closely mirroring the behavior and features of Rust's `regex` crate. It supports
 * flags, matching, searching, finding all matches, iterating matches, capturing groups,
 * splitting, and substitution.
 * @class
 */
export class RustRegex {
  private regex: RegExp;
  unicode: boolean;

  /**
   * Creates a new RustRegex instance.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [flags=""] The flags to use with the regular expression (e.g., "i", "g", "m", "s", "u").
   */
  constructor(pattern: string, flags: string = '') {
    const effectiveFlags = flags.includes('u') ? flags : flags + 'u';
    this.unicode = effectiveFlags.includes('u');
    this.regex = new RegExp(pattern, effectiveFlags);
  }

  /**
   * Creates a new RustRegex instance.
   * @param {string} pattern The regular expression pattern.
   * @returns {RustRegex} A new RustRegex instance.
   */
  static new(pattern: string): RustRegex {
    return new RustRegex(pattern);
  }

  /**
   * Tests if the pattern matches the string.
   * @param {string} text The string to test.
   * @returns {boolean} True if the pattern matches the string, otherwise false.
   */
  isMatch(text: string): boolean {
    return this.regex.test(text);
  }

  /**
   * Finds the first match of the pattern in the string.
   * @param {string} text The string to search.
   * @returns {string | null} The first match if found, otherwise null.
   */
  find(text: string): string | null {
    const match = this.regex.exec(text);
    return match ? match[0] : null;
  }

  /**
   * Finds all matches of the pattern in the string.
   * @param {string} text The string to search.
   * @returns {string[]} An array of all matches.
   */
  findIter(text: string): string[] {
    const matches: string[] = [];
    let match;
    let lastIndex = 0; // Keep track of the last match's end index

    while ((match = this.regex.exec(text.slice(lastIndex))) !== null) {
      matches.push(match[0]);
      lastIndex += match.index + match[0].length; // Update lastIndex
      this.regex.lastIndex = 0; // Reset lastIndex for the next iteration
    }
    return matches;
  }

  /**
   * Captures groups from the first match of the pattern in the string.
   * @param {string} text The string to search.
   * @returns {(string | undefined)[] | null} An array of captured groups if found, otherwise null.
   */
  captures(text: string): (string | undefined)[] | null {
    const match = this.regex.exec(text);
    return match ? match.slice(1) : null;
  }

  /**
   * Captures named groups from the first match of the pattern in the string.
   * @param {string} text The string to search.
   * @returns {{ [name: string]: string | undefined } | null} An object with named groups if found, otherwise null.
   */
  namedCaptures(text: string): { [name: string]: string | undefined } | null {
    const match = this.regex.exec(text);

    if (!match || !this.regex.source.includes('?<')) {
      return null; // No named groups or no match
    }

    const names: string[] = [];
    const namedRegex = new RegExp(this.regex.source, this.regex.flags); // Recreate regex to get group names
    let groupIndex = 1;
    let match2;

    while ((match2 = namedRegex.exec(namedRegex.source)) !== null) {
      if (match2[0].startsWith('(?<')) {
        // Check for named capture syntax
        const nameMatch = /\(\?<([a-zA-Z_][a-zA-Z0-9_]*)>/.exec(match2[0]);
        if (nameMatch) {
          names.push(nameMatch[1]);
        }
      }
      groupIndex++;
    }

    const result: { [name: string]: string | undefined } = {};
    if (match) {
      for (let i = 0; i < names.length; i++) {
        result[names[i]] = match[i + 1];
      }
    }
    return result;
  }

  /**
   * Enables or disables case-insensitive matching.
   * @param {boolean} [enabled=true] Whether to enable case-insensitive matching.
   * @returns {RustRegex} A new RustRegex instance with the updated flag.
   */
  caseInsensitive(enabled: boolean = true): RustRegex {
    const flags = this.regex.flags.replace('i', '') + (enabled ? 'i' : '');
    return new RustRegex(this.regex.source, flags);
  }

  /**
   * Sets the Unicode flag.
   * @param {boolean} enabled Whether to enable the Unicode flag.
   * @returns {RustRegex} The current RustRegex instance.
   */
  setUnicode(enabled: boolean): RustRegex {
    this.unicode = enabled;
    return this;
  }

  /**
   * Replaces occurrences of the pattern in the string with the replacement string or function.
   * @param {string} text The string to perform replacements on.
   * @param {string | ((match: string, ...captures: string[]) => string)} replacement The replacement string or function.
   * @returns {string} The string with replacements made.
   */
  replace(
    text: string,
    replacement: string | ((match: string, ...captures: string[]) => string),
  ): string {
    if (typeof replacement === 'string') {
      return text.replace(this.regex, replacement); // Correct for string replacement
    } else {
      return text.replace(
        this.regex,
        replacement as (match: string, ...captures: string[]) => string,
      ); // Correct for function replacement
    }
  }

  /**
   * Replaces the first occurrence of the pattern in the string with the replacement string or function.
   * @param {string} text The string to perform the replacement on.
   * @param {string | ((match: string, ...captures: string[]) => string)} replacement The replacement string or function.
   * @returns {string} The string with the first replacement made.
   */
  replaceOne(
    text: string,
    replacement: string | ((match: string, ...captures: string[]) => string),
  ): string {
    if (typeof replacement === 'string') {
      return text.replace(this.regex, replacement); // Correct for string replacement
    } else {
      let replaced = false;
      return text.replace(this.regex, (...args) => {
        if (!replaced) {
          replaced = true;
          return (
            replacement as (match: string, ...captures: string[]) => string
          )(...args); // Correct for function replacement
        } else {
          return args[0]; // Return the original match for subsequent matches
        }
      });
    }
  }

  /**
   * Splits the string into an array of substrings using the pattern as the delimiter.
   * @param {string} text The string to split.
   * @param {number} [limit] The maximum number of splits to perform.
   * @returns {string[]} An array of substrings.
   */
  split(text: string, limit?: number): string[] {
    return text.split(this.regex, limit);
  }

  /**
   * Escapes a string to be used literally in a regex pattern.
   * @param {string} text The string to escape.
   * @returns {string} The escaped string.
   */
  static escape(text: string): string {
    return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Returns the original regex pattern string.
   * @returns {string} The original regex pattern string.
   */
  pattern(): string {
    return this.regex.source;
  }

  /**
   * Returns the flags used in the regex pattern.
   * @returns {string} The flags used in the regex pattern.
   */
  flags(): string {
    return this.regex.flags;
  }

  /**
   * Tests if the regex matches the entire string.
   * @param {string} text The string to test.
   * @returns {boolean} True if the regex matches the entire string, otherwise false.
   */
  isMatchFull(text: string): boolean {
    const match = this.regex.exec(text);
    return (
      match !== null && match.index === 0 && match[0].length === text.length
    );
  }

  /**
   * Finds the starting and ending indices of the first match.
   * @param {string} text The string to search.
   * @returns {[number, number] | null} A tuple with the start and end indices of the first match, otherwise null.
   */
  findStartEnd(text: string): [number, number] | null {
    const match = this.regex.exec(text);
    return match ? [match.index, match.index + match[0].length] : null;
  }

  /**
   * Finds the starting and ending indices of all matches.
   * @param {string} text The string to search.
   * @returns {[number, number][]} An array of tuples with the start and end indices of all matches.
   */
  findStartEndIter(text: string): [number, number][] {
    const matches: [number, number][] = [];
    let match;
    let lastIndex = 0;

    while ((match = this.regex.exec(text.slice(lastIndex))) !== null) {
      matches.push([
        lastIndex + match.index,
        lastIndex + match.index + match[0].length,
      ]);
      lastIndex += match.index + match[0].length;
      this.regex.lastIndex = 0; // Reset for the next slice
    }
    return matches;
  }

  /**
   * Iterates over all captures in the string.
   * @param {string} text The string to search.
   * @returns {(string[] | undefined)[]} An array of arrays with captured groups.
   */
  capturesIter(text: string): (string[] | undefined)[] {
    const allCaptures: (string[] | undefined)[] = [];
    let match;
    let lastIndex = 0; // Track last match's end

    while ((match = this.regex.exec(text.slice(lastIndex))) !== null) {
      allCaptures.push(match.slice(1)); // Push captured groups
      lastIndex += match.index + match[0].length;
      this.regex.lastIndex = 0; // Reset for next iteration
    }
    return allCaptures;
  }
}
