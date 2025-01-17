import { PythonRegex } from '../Python';

describe('PythonRegex', () => {
  it('should match a simple pattern', () => {
    const regex = new PythonRegex('ab+c');
    expect(regex.match('abbc')).not.toBeNull();
    expect(regex.match('ac')).toBeNull();
  });

  it('should handle flags (i, m, s, x)', () => {
    const regexI = new PythonRegex('abc', 'i');
    expect(regexI.match('ABC')).not.toBeNull();

    const regexM = new PythonRegex('^b$', 'm');
    expect(regexM.match('a\nb\nc')).not.toBeNull();

    const regexS = new PythonRegex('a.b', 's');
    expect(regexS.match('a\nb')).not.toBeNull();

    const regexX = new PythonRegex(
      `
      \\d{3}   # Area code
      -       # Separator
      \\d{3}   # Middle three digits
      -       # Separator
      \\d{4}   # Last four digits
      `,
      'x',
    );
    expect(regexX.match('123-456-7890')).not.toBeNull();
  });

  it('should perform search', () => {
    const regex = new PythonRegex('b+');
    expect(regex.search('aaabbbccc')).not.toBeNull();
    expect(regex.search('aaaccc')).toBeNull();
  });

  it('should findall matches', () => {
    const regex = new PythonRegex('\\d+');
    expect(regex.findall('123 abc 45 def 6789')).toEqual(['123', '45', '6789']);
    expect(regex.findall('')).toEqual([]); // This is now safe
    const regex2 = new PythonRegex('a');
    expect(regex2.findall('bbbb')).toEqual([]);
  });

  it('should finditer matches', () => {
    const regex = new PythonRegex('\\d+');
    const iterator = regex.finditer('123 abc 45 def 6789');
    const results = [];
    for (const match of iterator) {
      results.push(match[0]);
    }
    expect(results).toEqual(['123', '45', '6789']);
    const emptyIterator = regex.finditer('');
    expect(emptyIterator.next().done).toBe(true);
  });

  it('should perform fullmatch', () => {
    const regex = new PythonRegex('\\d+');
    expect(regex.fullmatch('12345')).not.toBeNull();
    expect(regex.fullmatch('12345abc')).toBeNull();
    expect(regex.fullmatch('abc12345')).toBeNull();
  });

  it('should split a string', () => {
    const regex = new PythonRegex(',');
    expect(regex.split('apple,banana,orange')).toEqual([
      'apple',
      'banana',
      'orange',
    ]);
    expect(regex.split('apple,banana,orange', 1)).toEqual([
      'apple',
      'banana,orange',
    ]);
    const regexSpace = new PythonRegex('\\s+');
    expect(regexSpace.split('hello   world')).toEqual(['hello', 'world']);
    expect(regexSpace.split('')).toEqual(['']);
  });

  it('should perform sub (replace)', () => {
    const regex = new PythonRegex('a', 'g');
    expect(regex.sub('b', 'banana')).toEqual('bbnbnb');
    expect(regex.sub('b', 'banana', 2)).toEqual('bbnbna');

    const regexNoGlobal = new PythonRegex('a');
    expect(regexNoGlobal.sub('b', 'banana')).toEqual('bbnana');

    const regexEmptyMatch = new PythonRegex('a*');
    expect(regexEmptyMatch.sub('b', '')).toEqual('b');

    const regexEndOfString = new PythonRegex('a$');
    expect(regexEndOfString.sub('b', 'banana')).toEqual('bananb');

    const regexMultipleMatchesEnd = new PythonRegex('a', 'g');
    expect(regexMultipleMatchesEnd.sub('b', 'aaaa', 2)).toEqual('bbbb');

    const regexZeroLengthMatch = new PythonRegex('^', 'g');
    expect(regexZeroLengthMatch.sub('b', 'test')).toEqual('btest');

    const regexZeroLengthMatch2 = new PythonRegex('a*', 'g');
    expect(regexZeroLengthMatch2.sub('b', '')).toEqual('b');

    const regexZeroLengthMatch3 = new PythonRegex('a?', 'g');
    expect(regexZeroLengthMatch3.sub('b', '')).toEqual('b');
  });

  it('should perform subn (replace with count)', () => {
    const regex = new PythonRegex('a');
    expect(regex.subn('b', 'banana')).toEqual(['bbnbnb', 3]);
    expect(regex.subn('b', 'banana', 2)).toEqual(['bbnana', 2]);
    expect(regex.subn('b', '')).toEqual(['', 0]);
  });

  it('should handle capturing groups and backreferences', () => {
    const regex = new PythonRegex('(\\w+)\\s(\\w+)'); // Correct regex string
    const match = regex.match('Hello World');

    expect(match).not.toBeNull(); // Check for null before accessing properties

    if (match) {
      // Safe check
      expect(match[1]).toBe('Hello');
      expect(match[2]).toBe('World');
    }

    const noMatch = regex.match('1234');
    expect(noMatch).toBeNull();

    const regexWithFlags = new PythonRegex('([a-z]+) ([0-9]+)', 'i');
    const matchWithFlags = regexWithFlags.match('Test 123');
    expect(matchWithFlags).not.toBeNull();
    if (matchWithFlags) {
      expect(matchWithFlags[1]).toBe('Test');
      expect(matchWithFlags[2]).toBe('123');
    }
  });

  it('should handle special characters correctly', () => {
    const regexDot = new PythonRegex('\\.'); // Matches a literal dot
    expect(regexDot.match('test.txt')).not.toBeNull();
    expect(regexDot.match('testxt')).toBeNull();

    const regexBackslash = new PythonRegex('\\\\'); // Matches a literal backslash
    expect(regexBackslash.match('test\\txt')).not.toBeNull();
    expect(regexBackslash.match('testtxt')).toBeNull();

    const regexDigits = new PythonRegex('\\d+'); // Matches one or more digits
    expect(regexDigits.match('12345')).not.toBeNull();
    expect(regexDigits.match('abc')).toBeNull();

    const regexCarat = new PythonRegex('^test');
    expect(regexCarat.match('test test')).not.toBeNull();
    expect(regexCarat.match('atest test')).toBeNull();

    const regexDollar = new PythonRegex('test$');
    expect(regexDollar.match('test')).not.toBeNull();
    expect(regexDollar.match('test test')).toBeNull();

    const regexQuestionMark = new PythonRegex('test?');
    expect(regexQuestionMark.match('tes')).not.toBeNull();
    expect(regexQuestionMark.match('test')).not.toBeNull();
    expect(regexQuestionMark.match('testt')).toBeNull();

    const regexPlus = new PythonRegex('test+');
    expect(regexPlus.match('test')).not.toBeNull();
    expect(regexPlus.match('testt')).not.toBeNull();
    expect(regexPlus.match('tes')).toBeNull();

    const regexStar = new PythonRegex('test*');
    expect(regexStar.match('tes')).not.toBeNull();
    expect(regexStar.match('test')).not.toBeNull();
    expect(regexStar.match('testt')).not.toBeNull();

    const regexOpenBracket = new PythonRegex('\\[');
    expect(regexOpenBracket.match('[')).not.toBeNull();

    const regexCloseBracket = new PythonRegex('\\]');
    expect(regexCloseBracket.match(']')).not.toBeNull();

    const regexOpenParenthesis = new PythonRegex('\\(');
    expect(regexOpenParenthesis.match('(')).not.toBeNull();

    const regexCloseParenthesis = new PythonRegex('\\)');
    expect(regexCloseParenthesis.match(')')).not.toBeNull();

    const regexOpenBrace = new PythonRegex('\\{');
    expect(regexOpenBrace.match('{')).not.toBeNull();

    const regexCloseBrace = new PythonRegex('\\}');
    expect(regexCloseBrace.match('}')).not.toBeNull();

    const regexPipe = new PythonRegex('\\|');
    expect(regexPipe.match('|')).not.toBeNull();
  });
});
