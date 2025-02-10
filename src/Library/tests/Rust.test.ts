import { RustRegex } from './../Rust';

describe('RustRegex', () => {
  it('should match a simple pattern', () => {
    const re = RustRegex.new('hello');
    expect(re.isMatch('hello world')).toBe(true);
    expect(re.isMatch('world')).toBe(false);
  });

  it('should handle case-insensitive matching', () => {
    const re = RustRegex.new('hello').caseInsensitive();
    expect(re.isMatch('Hello world')).toBe(true);
    expect(re.isMatch('HELLO')).toBe(true);
  });

  it('should find matches', () => {
    const re = RustRegex.new('hello');
    expect(re.find('hello world')).toBe('hello');
    expect(re.find('world')).toBeNull();
  });

  it('should find all matches', () => {
    const re = RustRegex.new('hello');
    expect(re.findIter('hello world hello')).toEqual(['hello', 'hello']);
  });

  it('should capture groups', () => {
    const re = RustRegex.new(String.raw`(\w+) (\w+)`);
    expect(re.captures('hello world')).toEqual(['hello', 'world']);
    expect(re.captures('hello')).toBeNull();
  });

  it('Negative case: No match', () => {
    const re2 = RustRegex.new(
      String.raw`^(?!\w)(?<first>\w+)(?!\w) (?!\w)(?<second>\w+)(?!\w)$`,
    );
    const noMatch = re2.namedCaptures('no match');
    expect(noMatch).toBeNull();

    const noMatch2 = re2.namedCaptures('nomatch');
    expect(noMatch2).toBeNull();

    const noMatch3 = re2.namedCaptures('no match'); // Non-breaking space
    expect(noMatch3).toBeNull();

    const noMatch4 = re2.namedCaptures('no match extra');
    expect(noMatch4).toBeNull();

    const noMatch5 = re2.namedCaptures('extra no match');
    expect(noMatch5).toBeNull();

    const noMatch6 = re2.namedCaptures(''); // Empty string
    expect(noMatch6).toBeNull();

    const noMatch7 = re2.namedCaptures(' '); // Only space
    expect(noMatch7).toBeNull();
  });

  it('should replace matches with a string', () => {
    const re = RustRegex.new(String.raw`(\w+) (\w+)`);
    expect(re.replace('hello world', '$2 $1')).toBe('world hello');
  });

  it('should replace matches with a function', () => {
    const re = RustRegex.new(String.raw`(\w+) (\w+)`);
    const replacementFn = (match: string, p1: string, p2: string) =>
      `${p2} ${p1}!`;
    expect(re.replace('hello world', replacementFn)).toBe('world hello!');
  });

  it('should replace only the first match', () => {
    const re = RustRegex.new('hello');
    expect(re.replaceOne('hello world hello', 'replaced')).toBe(
      'replaced world hello',
    );
  });

  it('should split the string', () => {
    const re = RustRegex.new(',');
    expect(re.split('one,two,three')).toEqual(['one', 'two', 'three']);
  });

  it('should split with a limit', () => {
    const re = RustRegex.new(',');
    expect(re.split('one,two,three', 2)).toEqual(['one', 'two']);
  });

  it('should escape special characters', () => {
    const escaped = RustRegex.escape('.*+?^${}()|[]\\');
    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  it('should return the pattern', () => {
    const re = RustRegex.new('hello');
    expect(re.pattern()).toBe('hello');
  });

  it('should return the flags', () => {
    const re = RustRegex.new('hello').caseInsensitive();
    expect(re.flags()).toBe('iu'); // Unicode is default in TS
  });

  it('should check for full match', () => {
    const re = RustRegex.new('hello');
    expect(re.isMatchFull('hello')).toBe(true);
    expect(re.isMatchFull('hello world')).toBe(false);
  });

  it('should find start and end indices', () => {
    const re = RustRegex.new('hello');
    expect(re.findStartEnd('hello world')).toEqual([0, 5]);
    expect(re.findStartEnd('world')).toBeNull();
  });

  it('should find all start and end indices', () => {
    const re = RustRegex.new('hello');
    expect(re.findStartEndIter('hello world hello')).toEqual([
      [0, 5],
      [12, 17],
    ]);
  });

  it('should handle captures iter', () => {
    const re = RustRegex.new(String.raw`(\w+) (\w+)`);
    expect(re.capturesIter('hello world hello world')).toEqual([
      ['hello', 'world'],
      ['hello', 'world'],
    ]);
  });

  it('should handle Unicode (JavaScript - with limitations)', () => {
    const unicodeRegex = RustRegex.new(String.raw`\u00E4`).setUnicode(true); // Unicode "enabled" (JS default)
    expect(unicodeRegex.isMatch('ä')).toBe(true); // Always true in JS

    const asciiRegex = RustRegex.new(String.raw`\u00E4`).setUnicode(false); // Unicode "disabled" (has NO EFFECT in JS)
    expect(asciiRegex.isMatch('ä')).toBe(true); // Still true in JS (limitation)

    // Demonstrating the intended behavior (for Rust):
    if (unicodeRegex.unicode) {
      console.log(
        'Unicode mode (intended for Rust): Matching Unicode character',
      );
    }

    if (!asciiRegex.unicode) {
      console.log(
        'ASCII mode (intended for Rust): Not matching Unicode character',
      );
    } else {
      console.log(
        'ASCII mode (intended for Rust): Matching Unicode character (JS limitation)',
      );
    }

    // How to ACTUALLY match only ASCII in JavaScript (if needed):
    const jsAsciiRegex = new RegExp(String.raw`[\x00-\x7F]`); // Matches characters in the ASCII range (0-127)
    expect(jsAsciiRegex.test('ä')).toBe(false); // Correctly false

    const jsUnicodeRegex = new RegExp(String.raw`\u00E4`); // Unicode matching
    expect(jsUnicodeRegex.test('ä')).toBe(true); // Correctly true
  });
});
