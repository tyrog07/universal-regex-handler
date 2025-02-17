export class CSharpRegex {
  private regex: RegExp;
  private options: string;

  /**
   * Creates a new CSharpRegex instance.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [options=""] The options to use with the regular expression (e.g., "IgnoreCase", "Multiline").
   */
  constructor(pattern: string, options: string = '') {
    let jsFlags = '';
    if (options.includes('IgnoreCase')) jsFlags += 'i';
    if (options.includes('Multiline')) jsFlags += 'm';

    this.options = options;

    // *** Move jsFlags setting to BEFORE pattern modification ***
    let actualPattern = pattern; // Store the actual pattern before modification

    if (pattern.startsWith('@')) {
      actualPattern = pattern.substring(1).replace(/\\(.)/g, '$1');
    }

    this.regex = new RegExp(actualPattern, jsFlags); // Use actualPattern and jsFlags
  }

  /**
   * Tests if the pattern matches the input string.
   * @param {string} input The string to test.
   * @returns {boolean} True if the pattern matches the input string, otherwise false.
   */
  IsMatch(input: string): boolean {
    return this.regex.test(input);
  }

  /**
   * Finds the first match of the pattern in the input string.
   * @param {string} input The string to search.
   * @returns {CSharpMatch | null} The first match if found, otherwise null.
   */
  Match(input: string): CSharpMatch | null {
    const match = input.match(this.regex);
    if (match) {
      return new CSharpMatch(match);
    }
    return null;
  }

  /**
   * Finds all matches of the pattern in the input string.
   * @param {string} input The string to search.
   * @returns {CSharpMatch[]} An array of all matches.
   */
  Matches(input: string): CSharpMatch[] {
    const matches: CSharpMatch[] = [];
    let match;

    // *** KEY CHANGE: Ensure the regex has the global flag ***
    const globalRegex = new RegExp(this.regex.source, this.regex.flags + 'g'); // Create a new regex with the 'g' flag

    while ((match = globalRegex.exec(input)) !== null) {
      matches.push(new CSharpMatch(match));
      if (globalRegex.lastIndex === match.index) {
        globalRegex.lastIndex++; // Avoid infinite loop for zero-length matches
      }
    }
    return matches;
  }

  /**
   * Replaces occurrences of the pattern in the input string with the replacement string.
   * @param {string} input The string to perform replacements on.
   * @param {string} replacement The replacement string.
   * @returns {string} The string with replacements made.
   */
  Replace(input: string, replacement: string): string {
    return input.replace(this.regex, replacement);
  }

  /**
   * Splits the input string into an array of substrings using the pattern as the delimiter.
   * @param {string} input The string to split.
   * @param {number} [count=-1] The maximum number of splits to perform.
   * @param {number} [startat=0] The starting position in the input string.
   * @returns {string[]} An array of substrings.
   */
  Split(input: string, count: number = -1, startat: number = 0): string[] {
    let result = input.substring(startat).split(this.regex);
    if (count > -1 && result.length > count) {
      result = result.slice(0, count);
    }
    return result;
  }

  /**
   * Escapes a string to be used literally in a regex pattern.
   * @param {string} input The string to escape.
   * @returns {string} The escaped string.
   */
  static Escape(input: string): string {
    return input.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  /**
   * Unescapes a string that was escaped for use in a regex pattern.
   * @param {string} input The string to unescape.
   * @returns {string} The unescaped string.
   */
  static Unescape(input: string): string {
    return input.replace(/\\([-/\\^$*+?.()|[\]{}])/g, '$1');
  }

  // Static methods

  /**
   * Tests if the pattern matches the input string.
   * @param {string} input The string to test.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [options=""] The options to use with the regular expression.
   * @returns {boolean} True if the pattern matches the input string, otherwise false.
   */
  static IsMatch(
    input: string,
    pattern: string,
    options: string = '',
  ): boolean {
    const regex = new CSharpRegex(pattern, options);
    return regex.IsMatch(input);
  }

  /**
   * Finds the first match of the pattern in the input string.
   * @param {string} input The string to search.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [options=""] The options to use with the regular expression.
   * @returns {CSharpMatch | null} The first match if found, otherwise null.
   */
  static Match(
    input: string,
    pattern: string,
    options: string = '',
  ): CSharpMatch | null {
    const regex = new CSharpRegex(pattern, options);
    return regex.Match(input);
  }

  /**
   * Finds all matches of the pattern in the input string.
   * @param {string} input The string to search.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [options=""] The options to use with the regular expression.
   * @returns {CSharpMatch[]} An array of all matches.
   */
  static Matches(
    input: string,
    pattern: string,
    options: string = '',
  ): CSharpMatch[] {
    const regex = new CSharpRegex(pattern, options);
    return regex.Matches(input);
  }

  /**
   * Replaces occurrences of the pattern in the input string with the replacement string.
   * @param {string} input The string to perform replacements on.
   * @param {string} pattern The regular expression pattern.
   * @param {string} replacement The replacement string.
   * @param {string} [options=""] The options to use with the regular expression.
   * @returns {string} The string with replacements made.
   */
  static Replace(
    input: string,
    pattern: string,
    replacement: string,
    options: string = '',
  ): string {
    const regex = new CSharpRegex(pattern, options);
    return regex.Replace(input, replacement);
  }

  /**
   * Splits the input string into an array of substrings using the pattern as the delimiter.
   * @param {string} input The string to split.
   * @param {string} pattern The regular expression pattern.
   * @param {number} [count=-1] The maximum number of splits to perform.
   * @param {number} [startat=0] The starting position in the input string.
   * @param {string} [options=""] The options to use with the regular expression.
   * @returns {string[]} An array of substrings.
   */
  static Split(
    input: string,
    pattern: string,
    count: number = -1,
    startat: number = 0,
    options: string = '',
  ): string[] {
    const regex = new CSharpRegex(pattern, options);
    return regex.Split(input, count, startat);
  }
}

/**
 * A class representing a match found by the CSharpRegex class.
 * @class
 */
class CSharpMatch {
  public value: string;
  public groups: string[];
  public index: number;

  /**
   * Creates a new CSharpMatch instance.
   * @param {RegExpMatchArray} match The match array from a regular expression execution.
   */
  constructor(match: RegExpMatchArray) {
    this.value = match[0];
    this.groups = match.slice(1);
    this.index = match.index!;
  }

  /**
   * Returns the next match in the input string.
   * @returns {CSharpMatch | null} The next match if found, otherwise null.
   */
  NextMatch(): CSharpMatch | null {
    console.warn(
      'CSharpMatch.NextMatch is not fully supported in JavaScript. Use Matches() to get all matches and iterate.',
    );
    return null;
  }
}
