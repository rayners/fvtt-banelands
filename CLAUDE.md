# BaneLands

## Project Overview
**BaneLands** is a Foundry VTT module that implements Forbidden Lands-inspired journey and resource mechanics for the Dragonbane system. The module focuses on generic survival and exploration mechanics without using copyrighted content.

## Key Constraints and Guidelines

### Legal Compliance
- **No Copyrighted Content**: Use only publicly available mechanics concepts
- **Generic Implementation**: Focus on common RPG survival mechanics (step-dice, hex travel, etc.)
- **Inspiration Only**: Draw concepts from FL without copying specific text, tables, or artwork
- **Public Sources**: Reference only what's available through open systems or SRD-style content

## Development Commands

### Pre-Commit Requirement
- **Always run `npm run validate` before committing** — runs lint, format, typecheck, tests, and build
- CI failures from untested commits waste time; validate locally first

```bash
npm run build         # Production build (Rollup)
npm run dev           # Watch mode with dev server
npm run watch         # Watch and rebuild
npm run lint          # ESLint check
npm run lint:fix      # Auto-fix lint issues
npm run format        # Prettier formatting
npm run typecheck     # TypeScript type checking
npm test              # Vitest watch mode
npm run test:run      # Run all tests once (use before commits)
npm run test:coverage # Coverage report
npm run validate      # Full pipeline: lint + format + typecheck + test + build
```

## Current Status: Phase 1 Complete

Resource Die System is implemented:
- Step-die mechanics (D12→D10→D8→D6→Empty, depletion on 1-2)
- Four consumable types: food, water, arrows, torches
- Actor integration with flag storage and character sheet hooks
- API exposed via `game.banelands.api`

Future phases: Journey System (hex travel, quarter-day activities, terrain effects)
and Advanced Features (mishap tables, J&J integration).

## Development Patterns

### Code Organization
- **Modular Architecture**: Separate classes for each major system
- **Type Safety**: Comprehensive TypeScript throughout
- **Singleton Patterns**: Manager classes use getInstance() pattern
- **Flag-Based Storage**: Actor flags for persistent data storage

### Architecture

```
src/
├── module.ts                          # Main entry and API exposure
├── consumables/
│   ├── resource-die-system.ts         # Step-die mechanics
│   └── consumable-manager.ts          # Actor consumable tracking
├── dragonbane-integration/            # Dragonbane system-specific hooks (scaffolded)
├── journeys/                          # Journey system (scaffolded)
│   ├── activities/                    # Quarter-day travel activities
│   └── mishaps/                       # Journey mishap tables
├── settings.ts                        # Module configuration
├── hooks.ts                           # Foundry hook registration
├── types/
│   ├── foundry-extensions.d.ts        # Global type extensions
│   └── banelands-types.d.ts           # Module-specific types
├── ui/                                # UI components (scaffolded)
└── data/
    ├── terrain-definitions.ts         # Generic terrain types
    └── activity-definitions.ts        # Travel activity definitions
```

## Key Technical Decisions

### Resource Die Implementation
- **Step-Die Sequence**: D12→D10→D8→D6→Empty (industry standard)
- **Depletion Rule**: 1-2 on die triggers step-down (common mechanic)
- **Flag Storage**: `actor.flags.banelands.consumables` for persistence
- **UI Integration**: Hook-based sheet enhancement rather than custom sheets

### Dragonbane AppV2 Integration
- **Target**: Dragonbane 3.0.3+ (uses `HandlebarsApplicationMixin(ActorSheetV2)`)
- **Hook**: `renderDoDCharacterSheet` (class-based AppV2 hook, NOT `renderActorSheet`)
- **Hook signature**: `(app, element: HTMLElement, context, options)` — native DOM, no jQuery
- **DOM safe**: AppV2 `_replaceHTML` fully replaces part HTML before hooks fire, so `insertAdjacentHTML` in hooks does not cause duplication on re-render
- **Inventory selector**: `.tab[data-group="primary"][data-tab="inventory"]`
- **Insertion point**: After first `.derived-stat-box` (currency section) in inventory tab

### module.json Relationships
- `relationships.systems[].type` = package type (`"system"`), NOT dependency strength
- `relationships.modules[].type` = package type (`"module"`), NOT `"optional"`/`"required"`
- Foundry uses the array key (`systems`, `requires`) to express dependency nature

## Known Considerations

### ESLint Configuration
- Shared config from `@rayners/foundry-dev-tools` sets `parserOptions.project: true` which resolves `tsconfig.json` relative to `node_modules`
- Local `eslint.config.js` must override with explicit `project: './tsconfig.json'` and `tsconfigRootDir: import.meta.dirname`

### Registry Configuration
- `@rayners/foundry-dev-tools` is published to **public npm**, not GitHub Packages
- `.npmrc` should NOT have `@rayners:registry=https://npm.pkg.github.com`
- If registry changes are needed, regenerate `package-lock.json` (`rm package-lock.json && npm install`)

### Legal Compliance
- All mechanics are generic fantasy RPG concepts
- No specific Forbidden Lands text or tables included
- Terrain and activity names use common fantasy terminology
- Implementation inspired by, not copied from, published works
