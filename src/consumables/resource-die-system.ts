// Generic resource die system for tracking consumable resources
// Based on step-die mechanics common in many RPG systems

import type { ResourceDieType, ResourceDieState } from '../types/banelands-types';

export class ResourceDieSystem {
  private static instance: ResourceDieSystem;

  static getInstance(): ResourceDieSystem {
    if (!this.instance) {
      this.instance = new ResourceDieSystem();
    }
    return this.instance;
  }

  /**
   * Roll a resource die and determine if it depletes
   * @param dieType The type of die to roll (d6, d8, d10, d12)
   * @returns Object with roll result and depletion status
   */
  async rollResourceDie(dieType: ResourceDieType): Promise<{ result: number; depleted: boolean }> {
    this.getDieSize(dieType); // Validate die type
    const roll = await new Roll(`1${dieType}`).evaluate();
    const result = roll.total || 1;

    // Resource depletes on 1-2 (common step-die mechanic)
    const depleted = result <= 2;

    // Display the roll to chat
    await this.displayResourceRoll(dieType, result, depleted);

    return { result, depleted };
  }

  /**
   * Step down a resource die (reduce by one step)
   * @param currentDie Current die type
   * @returns New die type, or null if fully depleted
   */
  stepDownDie(currentDie: ResourceDieType): ResourceDieType | null {
    const sequence: ResourceDieType[] = ['d12', 'd10', 'd8', 'd6'];
    const currentIndex = sequence.indexOf(currentDie);

    if (currentIndex === -1 || currentIndex === sequence.length - 1) {
      return null; // Fully depleted
    }

    return sequence[currentIndex + 1] as ResourceDieType;
  }

  /**
   * Step up a resource die (increase by one step)
   * @param currentDie Current die type
   * @returns New die type, or d12 if already at maximum
   */
  stepUpDie(currentDie: ResourceDieType): ResourceDieType {
    const sequence: ResourceDieType[] = ['d6', 'd8', 'd10', 'd12'];
    const currentIndex = sequence.indexOf(currentDie);

    if (currentIndex === -1 || currentIndex === sequence.length - 1) {
      return 'd12'; // Maximum
    }

    return sequence[currentIndex + 1] as ResourceDieType;
  }

  /**
   * Get the numeric size of a die
   */
  private getDieSize(dieType: ResourceDieType): number {
    switch (dieType) {
      case 'd6':
        return 6;
      case 'd8':
        return 8;
      case 'd10':
        return 10;
      case 'd12':
        return 12;
      default:
        return 6;
    }
  }

  /**
   * Display the resource die roll result in chat
   */
  private async displayResourceRoll(
    dieType: ResourceDieType,
    result: number,
    depleted: boolean
  ): Promise<void> {
    const content = `
      <div class="banelands-resource-roll">
        <h3>Resource Die Roll</h3>
        <div class="roll-result">
          <span class="die">${dieType.toUpperCase()}</span>
          <span class="result">${result}</span>
        </div>
        ${depleted ? '<div class="depletion-warning"><strong>Resource Depleted!</strong></div>' : ''}
      </div>
    `;

    await ChatMessage.create({
      content,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      sound: CONFIG.sounds.dice,
    });
  }

  /**
   * Create a new resource die state
   */
  createResourceDie(type: ResourceDieType): ResourceDieState {
    return {
      type,
      depleted: false,
    };
  }

  /**
   * Check if a die type is valid
   */
  isValidDieType(dieType: string): dieType is ResourceDieType {
    return ['d6', 'd8', 'd10', 'd12'].includes(dieType);
  }

  /**
   * Get the display name for a die type
   */
  getDieDisplayName(dieType: ResourceDieType): string {
    return dieType.toUpperCase();
  }

  /**
   * Calculate encumbrance for resource dice
   * Each resource type counts as 1 encumbrance regardless of die size
   */
  calculateEncumbrance(resourceDice: Record<string, ResourceDieState>): number {
    return Object.values(resourceDice).filter(die => !die.depleted).length;
  }
}
