// Basic terrain types with generic fantasy descriptions
// Based on publicly available information and common RPG terrain concepts

import type { TerrainData } from '../types/banelands-types';

export const TERRAIN_DEFINITIONS: Record<string, TerrainData> = {
  'open-terrain': {
    id: 'open-terrain',
    name: 'Open Terrain',
    movement: 'open',
    forageModifier: 0,
    huntModifier: 0,
    description: 'Clear, easily traversable land such as grasslands or well-maintained roads',
    color: '#90EE90',
  },

  'difficult-terrain': {
    id: 'difficult-terrain',
    name: 'Difficult Terrain',
    movement: 'difficult',
    forageModifier: -1,
    huntModifier: -1,
    description: 'Challenging terrain that slows movement and complicates activities',
    color: '#CD853F',
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    movement: 'open',
    forageModifier: 1,
    huntModifier: 1,
    description: 'Wooded areas with abundant natural resources',
    color: '#228B22',
  },

  hills: {
    id: 'hills',
    name: 'Hills',
    movement: 'open',
    forageModifier: 0,
    huntModifier: 0,
    description: 'Rolling hills and elevated terrain',
    color: '#DEB887',
  },

  mountains: {
    id: 'mountains',
    name: 'Mountains',
    movement: 'difficult',
    forageModifier: -2,
    huntModifier: -1,
    description: 'High altitude terrain with challenging conditions',
    color: '#696969',
  },

  water: {
    id: 'water',
    name: 'Water',
    movement: 'impassable',
    forageModifier: 0,
    huntModifier: 0,
    description: 'Rivers, lakes, and other water bodies requiring boats or swimming',
    color: '#4682B4',
  },

  swamp: {
    id: 'swamp',
    name: 'Swampland',
    movement: 'difficult',
    forageModifier: 1,
    huntModifier: -1,
    description: 'Wetlands with unique challenges and opportunities',
    color: '#556B2F',
  },

  ruins: {
    id: 'ruins',
    name: 'Ruins',
    movement: 'difficult',
    forageModifier: -2,
    huntModifier: -1,
    description: 'Ancient structures and abandoned settlements',
    color: '#A0A0A0',
  },
};

export function getTerrainData(terrainId: string): TerrainData | null {
  return TERRAIN_DEFINITIONS[terrainId] || null;
}

export function getAllTerrainTypes(): TerrainData[] {
  return Object.values(TERRAIN_DEFINITIONS);
}
