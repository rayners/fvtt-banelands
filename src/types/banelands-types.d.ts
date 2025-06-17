// BaneLands-specific type definitions

export type ResourceDieType = 'd6' | 'd8' | 'd10' | 'd12';

export type ConsumableId = 'food' | 'water' | 'arrows' | 'torches';

export type TerrainId =
  | 'open-terrain'
  | 'difficult-terrain'
  | 'water'
  | 'swamp'
  | 'plains'
  | 'forest'
  | 'dark-forest'
  | 'hills'
  | 'mountains'
  | 'high-mountains'
  | 'lake-river'
  | 'marshlands'
  | 'quagmire'
  | 'ruins';

export type QuarterDay = 'morning' | 'day' | 'evening' | 'night';

export type ActivityId =
  | 'travel'
  | 'navigate'
  | 'hike'
  | 'lead-the-way'
  | 'keep-watch'
  | 'forage'
  | 'hunt'
  | 'fish'
  | 'make-camp'
  | 'rest'
  | 'sleep'
  | 'explore';

export type MovementType = 'open' | 'difficult' | 'impassable';

export interface ConsumableData {
  id: ConsumableId;
  name: string;
  description: string;
  defaultDie: ResourceDieType;
  encumbrance: number;
  category: 'sustenance' | 'equipment';
}

export interface TerrainData {
  id: TerrainId;
  name: string;
  movement: MovementType;
  forageModifier: number;
  huntModifier: number;
  description: string;
  color?: string; // For hex map display
}

export interface ActivityData {
  id: ActivityId;
  name: string;
  description: string;
  requiredSkill?: string;
  canCombineWith?: ActivityId[];
  exclusiveWith?: ActivityId[];
  requiresEquipment?: string[];
}

export interface MishapTableEntry {
  roll: string; // e.g., "11-12", "33-34"
  name: string;
  effect: string;
  severity: 'minor' | 'major' | 'severe';
}

export interface HexCoordinate {
  q: number; // Column (axial coordinates)
  r: number; // Row (axial coordinates)
}

export interface HexData {
  coordinate: HexCoordinate;
  terrain: TerrainId;
  discovered: boolean;
  visited: boolean;
  notes?: string;
  pointsOfInterest?: string[];
  encounters?: string[];
}

export interface JourneyProgress {
  currentHex: HexCoordinate;
  targetHex?: HexCoordinate;
  quarterDay: QuarterDay;
  dayNumber: number;
  activities: {
    quarterDay: QuarterDay;
    activity: ActivityId;
    actor?: string; // Actor ID
    result?: any;
  }[];
}

export interface ResourceDieState {
  type: ResourceDieType;
  depleted: boolean;
}

export interface ActorConsumables {
  food: ResourceDieState;
  water: ResourceDieState;
  arrows: ResourceDieState;
  torches: ResourceDieState;
}

export interface TravelRoll {
  skill: string;
  result: number;
  success: boolean;
  mishap?: MishapTableEntry;
}

export interface ActivityResult {
  success: boolean;
  description: string;
  resourcesGained?: {
    type: ConsumableId;
    amount: number;
  }[];
  resourcesLost?: {
    type: ConsumableId;
    amount: number;
  }[];
  damage?: {
    attribute: string;
    amount: number;
  };
  conditions?: string[];
  mishap?: MishapTableEntry;
}

// Foundry document flag structure for BaneLands
export interface BaneLandsActorFlags {
  consumables?: ActorConsumables;
  journeyRole?: 'pathfinder' | 'lookout' | 'none';
  travelExperience?: number;
}

export interface BaneLandsSceneFlags {
  hexMap?: {
    hexSize: number; // in pixels
    hexes: Record<string, HexData>; // key is "q,r" coordinate string
    journey?: JourneyProgress;
  };
}
