import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ResourceDieSystem } from '../src/consumables/resource-die-system';

describe('ResourceDieSystem', () => {
  let resourceDieSystem: ResourceDieSystem;

  beforeEach(() => {
    resourceDieSystem = ResourceDieSystem.getInstance();
    vi.clearAllMocks();
  });

  describe('stepDownDie', () => {
    it('should step down d12 to d10', () => {
      const result = resourceDieSystem.stepDownDie('d12');
      expect(result).toBe('d10');
    });

    it('should step down d10 to d8', () => {
      const result = resourceDieSystem.stepDownDie('d10');
      expect(result).toBe('d8');
    });

    it('should step down d8 to d6', () => {
      const result = resourceDieSystem.stepDownDie('d8');
      expect(result).toBe('d6');
    });

    it('should return null when stepping down d6 (fully depleted)', () => {
      const result = resourceDieSystem.stepDownDie('d6');
      expect(result).toBeNull();
    });
  });

  describe('stepUpDie', () => {
    it('should step up d6 to d8', () => {
      const result = resourceDieSystem.stepUpDie('d6');
      expect(result).toBe('d8');
    });

    it('should step up d8 to d10', () => {
      const result = resourceDieSystem.stepUpDie('d8');
      expect(result).toBe('d10');
    });

    it('should step up d10 to d12', () => {
      const result = resourceDieSystem.stepUpDie('d10');
      expect(result).toBe('d12');
    });

    it('should keep d12 at maximum when stepping up', () => {
      const result = resourceDieSystem.stepUpDie('d12');
      expect(result).toBe('d12');
    });
  });

  describe('isValidDieType', () => {
    it('should return true for valid die types', () => {
      expect(resourceDieSystem.isValidDieType('d6')).toBe(true);
      expect(resourceDieSystem.isValidDieType('d8')).toBe(true);
      expect(resourceDieSystem.isValidDieType('d10')).toBe(true);
      expect(resourceDieSystem.isValidDieType('d12')).toBe(true);
    });

    it('should return false for invalid die types', () => {
      expect(resourceDieSystem.isValidDieType('d4')).toBe(false);
      expect(resourceDieSystem.isValidDieType('d20')).toBe(false);
      expect(resourceDieSystem.isValidDieType('invalid')).toBe(false);
    });
  });

  describe('createResourceDie', () => {
    it('should create a resource die with correct type and not depleted', () => {
      const resourceDie = resourceDieSystem.createResourceDie('d8');
      expect(resourceDie.type).toBe('d8');
      expect(resourceDie.depleted).toBe(false);
    });
  });

  describe('getDieDisplayName', () => {
    it('should return uppercase die names', () => {
      expect(resourceDieSystem.getDieDisplayName('d6')).toBe('D6');
      expect(resourceDieSystem.getDieDisplayName('d8')).toBe('D8');
      expect(resourceDieSystem.getDieDisplayName('d10')).toBe('D10');
      expect(resourceDieSystem.getDieDisplayName('d12')).toBe('D12');
    });
  });

  describe('calculateEncumbrance', () => {
    it('should count non-depleted resources', () => {
      const resourceDice = {
        food: { type: 'd8' as const, depleted: false },
        water: { type: 'd6' as const, depleted: false },
        arrows: { type: 'd10' as const, depleted: true },
        torches: { type: 'd12' as const, depleted: false },
      };

      const encumbrance = resourceDieSystem.calculateEncumbrance(resourceDice);
      expect(encumbrance).toBe(3); // food, water, torches (arrows depleted)
    });

    it('should return 0 for all depleted resources', () => {
      const resourceDice = {
        food: { type: 'd8' as const, depleted: true },
        water: { type: 'd6' as const, depleted: true },
      };

      const encumbrance = resourceDieSystem.calculateEncumbrance(resourceDice);
      expect(encumbrance).toBe(0);
    });
  });
});
