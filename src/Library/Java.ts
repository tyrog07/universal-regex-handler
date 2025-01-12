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
