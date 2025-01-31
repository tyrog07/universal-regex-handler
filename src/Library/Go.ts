export class GoRegex {
  originalPattern: string;
  private flags: string;
  private re: RegExp;

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

  matchString(str: string): boolean {
    return this.re.test(str);
  }

  findString(str: string): string {
    const match = this.re.exec(str);
    return match ? match[0] : '';
  }

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

  replaceAllString(str: string, replacement: string): string {
    return str.replace(this.re, replacement);
  }

  replaceAllStringFunc(
    str: string,
    replacerFunc: (match: string, ...args: any[]) => string,
  ): string {
    return str.replace(this.re, replacerFunc);
  }

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

  findStringSubmatch(str: string): RegExpExecArray | null {
    const regexWithoutGlobal = new RegExp(
      this.re.source,
      this.re.flags.replace('g', ''),
    );
    return regexWithoutGlobal.exec(str);
  }
  static quoteMeta(str: string): string {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  static compile(pattern: string, flags: string = ''): GoRegex {
    try {
      const regex = new GoRegex(pattern, flags); // Try creating the GoRegex instance
      return regex;
    } catch (error: any) {
      // Catch any error thrown during GoRegex creation
      throw new Error('Invalid regular expression: ' + error.message);
    }
  }
  static mustCompile(pattern: string, flags: string = ''): GoRegex {
    return GoRegex.compile(pattern, flags);
  }
}
