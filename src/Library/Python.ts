export class PythonRegex {
  private pattern: string;
  private flags: string;
  private regex: RegExp;

  constructor(pattern: string, flags: string = '') {
    this.pattern = pattern;
    this.flags = flags;
    this.regex = new RegExp(pattern, flags);
  }

  match(text: string): RegExpMatchArray | null {
    return text.match(this.regex);
  }

  search(text: string): RegExpExecArray | null {
    return this.regex.exec(text);
  }

  findAll(text: string): string[] {
    const allMatches: string[] = [];
    let match: RegExpExecArray | null;
    const regex = new RegExp(this.pattern, this.flags + 'g');
    while ((match = regex.exec(text)) !== null) {
      allMatches.push(match[0]);
    }
    return allMatches;
  }

  split(text: string): string[] {
    return text.split(this.regex);
  }

  sub(replacement: string, text: string): string {
    return text.replace(this.regex, replacement);
  }

  subn(replacement: string, text: string): [string, number] {
    const replacedText = text.replace(this.regex, replacement);
    const matchCount = (text.match(this.regex) || []).length;
    return [replacedText, matchCount];
  }

  fullmatch(text: string): boolean {
    const match = text.match(new RegExp(`^${this.pattern}$`, this.flags));
    return match !== null;
  }

  compile(): void {
    this.regex = new RegExp(this.pattern, this.flags);
  }

  flagsInfo(): string {
    return this.flags;
  }

  patternInfo(): string {
    return this.pattern;
  }
}
