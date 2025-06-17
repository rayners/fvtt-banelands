# BaneLands

A Foundry VTT module that implements Forbidden Lands-inspired journey and resource mechanics for the Dragonbane system.

## Features

### Resource Die System ✅ Implemented

- **Step-Die Consumables**: Track food, water, arrows, and torches using D6-D12 resource dice
- **Automatic Depletion**: Resource dice step down on 1-2 results, becoming depleted when stepping down from D6
- **Visual Integration**: Resource dice display integrated into character sheets with use buttons
- **Configurable Defaults**: Customizable starting resource dice for each consumable type

### Journey System 🚧 Planned

- **Hex-Based Travel**: Navigate using hexagonal maps with varied terrain types
- **Quarter-Day Activities**: Choose activities for Morning, Day, Evening, and Night periods
- **Travel Roles**: Assign pathfinder and lookout roles for group travel
- **Mishap Tables**: Dynamic complications based on terrain and activity choices

### Dragonbane Integration

- **System Compatibility**: Designed specifically for the Dragonbane game system
- **Skill Adaptation**: Maps Forbidden Lands mechanics to Dragonbane skills and abilities
- **Character Sheet Integration**: Seamlessly adds resource tracking to existing character sheets

## Installation

### Option 1: Manual Installation (Pre-Registry)

1. Download the latest release from GitHub
2. Extract to your Foundry `Data/modules` directory
3. Enable the module in your world's Module Management

### Option 2: Module Browser (Coming Soon)

BaneLands will be available through Foundry's module browser once it reaches stable release.

## Quick Start

1. **Enable the Module**: Activate BaneLands in your world's module settings
2. **Character Setup**: New characters automatically receive starting resource dice (D8 for food/water/arrows, D6 for torches)
3. **Using Resources**: Click "Use" buttons on character sheets to roll resource dice and track depletion
4. **Restoring Resources**: Use the module API or manual adjustment to restore resources from foraging, purchasing, etc.

## Usage

### Resource Die Management

Each character tracks four types of consumable resources:

- **Food**: Sustenance for daily meals
- **Water**: Drinking water and hydration
- **Arrows**: Ammunition for ranged weapons
- **Torches**: Light sources for exploration

Resource dice start at configurable levels (default D8 for most, D6 for torches) and step down when depleted:

- D12 → D10 → D8 → D6 → Empty
- Roll 1-2 on usage: die steps down one level
- Roll 3+ on usage: no change

### API Usage

```javascript
// Use a consumable (automatically rolls and handles depletion)
await game.banelands.api.useConsumable(actor, 'food');

// Restore consumable units (from foraging, purchasing, etc.)
await game.banelands.api.restoreConsumable(actor, 'water', 2);

// Set specific resource die
await game.banelands.api.setResourceDie(actor, 'arrows', 'd10');

// Check current resource die
const currentDie = game.banelands.api.getResourceDie(actor, 'torches');
```

## Configuration

Access module settings through Foundry's Module Settings interface:

- **Auto-Initialize Consumables**: Automatically set up resource dice for new characters
- **Default Resource Dice**: Configure starting die types for each consumable
- **Dragonbane Integration**: Settings for system-specific features
- **Debug Mode**: Enable detailed logging for troubleshooting

## Compatibility

- **Required**: Foundry VTT v13+
- **Recommended**: Dragonbane game system
- **Optional**: Journeys & Jamborees module (planned integration)

## Roadmap

### Phase 1: Resource Management ✅ Complete

- Resource die system implementation
- Character sheet integration
- Basic API and settings

### Phase 2: Journey System 🚧 In Development

- Hex-based map system
- Quarter-day activity management
- Travel and exploration mechanics

### Phase 3: Advanced Features 📋 Planned

- Mishap and encounter tables
- Weather and season effects
- Enhanced Dragonbane integration

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Build the module
npm run build

# Run tests
npm test

# Development with auto-rebuild
npm run dev
```

### Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## Legal and Licensing

### License

This module is licensed under the MIT License. See [LICENSE](LICENSE) for details.

### Third-Party Content

BaneLands implements generic fantasy RPG mechanics inspired by survival and exploration themes. It does not include any copyrighted content from Forbidden Lands or other published works.

### Foundry VTT Compatibility

This module is designed for Foundry Virtual Tabletop and requires a valid Foundry VTT license.

## Support

- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/rayners/fvtt-banelands/issues)
- **Documentation**: Full documentation available at [docs.rayners.dev/banelands](https://docs.rayners.dev/banelands)
- **Discord**: Find help in the Foundry VTT community Discord

## Credits

- **Developer**: David Raynes ([@rayners](https://github.com/rayners))
- **Inspiration**: Forbidden Lands by Free League Publishing
- **Game System**: Dragonbane by Free League Publishing
- **Platform**: Foundry Virtual Tabletop

---

_BaneLands is an independent module and is not affiliated with or endorsed by Free League Publishing or Foundry Gaming LLC._
