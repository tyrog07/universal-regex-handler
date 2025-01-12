export class JavaRegex {
  flags: string;
  pattern: string;
  jsPattern: RegExp;

  constructor(pattern: string) {
    this.flags = '';
    this.pattern = pattern;
    this.jsPattern = this.convertPattern(pattern);
  }

  private convertPattern(pattern: string): RegExp {
    this.flags = '';
    const flagRegex = /\(\?([imxs-]+)\)/g;
    let matches: RegExpExecArray[] = [];
    let match;

    while ((match = flagRegex.exec(pattern)) !== null) {
      matches.push(match);
    }

    for (const match of matches) {
      const flagsInMatch = match[1];

      const flagsToAdd = new Set<string>();
      const flagsToRemove = new Set<string>();

      for (const char of flagsInMatch) {
        if (char === '-') continue;

        if (flagsInMatch.includes(`-${char}`)) {
          flagsToRemove.add(char);
        } else {
          flagsToAdd.add(char);
        }
      }

      // Correctly remove all occurrences using a regex replacement
      for (const flag of flagsToRemove) {
        this.flags = this.flags.replace(new RegExp(flag, 'g'), '');
      }

      for (const flag of flagsToAdd) {
        if (!this.flags.includes(flag)) {
          this.flags += flag;
        }
      }
    }

    pattern = pattern.replace(/\(\?([imxs-]+)\)/g, '');

    return new RegExp(pattern, this.flags || undefined);
  }

  public getPattern(): string {
    return this.pattern;
  }

  public match(str: string): RegExpMatchArray | null {
    const regexToUse = new RegExp(this.jsPattern.source, this.flags);
    return str.match(regexToUse);
  }

  public replace(str: string, replacement: string): string {
    let flagsToUse = 'g';
    if (this.flags) {
      flagsToUse = this.flags + 'g';
    }
    const regexWithGlobal = new RegExp(this.jsPattern.source, flagsToUse);
    return str.replace(regexWithGlobal, replacement);
  }

  public search(str: string): number {
    const regexToUse = new RegExp(this.jsPattern.source, this.flags);
    return str.search(regexToUse);
  }
}
