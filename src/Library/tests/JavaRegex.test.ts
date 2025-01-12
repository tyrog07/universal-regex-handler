import { JavaRegex } from '../Java';

describe('JavaRegex', () => {
  describe('constructor', () => {
    it('should create a new instance with the provided pattern', () => {
      const regex = new JavaRegex('abc');
      expect(regex.pattern).toBe('abc');
    });

    it('should handle patterns without flags', () => {
      const regex = new JavaRegex('def');
      expect(regex.flags).toBe('');
    });

    it('should extract valid inline flags (case-insensitive)', () => {
      const regex = new JavaRegex('(xyz)(?i)');
      expect(regex.flags).toBe('i');
      expect(regex.match('XYZ')).not.toBeNull();
      expect(regex.match('xyz')).not.toBeNull();
    });

    it('should extract valid inline flags (multiline)', () => {
      const regex = new JavaRegex('^a.+$(?m)');
      expect(regex.flags).toBe('m');
      expect(regex.match('abc\ndef')).not.toBeNull();
      expect(regex.match('abc')).not.toBeNull(); // Corrected assertion
      const regex2 = new JavaRegex('^a.+$');
      expect(regex2.match('abc\ndef')).toBeNull();
      expect(regex2.match('abc')).not.toBeNull();
    });

    it('should extract valid inline flags (dotall)', () => {
      const regex = new JavaRegex('a.+(?s)');
      expect(regex.flags).toBe('s');
      expect(regex.match('a\nb')).not.toBeNull();
      const regex2 = new JavaRegex('a.+');
      expect(regex2.match('a\nb')).toBeNull();
    });
    it('should handle invalid inline flags (case-insensitive negative)', () => {
      const regex = new JavaRegex('(xyz)(?-i)');
      expect(regex.flags).toBe('');
      expect(regex.match('xyz')).not.toBeNull();
      expect(regex.match('XYZ')).toBeNull();
    });

    it('should handle invalid inline flags (multiline negative)', () => {
      const regex = new JavaRegex('^a.+$(?m-m)');
      expect(regex.flags).toBe('');
      expect(regex.match('abc\ndef')).toBeNull();
    });

    it('should handle invalid inline flags (dotall negative)', () => {
      const regex = new JavaRegex('a.+(?s-s)');
      expect(regex.flags).toBe('');
      expect(regex.match('a\nb')).toBeNull();
    });

    it('should ensure no duplicate flags are present', () => {
      const regex = new JavaRegex('(def)(?im)(?im)');
      expect(regex.flags).toBe('im');
    });

    it('should escape backslashes in the final pattern', () => {
      const regex = new JavaRegex('\\d+');
      expect(regex.match('123')).not.toBeNull();
    });

    it('should handle escaped characters correctly', () => {
      const regex = new JavaRegex('\\.');
      expect(regex.match('.')).not.toBeNull();
    });

    it('should handle escaped backslashes correctly', () => {
      const regex = new JavaRegex('\\\\');
      expect(regex.match('\\')).not.toBeNull();
    });

    it('should handle multiple flags correctly', () => {
      const regex = new JavaRegex('(?ism)test');
      expect(regex.flags).toBe('ism');
      expect(regex.match('TEST\nTEST')).not.toBeNull();
    });

    it('should handle flag combinations and removals correctly', () => {
      const regex = new JavaRegex('(?is-i)test');
      expect(regex.flags).toBe('s');
    });

    it('should handle complex flag scenarios', () => {
      const regex = new JavaRegex('(?i)(?s-s)(?m)test');
      expect(regex.flags).toBe('im');
    });

    it('should handle negative inline flags (case-insensitive)', () => {
      const regex = new JavaRegex('(?i)(xyz)(?-i)');
      expect(regex.flags).toBe('');
      expect(regex.match('xyz')).not.toBeNull();
      expect(regex.match('XYZ')).toBeNull();
    });

    it('should handle negative inline flags (multiline)', () => {
      const regex = new JavaRegex('(?m)^a.+$');
      expect(regex.flags).toBe('m');
      const regex2 = new JavaRegex('(?m)^a.+(?-m)$');
      expect(regex2.flags).toBe('');
    });

    it('should handle negative inline flags (dotall)', () => {
      const regex = new JavaRegex('(?s)a.+');
      expect(regex.flags).toBe('s');
      const regex2 = new JavaRegex('(?s)a.+(?-s)');
      expect(regex2.flags).toBe('');
    });

    it('should handle combined negative inline flags', () => {
      const regex = new JavaRegex('(?mi)(test)(?-mi)');
      expect(regex.flags).toBe('');
      expect(regex.match('TEST')).toBeNull();
      expect(regex.match('test')).not.toBeNull();
    });

    it('should handle multiple mixed flags correctly', () => {
      const regex = new JavaRegex('(?i)(?m)(test)(?-i)(?s)');
      expect(regex.flags).toBe('ms');
    });

    it('should handle complex mixed flag scenarios', () => {
      const regex = new JavaRegex('(?i)(?s-s)(?m)(?-m)(?i)test');
      expect(regex.flags).toBe('i');
    });
  });

  describe('match', () => {
    it('should match a string using the compiled regular expression', () => {
      const regex = new JavaRegex('abc');
      const match = regex.match('defabc');
      expect(match).not.toBeNull();
      expect(match![0]).toBe('abc'); // Non-null assertion
    });

    it('should return null for non-matching strings', () => {
      const regex = new JavaRegex('xyz');
      expect(regex.match('abc')).toBeNull();
    });

    it('should handle capturing groups correctly', () => {
      const regex = new JavaRegex('(ab)(c)');
      const match = regex.match('abc');

      expect(match).not.toBeNull(); // Check for a match first

      if (match) {
        expect(match[0]).toBe('abc');
        expect(match[1]).toBe('ab');
        expect(match[2]).toBe('c');
      } else {
        // Expect empty strings if no match
        expect(match?.[1]).toBe('');
        expect(match?.[2]).toBe('');
      }
    });
    it('should handle capturing groups correctly with no match', () => {
      const regex = new JavaRegex('(ab)(c)');
      const match = regex.match('xyz');

      expect(match).toBeNull();
    });
    it('should handle one capturing groups correctly', () => {
      const regex = new JavaRegex('(abc)');
      const match = regex.match('abc');

      expect(match).not.toBeNull();

      if (match) {
        expect(match[0]).toBe('abc');
        expect(match[1]).toBe('abc');
      }
    });
  });

  describe('replace', () => {
    it('should replace all matches with the provided replacement string', () => {
      const regex = new JavaRegex('(ab)');
      expect(regex.replace('abcabc', 'XY')).toBe('XYcXYc');
    });

    it('should handle escaping in the replacement string', () => {
      const regex = new JavaRegex('(hello)');
      expect(regex.replace('hello world', 'Hi $1!')).toBe('Hi hello! world');
    });

    it('should handle no matches', () => {
      const regex = new JavaRegex('xyz');
      expect(regex.replace('abc', 'replacement')).toBe('abc');
    });
  });

  describe('search', () => {
    it('should return the index of the first match or -1 if not found', () => {
      const regex = new JavaRegex('world');
      expect(regex.search('Hello world!')).toBe(6);
      expect(regex.search('No worla here')).toBe(-1); // This line is corrected
    });

    it('should return 0 if the match is at the beginning', () => {
      const regex = new JavaRegex('Hello');
      expect(regex.search('Hello world!')).toBe(0);
    });
  });
});
