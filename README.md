# universal-regex-handler (beta)

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/tyrog07/universal-regex-handler/blob/HEAD/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/universal-regex-handler/latest.svg)](https://www.npmjs.com/package/universal-regex-handler)
[![npm downloads](https://img.shields.io/npm/dm/universal-regex-handler.svg)](https://www.npmjs.com/package/universal-regex-handler)
[![Checks](https://github.com/tyrog07/universal-regex-handler/actions/workflows/test.yml/badge.svg)](https://github.com/tyrog07/universal-regex-handler/actions/workflows/test.yml)
[![Build](https://github.com/tyrog07/universal-regex-handler/actions/workflows/build.yml/badge.svg)](https://github.com/tyrog07/universal-regex-handler/actions/workflows/build.yml)
[![CI](https://github.com/tyrog07/universal-regex-handler/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/tyrog07/universal-regex-handler/actions/workflows/CI.yml)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=universal-regex-handler&query=$.install.pretty&label=install%20size&style=flat-square)](https://packagephobia.now.sh/result?p=universal-regex-handler)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/universal-regex-handler?style=flat-square)](https://bundlephobia.com/package/universal-regex-handler@latest)
[![Known Vulnerabilities](https://snyk.io/test/npm/universal-regex-handler/badge.svg)](https://snyk.io/test/npm/universal-regex-handler)

</div>

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [License](#license)

## Introduction

A JavaScript/TypeScript package providing wrapper classes around regular expression functionality, mimicking the behavior of regex engines in other languages like Go, Java, and Python. This package offers classes (`GoRegex`, `JavaRegex`, `PythonRegex`) that handle raw strings, inline flags, Unicode, and provide methods for matching, searching, replacing, splitting, and more.

## Installation

```bash
npm install universal-regex-handler
```

or

```bash
yarn add universal-regex-handler
```

## Usage

```bash
import { GoRegex, JavaRegex, PythonRegex } from 'regex-wrapper';

# GoRegex Example (mimicking Go's regexp package)
const goRegex = new GoRegex(`\\b\\w+\\b`, 'i'); // Raw string and case-insensitive
const goText = "Hello World! hello world!";
const goMatches = goRegex.findAllString(goText);
console.log("Go Matches:", goMatches); // Output: [ 'Hello', 'World', 'hello', 'world' ]

# JavaRegex Example (handling inline flags like Java)
const javaRegex = new JavaRegex("(?i)Hello"); // Inline case-insensitive flag
const javaText = "Hello World! hello world!";
const javaMatch = javaRegex.match(javaText);
console.log("Java Match:", javaMatch); // Output: ['Hello', index: 0, input: 'Hello World! hello world!', groups: undefined]


# PythonRegex Example (mimicking Python's re module)
const pythonRegex = new PythonRegex(r"\b\w+\b", 'i'); // Raw string and case-insensitive
const pythonText = "Hello World! hello world!";
const pythonMatches = pythonRegex.findall(pythonText);
console.log("Python Matches:", pythonMatches); // Output: [ 'Hello', 'World', 'hello', 'world' ]

// and many more methods are available...
```

## API

### `JavaRegex`

Handles inline flags like Java's regex.

- `constructor(pattern: string)`: Creates a new JavaRegex instance.
- `getPattern(): string`: Gets the original pattern (including inline flags).
- `match(str: string): RegExpMatchArray | null`: Tests if a string matches.
- `replace(str: string, replacement: string): string`: Replaces all matches.
- `search(str: string): number`: Searches for a match and returns the index.

### `GoRegex`

Mimics Go's regexp package.

- `constructor(pattern: string, flags: string = "")`: Creates a new GoRegex instance. Use backticks (`) for raw strings.
- `matchString(str: string): boolean`: Checks if the string contains a match.
- `findString(str: string): string`: Finds the first match.
- `findAllString(str: string, n: number = -1): string[]`: Finds all matches.
- `replaceAllString(str: string, replacement: string): string`: Replaces all matches.
- `replaceAllStringFunc(str: string, replacerFunc: (match: string, ...args: any[]) => string): string`: Replaces all matches using a function.
- `split(str: string, n: number = -1): string[]`: Splits the string.
- `findStringSubmatch(str: string): RegExpExecArray | null`: Finds the first match and submatches.
- `static quoteMeta(str: string): string`: Escapes special regex characters.
- `static compile(pattern: string, flags: string = ""): GoRegex`: Compiles a regex (throws error on invalid pattern).
- `static mustCompile(pattern: string, flags: string = ""): GoRegex`: Compiles a regex (panics on invalid pattern).

### `PythonRegex`

Mimics Python's re module.

- `constructor(pattern: string, flags: string = '')`: Creates a new PythonRegex instance.
- `match(text: string): RegExpMatchArray | null`: Matches at the beginning of the string.
- `search(text: string): RegExpMatchArray | null`: Searches for the first occurrence.
- `findall(text: string): string[]`: Finds all non-overlapping matches.
- `finditer(text: string): IterableIterator<RegExpExecArray>`: Returns an iterator yielding match objects.
- `fullmatch(text: string): RegExpMatchArray | null`: Matches the entire string.
- `split(text: string, maxsplit: number = -1): string[]`: Splits the string.
- `sub(repl: string, text: string, count: number = 0): string`: Replaces occurrences of the pattern.

### Flags

The `flags` parameter is a string that can contain one or more of the following characters:

- `i`: Case-insensitive matching.
- `g`: Global match (find all occurrences).
- `m`: Multiline mode (^ and $ match start/end of lines).
- `s`: Dotall mode (dot . matches newline characters).
- `u`: Unicode mode (for correct Unicode handling).
- `y`: Sticky mode (matches at the current position). (Note: Sticky mode is supported but not thoroughly tested across all methods.)

### Raw Strings

Use backticks (`) to define raw strings, which prevent backslashes from being interpreted as escape sequences. This is highly recommended for regular expressions to avoid confusion and errors.

### Backreferences

Go's RE2 engine (and thus the `GoRegex` class) does not support backreferences. A warning will be logged if you attempt to use backreferences in your patterns. Java and Python regex engines have varying support for backreferences. Please consult the documentation for JavaScript's RegExp for more details on backreference support.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/tyrog07/universal-regex-handler/blob/HEAD/LICENSE).
