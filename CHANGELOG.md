# Changelog

All notable changes to the BaneLands module will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned

- Hex-based journey system with terrain types
- Quarter-day activity management
- Travel roles (pathfinder, lookout, quartermaster)
- Mishap and encounter tables
- Enhanced Dragonbane system integration
- Journeys & Jamborees module integration

## [0.1.1] - 2026-03-14

### Changed

- Release workflow now extracts version-specific notes from CHANGELOG.md
- Release workflow notifies Foundry Package Registry after publishing
- Cleaned up CHANGELOG.md to remove internal development notes

## [0.1.0] - 2026-03-14

### Changed

- Migrated character sheet hooks to Dragonbane AppV2 (compatible with Dragonbane 3.x)
- Updated CI to Node 22 and foundry-module-actions v6
- Switched to public npm registry for dependencies

## [0.0.1] - 2025-01-17

### Added

- Initial alpha release with core resource die functionality
- Resource die system for tracking consumables (food, water, arrows, torches)
- Step-die mechanics (D6→D8→D10→D12) with automatic depletion on 1-2 results
- Character sheet integration for Dragonbane system in inventory tab
- Clickable die labels for rolling and dropdown controls for manual adjustment
- Unicode symbols for die type visualization (⬛ ◆ 🔸 🔹)
- Module settings for configurable default resource dice
- Automated resource initialization for new characters
- Chat integration showing roll results and depletion warnings

### Technical Features

- TypeScript implementation with comprehensive type definitions
- Unit test suite with 100% pass rate (14/14 tests)
- Build system using Rollup and foundry-dev-tools
- ESLint and Prettier code quality enforcement
- API exposure for external module integration (`game.banelands.api`)
- Debug mode and logging system
- SCSS styling integrated with Dragonbane's derived-stat tables

### Documentation

- Comprehensive README with installation and usage instructions
- MIT license and contributor guidelines
- GitHub issue templates for bug reports and feature requests
- Complete npm script pipeline for development and CI/CD
