export class PythonRegex {
  private pattern: string;
  private flags: string;
  private regex: RegExp;

  constructor(pattern: string, flags: string = '') {
    this.pattern = pattern;
    this.flags = flags;
    this.regex = this.compile(pattern, flags);
  }

  private compile(pattern: string, flags: string): RegExp {
    let jsFlags = '';
    if (flags.includes('i')) jsFlags += 'i';
    if (flags.includes('m')) jsFlags += 'm';
    if (flags.includes('s')) jsFlags += 's';
    if (flags.includes('x')) {
      pattern = pattern.replace(/\s+/g, '');
      pattern = pattern.replace(/#.*$/gm, '');
    }
    return new RegExp(pattern, jsFlags);
  }

  match(text: string): RegExpMatchArray | null {
    return text.match(this.regex);
  }

  search(text: string): RegExpMatchArray | null {
    return this.regex.exec(text);
  }

  findall(text: string): string[] {
    if (text === '') return [];

    const matches: string[] = [];
    let match;

    // Clone the regex with a new RegExp object and ensure global flag is set
    let flags = this.regex.flags;
    if (!flags.includes('g')) {
      flags += 'g'; // Ensure the global flag is present
    }
    const regexToUse = new RegExp(this.regex.source, flags);
    let previousLastIndex = -1;

    while ((match = regexToUse.exec(text)) !== null) {
      if (match[0].length === 0 && regexToUse.lastIndex === previousLastIndex) {
        regexToUse.lastIndex++; // Crucial for zero-length matches
        if (regexToUse.lastIndex > text.length) break;
        continue;
      }
      matches.push(match[0]);
      previousLastIndex = regexToUse.lastIndex;
    }

    return matches;
  }

  finditer(text: string): IterableIterator<RegExpExecArray> {
    let flags = this.regex.flags;
    if (!flags.includes('g')) {
      flags += 'g';
    }
    const regexToUse = new RegExp(this.regex.source, flags);
    return text.matchAll(regexToUse);
  }

  fullmatch(text: string): RegExpMatchArray | null {
    const fullPattern = `^${this.pattern}$`;
    const fullRegex = this.compile(fullPattern, this.flags);
    return text.match(fullRegex);
  }

  split(text: string, maxsplit: number = Infinity): string[] {
    if (maxsplit === Infinity) {
      return text.split(this.regex);
    } else {
      let parts = [];
      let remaining = text;
      for (let i = 0; i < maxsplit; i++) {
        const match = this.regex.exec(remaining);
        if (match) {
          parts.push(remaining.slice(0, match.index));
          remaining = remaining.slice(match.index + match[0].length);
        } else {
          break;
        }
      }
      parts.push(remaining);
      return parts;
    }
  }

  sub(repl: string, text: string, count: number = Infinity): string {
    if (!this.regex.global && count !== Infinity) {
      // Handle non-global regex with count
      let replacedCount = 0;
      return text.replace(this.regex, (match) => {
        replacedCount++;
        return replacedCount <= count ? repl : match;
      });
    } else {
      // Handle global regex or count === Infinity
      let result = '';
      let replacedCount = 0;
      let currentIndex = 0;
      let match;

      // Clone the regex to avoid side effects
      let flags = this.regex.flags;
      if (!flags.includes('g')) {
        flags += 'g';
      }
      const regexToUse = new RegExp(this.regex.source, flags);

      while (
        replacedCount < count &&
        (match = regexToUse.exec(text)) !== null
      ) {
        result += text.substring(currentIndex, match.index);
        result += repl;
        currentIndex = match.index + match[0].length;
        replacedCount++;

        if (match[0].length === 0) {
          regexToUse.lastIndex++;
          if (regexToUse.lastIndex > text.length) break;
        }
      }

      result += text.substring(currentIndex);
      return result;
    }
  }

  subn(repl: string, text: string, count: number = Infinity): [string, number] {
    let replacedCount = 0;
    const newText = this.sub(repl, text, count);
    if (count === Infinity) {
      replacedCount = this.findall(text).length;
    } else {
      replacedCount = Math.min(count, this.findall(text).length);
    }
    return [newText, replacedCount];
  }
}

export default PythonRegex;
