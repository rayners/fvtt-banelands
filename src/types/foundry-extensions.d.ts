// Global type extensions for BaneLands module

declare global {
  interface Game {
    banelands?: {
      consumables: import('../consumables/consumable-manager').ConsumableManager;
      journeys: import('../journeys/hex-map-manager').HexMapManager;
      resourceDice: import('../consumables/resource-die-system').ResourceDieSystem;
      api: BaneLandsAPI;
    };
  }

  interface Window {
    BaneLands?: typeof game.banelands;
  }
}

interface BaneLandsAPI {
  // Resource Die System
  rollResourceDie(dieType: string): Promise<{ result: number; depleted: boolean }>;
  setResourceDie(actor: Actor, consumableType: string, dieType: string): Promise<void>;
  getResourceDie(actor: Actor, consumableType: string): string | null;

  // Journey System
  moveToHex(fromHex: string, toHex: string): Promise<{ success: boolean; mishap?: string }>;
  performQuarterDayActivity(activity: string, actor: Actor): Promise<any>;
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
