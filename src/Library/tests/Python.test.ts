import { PythonRegex } from '../Python';

describe('PythonRegex', () => {
  it('should handle simple matching', () => {
    const re = new PythonRegex('abc');
    expect(re.match('abcdef')).not.toBeNull();
    expect(re.match('abcdef')![0]).toBe('abc');
    expect(re.match('defabc')).toBeNull();
  });

  it('should handle search', () => {
    const re = new PythonRegex('abc');
    expect(re.search('abcdef')).not.toBeNull();
    expect(re.search('abcdef')![0]).toBe('abc');
    expect(re.search('defabc')).not.toBeNull();
    expect(re.search('defabc')![0]).toBe('abc');
    expect(re.search('ac')).toBeNull();
  });

  it('should handle findall', () => {
    const re = new PythonRegex('ab*');
    expect(re.findall('abbcdeab')).toEqual(['abb', 'ab']);
    const re2 = new PythonRegex('ab*', 'g');
    expect(re2.findall('abbcdeab')).toEqual(['abb', 'ab']);
    const re3 = new PythonRegex('xyz');
    expect(re3.findall('abbcdeab')).toEqual([]);
  });

  it('should handle finditer', () => {
    const re = new PythonRegex('a(b*)', 'g');
    const matches = Array.from(re.finditer('abbcdeab'));
    expect(matches.length).toBe(2);
    expect(matches[0][0]).toBe('abb');
    expect(matches[0][1]).toBe('bb');
    expect(matches[0].index).toBe(0);
    expect(matches[1][0]).toBe('ab');
    expect(matches[1][1]).toBe('b');
    expect(matches[1].index).toBe(6);

    const re2 = new PythonRegex('a(b*)');
    const matches2 = Array.from(re2.finditer('abbcdeab'));
    expect(matches2.length).toBe(2);
    expect(matches2[0][0]).toBe('abb');
    expect(matches2[0][1]).toBe('bb');
    expect(matches2[0].index).toBe(0);

    const re3 = new PythonRegex('xyz', 'g');
    const matches3 = Array.from(re3.finditer('abbcdeab'));
    expect(matches3.length).toBe(0);
  });

  it('should handle fullmatch', () => {
    const re = new PythonRegex('abc');
    expect(re.fullmatch('abc')).not.toBeNull();
    expect(re.fullmatch('abcdef')).toBeNull();
    expect(re.fullmatch('defabc')).toBeNull();
  });

  it('should handle split', () => {
    const re = new PythonRegex(',');
    expect(re.split('a,b,c')).toEqual(['a', 'b', 'c']);
    expect(re.split('a,b,c', 1)).toEqual(['a', 'b,c']);
    expect(re.split('a,b,c', 0)).toEqual(['a,b,c']);
    const re2 = new PythonRegex('test');
    const text7 = 'this is a test string test test';
    expect(re2.split(text7)).toEqual(['this is a ', ' string ', ' ']);
    const text6 = 'this is a test string';
    expect(re2.split(text6, 1)).toEqual(['this is a ', ' string']);
    const re3 = new PythonRegex(' ');
    expect(re3.split('a b c')).toEqual(['a', 'b', 'c']);
  });

  it('should handle sub', () => {
    const re = new PythonRegex('test');
    expect(re.sub('replaced', 'this is a test string')).toBe(
      'this is a replaced string',
    );
    expect(re.sub('replaced', 'this is a test string test', 1)).toBe(
      'this is a replaced string test',
    );
    expect(re.sub('replaced', 'this is a test string test', 2)).toBe(
      'this is a replaced string replaced',
    );
    const re2 = new PythonRegex('test');
    const text9 = 'this is a test string test test';
    expect(re2.sub('replaced', text9)).toEqual(
      'this is a replaced string replaced replaced',
    );
    const text8 = 'this is a test string test test';
    expect(re2.sub('replaced', text8, 2)).toEqual(
      'this is a replaced string replaced test',
    );
  });

  it('should handle flags', () => {
    const re = new PythonRegex('abc', 'i');
    expect(re.match('ABC')).not.toBeNull();
    expect(re.match('AbC')![0]).toBe('AbC');
    expect(re.search('ABC')).not.toBeNull();
    expect(re.search('ABC')![0]).toBe('ABC');
    expect(re.fullmatch('ABC')).not.toBeNull();

    const re2 = new PythonRegex('^abc$', 'im');
    expect(re2.match('ABC\n')).not.toBeNull();
    expect(re2.search('test\nABC\ntest')).not.toBeNull();
  });

  it('should handle empty pattern', () => {
    const re = new PythonRegex('');
    expect(re.match('abc')).not.toBeNull(); // Matches at the beginning
    expect(re.findall('abc')).toEqual(['', '', '', '']);
    expect(Array.from(re.finditer('abc')).length).toBe(4);
    expect(re.split('abc')).toEqual(['', 'a', 'b', 'c']);
    expect(re.sub('x', 'abc')).toBe('xaxbxc');
    expect(re.fullmatch('')).not.toBeNull();
    expect(re.search('abc')).not.toBeNull();
  });

  it('should handle special characters in pattern', () => {
    const re = new PythonRegex('\\d+'); // Matches one or more digits
    expect(re.match('123')).not.toBeNull();
    expect(re.match('abc')).toBeNull();
  });

  it('should handle unicode flag', () => {
    const re = new PythonRegex('üöä', 'u');
    expect(re.match('üöä')).not.toBeNull();
  });
});
