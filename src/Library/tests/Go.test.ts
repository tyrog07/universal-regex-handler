import { GoRegex } from './../Go';

describe('GoRegex', () => {
  describe('Constructor and Raw Strings', () => {
    it('should handle raw strings correctly', () => {
      const regex = new GoRegex('`\\b\\w+\\b`');
      expect(regex.originalPattern).toBe('\\b\\w+\\b'); // Check the *unprocessed* pattern
    });

    it('should handle regular strings', () => {
      const regex = new GoRegex('\\b\\w+\\b');
      expect(regex.originalPattern).toBe('\\b\\w+\\b');
    });

    it('should handle empty pattern', () => {
      const regex = new GoRegex('');
      expect(regex.originalPattern).toBe('');
    });
  });

  describe('matchString', () => {
    it('should return true for a match', () => {
      const regex = new GoRegex('hello', 'i');
      expect(regex.matchString('Hello World')).toBe(true);
    });

    it('should return false for no match', () => {
      const regex = new GoRegex('world');
      expect(regex.matchString('Hello')).toBe(false);
    });
  });

  describe('findString', () => {
    it('should return the first match', () => {
      const regex = new GoRegex('\\b\\w+\\b');
      expect(regex.findString('Hello World')).toBe('Hello');
    });

    it('should return an empty string for no match', () => {
      const regex = new GoRegex('goodbye');
      expect(regex.findString('Hello World')).toBe('');
    });
  });

  describe('findAllString', () => {
    it('should return all matches', () => {
      const regex = new GoRegex('\\b\\w+\\b', 'g');
      expect(regex.findAllString('Hello World Hello')).toEqual([
        'Hello',
        'World',
        'Hello',
      ]);
    });

    it('should return an empty array for no match', () => {
      const regex = new GoRegex('goodbye', 'g');
      expect(regex.findAllString('Hello World')).toEqual([]);
    });

    it('should limit the number of matches with n parameter', () => {
      const regex = new GoRegex('\\b\\w+\\b', 'g');
      expect(regex.findAllString('Hello World Hello World', 2)).toEqual([
        'Hello',
        'World',
      ]);
    });

    it('should handle non-global regexes correctly', () => {
      const regex = new GoRegex('\\b\\w+\\b'); // No 'g' flag
      expect(regex.findAllString('Hello World Hello')).toEqual(['Hello']); // Only the first match
    });

    it('should handle zero matches correctly', () => {
      const regex = new GoRegex('z', 'g');
      expect(regex.findAllString('Hello World')).toEqual([]);
    });
  });

  describe('replaceAllString', () => {
    it('should replace all matches', () => {
      const regex = new GoRegex('\\b\\w+\\b', 'g');
      expect(regex.replaceAllString('Hello World Hello', 'Goodbye')).toBe(
        'Goodbye Goodbye Goodbye',
      );
    });

    it('should handle no matches', () => {
      const regex = new GoRegex('z', 'g');
      expect(regex.replaceAllString('Hello World', 'Goodbye')).toBe(
        'Hello World',
      );
    });
  });

  describe('replaceAllStringFunc', () => {
    it('should replace all matches with function result', () => {
      const regex = new GoRegex('\\b\\w+\\b', 'g');
      const result = regex.replaceAllStringFunc('Hello World Hello', (match) =>
        match.toUpperCase(),
      );
      expect(result).toBe('HELLO WORLD HELLO');
    });

    it('should handle no matches with function', () => {
      const regex = new GoRegex('z', 'g');
      const result = regex.replaceAllStringFunc('Hello World', (match) =>
        match.toUpperCase(),
      );
      expect(result).toBe('Hello World');
    });
  });

  describe('split', () => {
    it('should split the string', () => {
      const regex = new GoRegex('\\s+');
      expect(regex.split('Hello World Hello')).toEqual([
        'Hello',
        'World',
        'Hello',
      ]);
    });

    it('should handle no delimiter', () => {
      const regex = new GoRegex('z');
      expect(regex.split('Hello World')).toEqual(['Hello World']);
    });

    it('should limit the number of splits with n parameter', () => {
      const regex = new GoRegex('\\s+');
      expect(regex.split('Hello World Hello World', 2)).toEqual([
        'Hello',
        'World Hello World',
      ]); // Correct expectation
    });
  });

  describe('findStringSubmatch', () => {
    it('should return the first match and submatches', () => {
      const regex = new GoRegex('(\\w+)@(\\w+)');
      expect(regex.findStringSubmatch('test@example.com')).toEqual(
        expect.arrayContaining(['test@example', 'test', 'example']), // Use expect.arrayContaining
      );
    });

    it('should return null for no match', () => {
      const regex = new GoRegex('(\\d+)');
      expect(regex.findStringSubmatch('test@example.com')).toBeNull();
    });
  });

  describe('quoteMeta', () => {
    it('should escape special characters', () => {
      const specialChars = '.^$*+?()[]{}|';
      const escapedChars = GoRegex.quoteMeta(specialChars);
      expect(escapedChars).toBe('\\.\\^\\$\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|');
    });
  });

  describe('compile and mustCompile', () => {
    it('should compile a valid regex', () => {
      const regex = GoRegex.compile('\\b\\w+\\b');
      expect(regex).toBeInstanceOf(GoRegex);
    });

    it('should throw an error for an invalid regex with compile', () => {
      expect(() => GoRegex.compile('(?!))')).toThrowError(
        'Invalid regular expression: Invalid regular expression',
      ); // Adjust message if needed
    });

    it('should compile a valid regex with mustCompile', () => {
      const regex = GoRegex.mustCompile('\\b\\w+\\b');
      expect(regex).toBeInstanceOf(GoRegex);
    });

    it('should throw an error for an invalid regex with mustCompile', () => {
      expect(() => GoRegex.mustCompile('(?!))')).toThrowError(
        'Invalid regular expression: Invalid regular expression',
      ); // Adjust message if needed
    });
  });
});
