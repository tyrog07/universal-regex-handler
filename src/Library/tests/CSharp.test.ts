import { CSharpRegex } from '../CSharp';

describe('CSharpRegex', () => {
  it('should match a simple pattern', () => {
    const re = new CSharpRegex('hello');
    expect(re.IsMatch('hello world')).toBe(true);
    expect(re.IsMatch('world')).toBe(false);
  });

  it('should handle case-insensitive matching', () => {
    const re = new CSharpRegex('hello', 'IgnoreCase');
    expect(re.IsMatch('Hello world')).toBe(true);
    expect(re.IsMatch('HELLO')).toBe(true);
  });

  it('should find matches', () => {
    const re = new CSharpRegex('hello');
    const match = re.Match('hello world');
    expect(match).not.toBeNull();
    expect(match?.value).toBe('hello');
  });

  it('should return null if no match is found', () => {
    const re = new CSharpRegex('hello');
    const match = re.Match('world');
    expect(match).toBeNull();
  });

  it('should find all matches', () => {
    const re = new CSharpRegex('hello');
    const matches = re.Matches('hello world hello');
    expect(matches.length).toBe(2);
    expect(matches[0].value).toBe('hello');
    expect(matches[1].value).toBe('hello');
  });

  it('should replace matches', () => {
    const re = new CSharpRegex('hello');
    const result = re.Replace('hello world', 'hi');
    expect(result).toBe('hi world');
  });

  it('should split the string by the pattern', () => {
    const re = new CSharpRegex('\\s+');
    const result = re.Split('hello world');
    expect(result).toEqual(['hello', 'world']);
  });

  it('should escape special characters', () => {
    const input = 'hello. world?';
    const escaped = CSharpRegex.Escape(input);
    expect(escaped).toBe('hello\\. world\\?');
  });

  it('should unescape special characters', () => {
    const input = 'hello\\. world\\?';
    const unescaped = CSharpRegex.Unescape(input);
    expect(unescaped).toBe('hello. world?');
  });

  it('should match using static method', () => {
    const result = CSharpRegex.IsMatch('hello world', 'hello');
    expect(result).toBe(true);
  });

  it('should find using static method', () => {
    const match = CSharpRegex.Match('hello world', 'hello');
    expect(match).not.toBeNull();
    expect(match?.value).toBe('hello');
  });

  it('should find all using static method', () => {
    const matches = CSharpRegex.Matches('hello world hello', 'hello');
    expect(matches.length).toBe(2);
    expect(matches[0].value).toBe('hello');
    expect(matches[1].value).toBe('hello');
  });

  it('should replace using static method', () => {
    const result = CSharpRegex.Replace('hello world', 'hello', 'hi');
    expect(result).toBe('hi world');
  });

  it('should split using static method', () => {
    const result = CSharpRegex.Split('hello world', '\\s+');
    expect(result).toEqual(['hello', 'world']);
  });

  it('should escape using static method', () => {
    const input = 'hello. world?';
    const escaped = CSharpRegex.Escape(input);
    expect(escaped).toBe('hello\\. world\\?');
  });

  it('should unescape using static method', () => {
    const input = 'hello\\. world\\?';
    const unescaped = CSharpRegex.Unescape(input);
    expect(unescaped).toBe('hello. world?');
  });
});
