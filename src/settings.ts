// Module settings configuration

const MODULE_ID = 'banelands';

export function registerSettings(): void {
  // Enable/disable resource die automation
  game.settings.register(MODULE_ID, 'autoInitializeConsumables', {
    name: 'Auto-Initialize Consumables',
    hint: 'Automatically set up resource dice for new characters',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  // Default starting resource dice
  game.settings.register(MODULE_ID, 'defaultFoodDie', {
    name: 'Default Food Resource Die',
    hint: 'Starting resource die for food',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      d6: 'D6',
      d8: 'D8',
      d10: 'D10',
      d12: 'D12',
    },
    default: 'd8',
  });

  game.settings.register(MODULE_ID, 'defaultWaterDie', {
    name: 'Default Water Resource Die',
    hint: 'Starting resource die for water',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      d6: 'D6',
      d8: 'D8',
      d10: 'D10',
      d12: 'D12',
    },
    default: 'd8',
  });

  game.settings.register(MODULE_ID, 'defaultArrowsDie', {
    name: 'Default Arrows Resource Die',
    hint: 'Starting resource die for arrows',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      d6: 'D6',
      d8: 'D8',
      d10: 'D10',
      d12: 'D12',
    },
    default: 'd8',
  });

  game.settings.register(MODULE_ID, 'defaultTorchesDie', {
    name: 'Default Torches Resource Die',
    hint: 'Starting resource die for torches',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      d6: 'D6',
      d8: 'D8',
      d10: 'D10',
      d12: 'D12',
    },
    default: 'd6',
  });

  // Journey system settings (for future implementation)
  game.settings.register(MODULE_ID, 'enableJourneySystem', {
    name: 'Enable Journey System',
    hint: 'Enable hex-based travel and exploration mechanics',
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register(MODULE_ID, 'hexSize', {
    name: 'Hex Size (km)',
    hint: 'Size of each hex in kilometers for travel calculations',
    scope: 'world',
    config: true,
    type: Number,
    default: 10,
    range: {
      min: 1,
      max: 50,
      step: 1,
    },
  });

  // Integration settings
  game.settings.register(MODULE_ID, 'integrateWithJourneys', {
    name: 'Integrate with Journeys & Jamborees',
    hint: 'Enable integration with the Journeys & Jamborees module if available',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  // Debug settings
  game.settings.register(MODULE_ID, 'debugMode', {
    name: 'Debug Mode',
    hint: 'Enable debug logging for troubleshooting',
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  });
}
