/**
 * A class that provides a wrapper around JavaScript's regular expression functionality,
 * closely mirroring the behavior and features of Go's `regexp` package.  It handles
 * raw strings, Unicode, and provides methods for matching, finding, replacing,
 * splitting, and more.
 * @class
 */
export class GoRegex {
  originalPattern: string;
  private flags: string;
  private re: RegExp;

  /**
   * Creates a new GoRegex instance.
   * @param {string} pattern The regular expression pattern.  Use backticks (`) for raw strings.
   * @param {string} [flags=""] The flags to use with the regular expression (e.g., "i", "g", "u", "m", "s").
   */
  constructor(pattern: string, flags: string = '') {
    if (pattern.startsWith('`') && pattern.endsWith('`')) {
      pattern = pattern.slice(1, -1);
    }

    this.originalPattern = pattern;
    this.flags = flags;
    this.re = new RegExp(pattern, flags);

    if (/(?<!\\)(?:\\\d+|\\k<\w+>)/.test(pattern)) {
      console.warn(
        "Go's RE2 engine (and this wrapper) does not support backreferences.",
      );
    }
  }

  /**
   * Checks if the string contains a match for the regular expression.
   * @param {string} str The string to search.
   * @returns {boolean} True if the string contains a match, false otherwise.
   */
  matchString(str: string): boolean {
    return this.re.test(str);
  }

  /**
   * Finds the first match in the string.
   * @param {string} str The string to search.
   * @returns {string} The first match, or an empty string if no match is found.
   */
  findString(str: string): string {
    const match = this.re.exec(str);
    return match ? match[0] : '';
  }

  /**
   * Finds all matches in the string.
   * @param {string} str The string to search.
   * @param {number} [n=-1] The maximum number of matches to return.  If -1 (the default), all matches are returned.
   * @returns {string[]} An array of all matches, or an empty array if no matches are found.
   */
  findAllString(str: string, n: number = -1): string[] {
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = this.re.exec(str)) !== null && (n === -1 || count < n)) {
      matches.push(match[0]);
      count++;
      if (!this.re.global) break;
    }

    return matches;
  }

  /**
   * Replaces all matches in the string with the replacement string.
   * @param {string} str The string to search and replace.
   * @param {string} replacement The replacement string.
   * @returns {string} The string with all matches replaced.
   */
  replaceAllString(str: string, replacement: string): string {
    return str.replace(this.re, replacement);
  }

  /**
   * Replaces all matches in the string with the result of the replacer function.
   * @param {string} str The string to search and replace.
   * @param {function} replacerFunc The function to call for each match.  The function should return the replacement string.
   * @returns {string} The string with all matches replaced.
   */
  replaceAllStringFunc(
    str: string,
    replacerFunc: (match: string, ...args: any[]) => string,
  ): string {
    return str.replace(this.re, replacerFunc);
  }

  /**
   * Splits the string into an array of substrings using the regular expression as the delimiter.
   * @param {string} str The string to split.
   * @param {number} [n=-1] The maximum number of substrings to return. If -1 (the default), all substrings are returned.
   * @returns {string[]} An array of substrings.
   */
  split(str: string, n: number = -1): string[] {
    if (n === -1) {
      return str.split(this.re);
    }

    const result: string[] = [];
    let currentString = str;
    let match: RegExpExecArray | null;
    let count = 0;

    while ((match = this.re.exec(currentString)) !== null && count < n - 1) {
      const separatorIndex = match.index;
      const splitPiece = currentString.slice(0, separatorIndex);
      result.push(splitPiece);
      currentString = currentString.slice(separatorIndex + match[0].length);
      count++;
    }

    result.push(currentString);
    return result;
  }

  /**
   * Finds the first match and returns the match and its submatches.
   * @param {string} str The string to search.
   * @returns {RegExpExecArray | null} An array containing the full match and its submatches, or null if no match is found.
   */
  findStringSubmatch(str: string): RegExpExecArray | null {
    const regexWithoutGlobal = new RegExp(
      this.re.source,
      this.re.flags.replace('g', ''),
    );
    return regexWithoutGlobal.exec(str);
  }

  /**
   * Escapes special regular expression characters in a string.  This is equivalent to Go's `regexp.QuoteMeta`.
   * @param {string} str The string to escape.
   * @returns {string} The escaped string.
   */
  static quoteMeta(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Compiles a regular expression pattern into a GoRegex object.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [flags=""] The flags to use with the regular expression.
   * @returns {GoRegex} A GoRegex object.
   * @throws {Error} If the regular expression pattern is invalid.
   */
  static compile(pattern: string, flags: string = ''): GoRegex {
    try {
      return new GoRegex(pattern, flags);
    } catch (error: any) {
      throw new Error('Invalid regular expression: ' + error.message);
    }
  }

  /**
   * Compiles a regular expression pattern into a GoRegex object.  This method will panic (throw an error) if the pattern is invalid.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [flags=""] The flags to use with the regular expression.
   * @returns {GoRegex} A GoRegex object.
   * @throws {Error} If the regular expression pattern is invalid.
   */
  static mustCompile(pattern: string, flags: string = ''): GoRegex {
    return GoRegex.compile(pattern, flags);
  }
}
