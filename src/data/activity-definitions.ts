// Generic activity definitions for travel and exploration
// Based on common RPG mechanics, not specific copyrighted content

import type { ActivityData } from '../types/banelands-types';

export const ACTIVITY_DEFINITIONS: Record<string, ActivityData> = {
  travel: {
    id: 'travel',
    name: 'Travel',
    description: 'Move between locations on the map',
    canCombineWith: ['keep-watch'],
    requiredSkill: 'survival',
  },

  navigate: {
    id: 'navigate',
    name: 'Navigate',
    description: 'Lead the group and find the best path forward',
    canCombineWith: ['travel'],
    exclusiveWith: ['keep-watch'],
    requiredSkill: 'survival',
  },

  'keep-watch': {
    id: 'keep-watch',
    name: 'Keep Watch',
    description: 'Stay alert for dangers and opportunities',
    canCombineWith: ['travel'],
    exclusiveWith: ['navigate'],
    requiredSkill: 'awareness',
  },

  forage: {
    id: 'forage',
    name: 'Forage',
    description: 'Search for edible plants and drinkable water',
    requiredSkill: 'survival',
  },

  hunt: {
    id: 'hunt',
    name: 'Hunt',
    description: 'Track and hunt wild animals for food',
    requiredSkill: 'survival',
    requiresEquipment: ['ranged-weapon', 'trap'],
  },

  fish: {
    id: 'fish',
    name: 'Fish',
    description: 'Catch fish from rivers or lakes',
    requiredSkill: 'survival',
    requiresEquipment: ['fishing-gear'],
  },

  'make-camp': {
    id: 'make-camp',
    name: 'Make Camp',
    description: 'Set up a safe place to rest',
    requiredSkill: 'survival',
  },

  rest: {
    id: 'rest',
    name: 'Rest',
    description: 'Recover from fatigue and minor injuries',
  },

  sleep: {
    id: 'sleep',
    name: 'Sleep',
    description: 'Get the rest needed to avoid exhaustion',
  },

  explore: {
    id: 'explore',
    name: 'Explore',
    description: 'Investigate points of interest in the current area',
    requiredSkill: 'awareness',
  },
};

export function getActivityData(activityId: string): ActivityData | null {
  return ACTIVITY_DEFINITIONS[activityId] || null;
}

export function getAllActivities(): ActivityData[] {
  return Object.values(ACTIVITY_DEFINITIONS);
}

export function getActivitiesForQuarterDay(): ActivityData[] {
  // Return activities that can be performed during a quarter-day period
  return getAllActivities();
}
