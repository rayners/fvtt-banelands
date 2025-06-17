// BaneLands - Forbidden Lands mechanics for Dragonbane
// Main module entry point

// Import styles
import '../styles/banelands.scss';

import { ConsumableManager } from './consumables/consumable-manager';
import { ResourceDieSystem } from './consumables/resource-die-system';
import { registerSettings } from './settings';
import { registerHooks } from './hooks';
import type { ConsumableId } from './types/banelands-types';

// Module information
// const MODULE_TITLE = 'BaneLands'; // For future use

class BaneLands {
  static instance: BaneLands;

  public consumables: ConsumableManager;
  public resourceDice: ResourceDieSystem;
  public ready = false;

  constructor() {
    this.consumables = ConsumableManager.getInstance();
    this.resourceDice = ResourceDieSystem.getInstance();
  }

  static getInstance(): BaneLands {
    if (!this.instance) {
      this.instance = new BaneLands();
    }
    return this.instance;
  }

  /**
   * Initialize the module
   */
  async initialize(): Promise<void> {
    // Initialize module components

    // Register settings
    registerSettings();

    // Register hooks
    registerHooks();

    // Expose API
    this.exposeAPI();

    // Module initialization complete
  }

  /**
   * Called when Foundry is ready
   */
  async onReady(): Promise<void> {
    // Foundry ready, finalize setup

    this.ready = true;

    // Initialize existing actors if needed
    await this.initializeExistingActors();

    // Setup complete
  }

  /**
   * Initialize consumables for existing actors that don't have them
   */
  private async initializeExistingActors(): Promise<void> {
    if (!game.user?.isGM) return;

    for (const actor of game.actors?.values() || []) {
      if (actor.type === 'character') {
        await this.consumables.initializeActorConsumables(actor);
      }
    }
  }

  /**
   * Expose module API
   */
  private exposeAPI(): void {
    const api = {
      // Resource Die System
      rollResourceDie: async (dieType: string): Promise<{ result: number; depleted: boolean }> => {
        if (!this.resourceDice.isValidDieType(dieType)) {
          throw new Error(`Invalid die type: ${dieType}`);
        }
        return await this.resourceDice.rollResourceDie(dieType);
      },

      setResourceDie: async (
        actor: Actor,
        consumableType: string,
        dieType: string
      ): Promise<void> => {
        if (!this.resourceDice.isValidDieType(dieType)) {
          throw new Error(`Invalid die type: ${dieType}`);
        }
        if (!['food', 'water', 'arrows', 'torches'].includes(consumableType)) {
          throw new Error(`Invalid consumable type: ${consumableType}`);
        }
        return await this.consumables.setResourceDie(
          actor,
          consumableType as ConsumableId,
          dieType
        );
      },

      getResourceDie: (actor: Actor, consumableType: string): string | null => {
        if (!['food', 'water', 'arrows', 'torches'].includes(consumableType)) {
          throw new Error(`Invalid consumable type: ${consumableType}`);
        }
        return this.consumables.getResourceDie(actor, consumableType as ConsumableId);
      },

      // Consumables
      useConsumable: async (actor: Actor, consumableType: string): Promise<boolean> => {
        if (!['food', 'water', 'arrows', 'torches'].includes(consumableType)) {
          throw new Error(`Invalid consumable type: ${consumableType}`);
        }
        return await this.consumables.useConsumable(actor, consumableType as ConsumableId);
      },

      restoreConsumable: async (
        actor: Actor,
        consumableType: string,
        amount: number
      ): Promise<void> => {
        if (!['food', 'water', 'arrows', 'torches'].includes(consumableType)) {
          throw new Error(`Invalid consumable type: ${consumableType}`);
        }
        return await this.consumables.restoreConsumable(
          actor,
          consumableType as ConsumableId,
          amount
        );
      },

      // Journey System (placeholder for future implementation)
      moveToHex: async (
        _fromHex: string,
        _toHex: string
      ): Promise<{ success: boolean; error?: string }> => {
        return { success: false, error: 'Journey system not yet implemented' };
      },

      performQuarterDayActivity: async (
        _activity: string,
        _actor: Actor
      ): Promise<{ success: boolean; error?: string }> => {
        return { success: false, error: 'Activity system not yet implemented' };
      },

      calculateTravelTime: (_fromHex: string, _toHex: string, _terrain: string): number => {
        return 0; // Travel calculation not yet implemented
      },
    };

    // Expose API globally
    game.banelands = {
      consumables: this.consumables,
      journeys: null, // Will be implemented later
      resourceDice: this.resourceDice,
      api,
    };

    // Also expose on window for external access
    window.BaneLands = game.banelands;

    // API exposed globally
  }
}

// Initialize module
const baneLands = BaneLands.getInstance();

// Register Foundry hooks
Hooks.once('init', async () => {
  await baneLands.initialize();
});

Hooks.once('ready', async () => {
  await baneLands.onReady();
});

// Export for testing
export { BaneLands };
