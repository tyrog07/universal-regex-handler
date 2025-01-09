export class JavaRegex {
  private flags: string;
  private pattern: string;
  private jsPattern: RegExp;

  constructor(pattern: string) {
    this.flags = '';
    this.pattern = pattern;
    this.jsPattern = this.convertPattern(pattern);
  }

  private convertPattern(pattern: string): RegExp {
    const flagRegex = /\(\?([imuxs-]+)\)/g;
    let match;

    // Extract flags from the pattern
    while ((match = flagRegex.exec(pattern)) !== null) {
      const flagPart = match[1];

      // Collect valid flags
      if (flagPart.includes('i') && !flagPart.includes('-i')) this.flags += 'i';
      if (flagPart.includes('m') && !flagPart.includes('-m')) this.flags += 'm';
      if (flagPart.includes('s') && !flagPart.includes('-s')) this.flags += 's';

      // Remove invalid flags
      if (flagPart.includes('-i')) this.flags = this.flags.replace('i', '');
      if (flagPart.includes('-m')) this.flags = this.flags.replace('m', '');
      if (flagPart.includes('-s')) this.flags = this.flags.replace('s', '');
    }

    // Remove all inline flag settings from the pattern
    pattern = pattern.replace(flagRegex, '');

    // Ensure no duplicate flags are present
    this.flags = Array.from(new Set(this.flags.split(''))).join('');

    return new RegExp(pattern.replace(/\\/g, '\\\\'), this.flags);
  }

  public match(str: string): RegExpMatchArray | null {
    return str.match(this.jsPattern);
  }

  public replace(str: string, replacement: string): string {
    return str.replace(this.jsPattern, replacement);
  }

  public search(str: string): number {
    return str.search(this.jsPattern);
  }
}
