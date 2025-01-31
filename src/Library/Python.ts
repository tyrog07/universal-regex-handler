/**
 * A class that provides a wrapper around JavaScript's regular expression functionality,
 * closely mirroring the behavior and features of Python's `re` module.  It supports
 * flags, matching, searching, finding all matches, iterating matches, full matching,
 * splitting, and substitution.
 * @class
 */
export class PythonRegex {
  private pattern: string;
  private flags: string;

  /**
   * Creates a new PythonRegex instance.
   * @param {string} pattern The regular expression pattern.
   * @param {string} [flags=""] The flags to use with the regular expression (e.g., "i", "g", "m", "s", "u").
   */
  constructor(pattern: string, flags: string = '') {
    this.pattern = pattern;
    this.flags = flags;
  }

  /**
   * Compiles the regular expression with optional extra flags.
   * @private
   * @param {string} [extraFlags=""] Additional flags to apply when compiling.
   * @returns {RegExp} A compiled RegExp object.
   */
  private compileRegex(extraFlags: string = ''): RegExp {
    const allFlags = [...new Set([...this.flags, ...extraFlags])].join('');
    return new RegExp(this.pattern, allFlags);
  }

  /**
   * Attempts to match the pattern at the beginning of the string.
   * @param {string} text The string to match against.
   * @returns {RegExpMatchArray | null} A match array if a match is found at the beginning, otherwise null.
   */
  match(text: string): RegExpMatchArray | null {
    if (this.pattern === '') {
      return text ? ['', text] : [''];
    }
    const regex = this.compileRegex();
    const match = regex.exec(text);
    return match && match.index === 0 ? match : null;
  }

  /**
   * Searches the string for the first occurrence of the pattern.
   * @param {string} text The string to search.
   * @returns {RegExpMatchArray | null} A match array if a match is found, otherwise null.
   */
  search(text: string): RegExpMatchArray | null {
    const regex = this.compileRegex();
    return regex.exec(text);
  }

  /**
   * Finds all non-overlapping matches of the pattern in the string.
   * @param {string} text The string to search.
   * @returns {string[]} An array of all matches.
   */
  findall(text: string): string[] {
    const regex = this.compileRegex('g');
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
      if (match[0].length === 0) {
        regex.lastIndex++; // Avoid infinite loop for zero-length matches
      }
    }
    return matches;
  }

  /**
   * Returns an iterator yielding match objects for each match found in the string.
   * @param {string} text The string to search.
   * @yields {RegExpExecArray} A match object (RegExpExecArray) for each match.
   * @returns {IterableIterator<RegExpExecArray>} An iterator yielding match objects.
   */
  finditer(text: string): IterableIterator<RegExpExecArray> {
    const regex = this.compileRegex('g');
    return (function* () {
      let match;
      let lastIndex = -1;
      while ((match = regex.exec(text)) !== null) {
        if (regex.lastIndex === lastIndex) {
          regex.lastIndex++;
          continue;
        }
        lastIndex = regex.lastIndex;
        yield match;
      }
    })();
  }

  /**
   * Attempts to match the entire string against the pattern.
   * @param {string} text The string to match.
   * @returns {RegExpMatchArray | null} A match array if the entire string matches, otherwise null.
   */
  fullmatch(text: string): RegExpMatchArray | null {
    const regex = this.compileRegex();
    const fullRegex = new RegExp(`^${regex.source}$`, regex.flags);
    return fullRegex.exec(text);
  }

  /**
   * Splits the string into a list of substrings, using the pattern as the delimiter.
   * @param {string} text The string to split.
   * @param {number} [maxsplit=-1] The maximum number of splits to perform.
   * @returns {string[]} A list of substrings.
   */
  split(text: string, maxsplit: number = -1): string[] {
    if (this.pattern === '') {
      const result = Array.from(text);
      if (maxsplit === -1) {
        return ['', ...result];
      } else {
        return [
          '',
          ...result.slice(0, maxsplit),
          result.slice(maxsplit).join(''),
        ];
      }
    }
    const regex = this.compileRegex('g');
    const result = [];
    let currentPosition = 0;
    let splits = 0;
    let match;

    while (
      (maxsplit === -1 || splits < maxsplit) &&
      (match = regex.exec(text.substring(currentPosition))) !== null
    ) {
      result.push(
        text.substring(currentPosition, currentPosition + match.index),
      );
      currentPosition += match.index + match[0].length;
      splits++;
      regex.lastIndex = 0;
    }
    result.push(text.substring(currentPosition));

    if (result[result.length - 1] === '' && regex.source !== '') {
      result.pop();
    }

    return result;
  }

  /**
   * Replaces occurrences of the pattern in the string with the replacement string.
   * @param {string} repl The replacement string.
   * @param {string} text The string to perform substitutions on.
   * @param {number} [count=0] The maximum number of replacements to perform.
   * @returns {string} The string with replacements made.
   */
  sub(repl: string, text: string, count: number = 0): string {
    if (this.pattern === '') {
      if (count === 0) {
        return repl + text.split('').join(repl);
      } else {
        const splitText = text.split('');
        let replacedText = '';
        let replacedCount = 0;

        for (let i = 0; i < splitText.length; i++) {
          if (replacedCount < count) {
            replacedText += repl + splitText[i];
            replacedCount++;
          } else {
            replacedText += splitText[i];
          }
        }
        return replacedText;
      }
    }
    const regex = this.compileRegex('g');
    if (count === 0) {
      return text.replace(regex, repl);
    } else {
      let replacedCount = 0;
      return text.replace(regex, (...args) => {
        if (replacedCount < count) {
          replacedCount++;
          return repl;
        }
        return args[0];
      });
    }
  }
}
