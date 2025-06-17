// Manager for tracking consumable resources using step-dice mechanics
// Generic implementation not tied to specific game content

import type { ConsumableId, ResourceDieType, ActorConsumables } from '../types/banelands-types';
import { ResourceDieSystem } from './resource-die-system';

export class ConsumableManager {
  private static instance: ConsumableManager;
  private resourceDieSystem: ResourceDieSystem;

  constructor() {
    this.resourceDieSystem = ResourceDieSystem.getInstance();
  }

  static getInstance(): ConsumableManager {
    if (!this.instance) {
      this.instance = new ConsumableManager();
    }
    return this.instance;
  }

  /**
   * Get consumables data for an actor
   */
  getActorConsumables(actor: Actor): ActorConsumables {
    const flags = actor.getFlag('banelands', 'consumables') as ActorConsumables;

    // Return default consumables if none set
    if (!flags) {
      return this.getDefaultConsumables();
    }

    return flags;
  }

  /**
   * Set consumables data for an actor
   */
  async setActorConsumables(actor: Actor, consumables: ActorConsumables): Promise<void> {
    await actor.setFlag('banelands', 'consumables', consumables);
  }

  /**
   * Use a consumable and roll its resource die
   */
  async useConsumable(actor: Actor, consumableType: ConsumableId): Promise<boolean> {
    const consumables = this.getActorConsumables(actor);
    const resourceDie = consumables[consumableType];

    if (resourceDie.depleted) {
      ui.notifications?.warn(`No ${consumableType} remaining!`);
      return false;
    }

    // Roll the resource die
    const rollResult = await this.resourceDieSystem.rollResourceDie(resourceDie.type);

    // If depleted, step down the die
    if (rollResult.depleted) {
      const newDieType = this.resourceDieSystem.stepDownDie(resourceDie.type);

      if (newDieType) {
        consumables[consumableType].type = newDieType;
      } else {
        consumables[consumableType].depleted = true;
      }

      await this.setActorConsumables(actor, consumables);

      if (!newDieType) {
        ui.notifications?.warn(`${actor.name}'s ${consumableType} is completely depleted!`);
      } else {
        ui.notifications?.info(
          `${actor.name}'s ${consumableType} reduced to ${newDieType.toUpperCase()}`
        );
      }
    }

    return true;
  }

  /**
   * Restore consumable resources (e.g., from foraging or purchasing)
   */
  async restoreConsumable(
    actor: Actor,
    consumableType: ConsumableId,
    units: number
  ): Promise<void> {
    const consumables = this.getActorConsumables(actor);
    const resourceDie = consumables[consumableType];

    let currentDie = resourceDie.depleted ? 'd6' : resourceDie.type;

    // Step up the die for each unit gained
    for (let i = 0; i < units; i++) {
      currentDie = this.resourceDieSystem.stepUpDie(currentDie);
    }

    consumables[consumableType] = {
      type: currentDie,
      depleted: false,
    };

    await this.setActorConsumables(actor, consumables);

    ui.notifications?.info(
      `${actor.name} restored ${units} unit(s) of ${consumableType} (now ${currentDie.toUpperCase()})`
    );
  }

  /**
   * Set a specific resource die for a consumable
   */
  async setResourceDie(
    actor: Actor,
    consumableType: ConsumableId,
    dieType: ResourceDieType
  ): Promise<void> {
    const consumables = this.getActorConsumables(actor);

    consumables[consumableType] = {
      type: dieType,
      depleted: false,
    };

    await this.setActorConsumables(actor, consumables);
  }

  /**
   * Get the current resource die for a consumable
   */
  getResourceDie(actor: Actor, consumableType: ConsumableId): ResourceDieType | null {
    const consumables = this.getActorConsumables(actor);
    const resourceDie = consumables[consumableType];

    return resourceDie.depleted ? null : resourceDie.type;
  }

  /**
   * Check if an actor has a specific consumable available
   */
  hasConsumable(actor: Actor, consumableType: ConsumableId): boolean {
    const consumables = this.getActorConsumables(actor);
    return !consumables[consumableType].depleted;
  }

  /**
   * Get total encumbrance from consumables
   */
  getConsumableEncumbrance(actor: Actor): number {
    const consumables = this.getActorConsumables(actor);
    return this.resourceDieSystem.calculateEncumbrance(consumables);
  }

  /**
   * Get default starting consumables
   */
  private getDefaultConsumables(): ActorConsumables {
    return {
      food: { type: 'd8', depleted: false },
      water: { type: 'd8', depleted: false },
      arrows: { type: 'd8', depleted: false },
      torches: { type: 'd6', depleted: false },
    };
  }

  /**
   * Initialize consumables for a new actor
   */
  async initializeActorConsumables(actor: Actor): Promise<void> {
    const existingConsumables = actor.getFlag('banelands', 'consumables');

    if (!existingConsumables) {
      await this.setActorConsumables(actor, this.getDefaultConsumables());
    }
  }

  /**
   * Get consumable display information
   */
  getConsumableDisplay(
    actor: Actor
  ): Array<{ type: ConsumableId; name: string; die: string; depleted: boolean }> {
    const consumables = this.getActorConsumables(actor);

    return [
      {
        type: 'food',
        name: 'Food',
        die: consumables.food.depleted ? 'Empty' : consumables.food.type.toUpperCase(),
        depleted: consumables.food.depleted,
      },
      {
        type: 'water',
        name: 'Water',
        die: consumables.water.depleted ? 'Empty' : consumables.water.type.toUpperCase(),
        depleted: consumables.water.depleted,
      },
      {
        type: 'arrows',
        name: 'Arrows',
        die: consumables.arrows.depleted ? 'Empty' : consumables.arrows.type.toUpperCase(),
        depleted: consumables.arrows.depleted,
      },
      {
        type: 'torches',
        name: 'Torches',
        die: consumables.torches.depleted ? 'Empty' : consumables.torches.type.toUpperCase(),
        depleted: consumables.torches.depleted,
      },
    ];
  }
}
