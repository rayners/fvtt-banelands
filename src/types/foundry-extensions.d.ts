// Global type extensions for BaneLands module

/// <reference types="@rayners/foundry-dev-tools/types/foundry-v13-essentials" />

declare global {
  // Extend Game interface for BaneLands
  interface Game {
    actors?: Collection<Actor>;
    user?: FoundryUser;
    settings: ClientSettings;
    system: System;
    banelands?: {
      consumables: import('../consumables/consumable-manager').ConsumableManager;
      journeys: null; // Will be implemented later
      resourceDice: import('../consumables/resource-die-system').ResourceDieSystem;
      api: BaneLandsAPI;
    };
  }

  // Actor type for Foundry VTT
  interface Actor {
    id: string;
    name: string;
    type: string;
    getFlag(scope: string, key: string): unknown;
    setFlag(scope: string, key: string, value: unknown): Promise<void>;
    system: Record<string, unknown>;
  }

  // Missing Foundry globals
  interface Roll {
    evaluate(): Promise<this>;
    total: number | null;
  }

  interface ChatMessage {
    id: string;
    content: string;
  }

  interface ChatMessageConstructor {
    create(data: Record<string, unknown>): Promise<ChatMessage>;
    new (): ChatMessage;
  }

  // Constants interface
  interface CONST {
    CHAT_MESSAGE_TYPES: {
      ROLL: number;
    };
  }

  interface CONFIG {
    sounds: {
      dice: string;
    };
  }

  // Global constructors and variables
  const Roll: {
    new (formula: string): Roll;
  };
  const ChatMessage: ChatMessageConstructor;
  const CONST: CONST;
  const CONFIG: CONFIG;
  const Hooks: HooksManager;
  const game: Game;
  const ui: UI;

  interface Window {
    BaneLands?: typeof game.banelands;
    $: unknown;
    jQuery: unknown;
  }

  // Global test environment variables
  const $: unknown;
  const jQuery: unknown;

  // Make global variables available to tests
  var game: Game;
  var ui: UI;
  var Hooks: HooksManager;
  var CONFIG: CONFIG;

  // Extend global object for test environment
  interface Global {
    $: unknown;
    jQuery: unknown;
    game: Game;
    ui: UI;
    Hooks: HooksManager;
    CONFIG: CONFIG;
    Actor: unknown;
    Item: unknown;
    JournalEntry: unknown;
    Dialog: unknown;
    Application: unknown;
    foundry: unknown;
  }

  // For Node.js compatibility
  var global: Global;
}

interface BaneLandsAPI {
  // Resource Die System
  rollResourceDie(dieType: string): Promise<{ result: number; depleted: boolean }>;
  setResourceDie(actor: Actor, consumableType: string, dieType: string): Promise<void>;
  getResourceDie(actor: Actor, consumableType: string): string | null;

  // Journey System
  moveToHex(fromHex: string, toHex: string): Promise<{ success: boolean; mishap?: string }>;
  performQuarterDayActivity(activity: string, actor: Actor): Promise<unknown>;
  calculateTravelTime(fromHex: string, toHex: string, terrain: string): number;

  // Consumables
  useConsumable(actor: Actor, consumableType: string): Promise<boolean>;
  restoreConsumable(actor: Actor, consumableType: string, amount: number): Promise<void>;
}

// Module-specific types
export interface ResourceDie {
  type: 'd6' | 'd8' | 'd10' | 'd12';
  current: boolean;
}

export interface ConsumableType {
  id: string;
  name: string;
  description: string;
  defaultDie: ResourceDie['type'];
  encumbrance: number;
}

export interface TerrainType {
  id: string;
  name: string;
  movement: 'open' | 'difficult' | 'impassable';
  forageModifier: number;
  huntModifier: number;
  description: string;
}

export interface QuarterDayActivity {
  id: string;
  name: string;
  description: string;
  requiredSkill?: string;
  canCombineWith?: string[];
  exclusive?: boolean;
}

export interface JourneyHex {
  id: string;
  terrain: TerrainType;
  discovered: boolean;
  notes?: string;
  pointsOfInterest?: string[];
}

export interface TravelMishap {
  id: string;
  roll: string; // e.g., "11-12"
  name: string;
  effect: string;
  severity: 'minor' | 'major' | 'severe';
}

export {};
