class PythonRegex {
  private pattern: string;
  private flags: string;

  constructor(pattern: string, flags: string = '') {
    this.pattern = pattern;
    this.flags = flags;
  }

  private compileRegex(extraFlags: string = ''): RegExp {
    const allFlags = [...new Set([...this.flags, ...extraFlags])].join('');
    return new RegExp(this.pattern, allFlags);
  }

  match(text: string): RegExpMatchArray | null {
    if (this.pattern === '') {
      return text ? ['', text] : [''];
    }
    const regex = this.compileRegex();
    const match = regex.exec(text);
    return match && match.index === 0 ? match : null;
  }

  search(text: string): RegExpMatchArray | null {
    const regex = this.compileRegex();
    return regex.exec(text);
  }

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

  finditer(text: string): IterableIterator<RegExpExecArray> {
    const regex = this.compileRegex('g');
    return (function* () {
      let match;
      let lastIndex = -1;
      while ((match = regex.exec(text)) !== null) {
        if (regex.lastIndex === lastIndex) {
          // Prevent infinite loop by advancing lastIndex manually for zero-length matches
          regex.lastIndex++;
          continue;
        }
        lastIndex = regex.lastIndex;
        yield match;
      }
    })();
  }

  fullmatch(text: string): RegExpMatchArray | null {
    const regex = this.compileRegex();
    const fullRegex = new RegExp(`^${regex.source}$`, regex.flags);
    return fullRegex.exec(text);
  }

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

    // Remove trailing empty string if it is not expected
    if (result[result.length - 1] === '' && regex.source !== '') {
      result.pop();
    }

    return result;
  }

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

export { PythonRegex };
