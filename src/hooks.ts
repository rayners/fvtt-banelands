// Foundry VTT hook registrations

import type { ConsumableId } from './types/banelands-types';

const MODULE_ID = 'banelands';

export function registerHooks(): void {
  // Actor creation hook - initialize consumables for new characters
  Hooks.on('createActor', async (actor: Actor) => {
    if (actor.type === 'character' && game.settings.get(MODULE_ID, 'autoInitializeConsumables')) {
      const consumableManager = game.banelands?.consumables;
      if (consumableManager) {
        await consumableManager.initializeActorConsumables(actor);
        // Consumables initialized for new character
      }
    }
  });

  // Pre-create actor hook - for Dragonbane integration
  Hooks.on('preCreateActor', (_actor: Actor) => {
    // Future: Add any pre-creation modifications needed for Dragonbane integration
    if (game.system.id === 'dragonbane') {
      // Pre-creation setup for Dragonbane character
    }
  });

  // Render actor sheet hook - add consumable controls
  Hooks.on('renderActorSheet', (app: { actor: Actor; render(): void }, html: HTMLElement) => {
    if (app.actor.type !== 'character') return;

    // Add consumable display to character sheets
    addConsumableDisplay(app, html);
  });

  // Pre-update actor hook - handle consumable changes
  Hooks.on('preUpdateActor', (actor: Actor, updateData: Record<string, unknown>) => {
    // Future: Add validation or automatic updates for consumable changes
    const flags = updateData.flags as Record<string, unknown> | undefined;
    if (flags?.banelands) {
      // Consumables updated for actor
    }
  });
}

/**
 * Add consumable display to actor sheets
 */
function addConsumableDisplay(app: { actor: Actor; render(): void }, html: HTMLElement): void {
  const actor = app.actor;
  const consumableManager = game.banelands?.consumables;

  if (!consumableManager) return;

  // Find a good place to insert consumables (this will vary by system)
  let insertTarget: Element | null = null;

  // Try to find system-specific insertion points
  if (game.system.id === 'dragonbane') {
    // Look for Dragonbane-specific locations
    insertTarget =
      html.querySelector('.sheet-body .tab[data-tab="main"]') || html.querySelector('.sheet-body');
  } else {
    // Generic fallback
    insertTarget = html.querySelector('.sheet-body') || html.querySelector('.window-content');
  }

  if (!insertTarget) return;

  // Get consumable data
  const consumables = consumableManager.getConsumableDisplay(actor);

  // Create consumables section
  const consumablesHtml = `
    <div class="banelands-consumables">
      <h3>Resource Dice</h3>
      <div class="consumables-grid">
        ${consumables
          .map(
            consumable => `
          <div class="consumable-item ${consumable.depleted ? 'depleted' : ''}">
            <label>${consumable.name}</label>
            <div class="resource-die">
              <span class="die-type ${consumable.depleted ? 'empty' : ''}">${consumable.die}</span>
              <button type="button" class="use-consumable" data-consumable="${consumable.type}" ${consumable.depleted ? 'disabled' : ''}>
                Use
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  // Insert the HTML
  insertTarget.insertAdjacentHTML('beforeend', consumablesHtml);

  // Add event listeners for consumable buttons
  const useButtons = html.querySelectorAll('.use-consumable');
  useButtons.forEach(button => {
    button.addEventListener('click', async event => {
      event.preventDefault();
      const consumableType = (event.target as HTMLElement).dataset.consumable;
      if (consumableType && consumableManager) {
        await consumableManager.useConsumable(actor, consumableType as ConsumableId);
        app.render(); // Re-render the sheet to update display
      }
    });
  });
}

/**
 * Debug logging utility
 */
export function debugLog(message: string, ...args: unknown[]): void {
  if (game.settings.get(MODULE_ID, 'debugMode')) {
    // eslint-disable-next-line no-console
    console.log(`BaneLands Debug | ${message}`, ...args);
  }
}
