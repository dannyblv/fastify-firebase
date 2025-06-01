# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-06-01
### Changed
- BREAKING: Require Fastify v5+ and fastify-plugin v5+.
- Plugin is now ESM-only (`import`/`export` syntax, `type: module`).
- Improved cert handling: supports both camelCase and snake_case keys for Firebase credentials.
- Throws clear errors for missing/invalid cert fields.
- Ensures singleton Firebase app initialization (prevents multiple initializations).
- Full TypeScript support for both cert formats.
- Async/Promise plugin signature for modern Fastify usage.
- Updated tests to ESM and improved reliability.

### Fixed
- Test runner now exits cleanly with all tests passing (no false error exit code).

## [1.1.1] - 2023-xx-xx
- Previous stable release for Fastify v4 and CommonJS.

---

For earlier changes, see commit history on GitHub.
