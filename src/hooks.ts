// Foundry VTT hook registrations for BaneLands module

import type { ConsumableId } from './types/banelands-types';

const MODULE_ID = 'banelands';

export function registerHooks(): void {
  // Actor creation hook - initialize consumables for new characters
  Hooks.on('createActor', async (actor: Actor) => {
    if (actor.type === 'character' && game.settings.get(MODULE_ID, 'autoInitializeConsumables')) {
      const consumableManager = game.banelands?.consumables;
      if (consumableManager) {
        await consumableManager.initializeActorConsumables(actor);
      }
    }
  });

  // Render Dragonbane character sheet hook (AppV2) - add consumable controls
  Hooks.on(
    'renderDoDCharacterSheet',
    (
      app: { actor: Actor; render(): void },
      element: HTMLElement,
      _context: unknown,
      _options: unknown
    ) => {
      if (app.actor.type !== 'character') return;
      addConsumableDisplay(app, element);
    }
  );

  // Pre-update actor hook - handle consumable changes
  Hooks.on('preUpdateActor', (actor: Actor, updateData: Record<string, unknown>) => {
    const flags = updateData.flags as Record<string, unknown> | undefined;
    if (flags?.banelands) {
      // Consumables updated for actor
    }
  });
}

/**
 * Add consumable display to Dragonbane character sheets (AppV2 native DOM)
 */
function addConsumableDisplay(app: { actor: Actor; render(): void }, element: HTMLElement): void {
  const actor = app.actor;
  const consumableManager = game.banelands?.consumables;

  if (!consumableManager) return;

  // Find the inventory tab using Dragonbane AppV2 selectors
  const inventoryTab = element.querySelector('.tab[data-group="primary"][data-tab="inventory"]');
  if (!inventoryTab) return;

  // Find the currency derived-stat-box to insert after
  const currencyBox = inventoryTab.querySelector('.derived-stat-box');
  if (!currencyBox) return;

  // Get consumable data
  const consumables = consumableManager.getConsumableDisplay(actor);

  // Create consumables section using Dragonbane's derived-stat styling
  const consumablesHtml = `
    <div class="derived-stat-box">
      <table class="derived-stat">
        ${consumables
          .map(
            consumable => `
          <tr class="${consumable.depleted ? 'depleted' : ''}">
            <th class="roll-resource-die" data-consumable="${consumable.type}" title="Roll ${consumable.name} Die"><i class="fas fa-dice"></i> ${consumable.name} Die</th>
            <td>
              <select class="resource-die-select" data-consumable="${consumable.type}">
                <option value="" ${consumable.depleted ? 'selected' : ''}>—</option>
                <option value="d6" ${!consumable.depleted && consumable.die === 'D6' ? 'selected' : ''}>D6</option>
                <option value="d8" ${!consumable.depleted && consumable.die === 'D8' ? 'selected' : ''}>D8</option>
                <option value="d10" ${!consumable.depleted && consumable.die === 'D10' ? 'selected' : ''}>D10</option>
                <option value="d12" ${!consumable.depleted && consumable.die === 'D12' ? 'selected' : ''}>D12</option>
              </select>
            </td>
          </tr>
        `
          )
          .join('')}
      </table>
    </div>
  `;

  // Insert after the currency derived-stat-box
  currencyBox.insertAdjacentHTML('afterend', consumablesHtml);

  // Add event listeners for rolling resource dice (native DOM)
  const rollButtons = element.querySelectorAll<HTMLElement>('.roll-resource-die');
  rollButtons.forEach(button => {
    button.addEventListener('click', async event => {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      const consumableType = target.dataset.consumable;

      // Don't roll if the resource is depleted
      if (target.closest('tr')?.classList.contains('depleted')) {
        return;
      }

      if (consumableType && consumableManager) {
        await consumableManager.useConsumable(actor, consumableType as ConsumableId);
        app.render();
      }
    });
  });

  // Add event listeners for manual die type changes (native DOM)
  const selects = element.querySelectorAll<HTMLSelectElement>('.resource-die-select');
  selects.forEach(select => {
    select.addEventListener('change', async event => {
      const target = event.currentTarget as HTMLSelectElement;
      const consumableType = target.dataset.consumable;
      const newDieType = target.value;

      if (consumableType && consumableManager) {
        if (newDieType === '' || newDieType === '—') {
          // Set as depleted
          const consumables = consumableManager.getActorConsumables(actor);
          consumables[consumableType as ConsumableId].depleted = true;
          await consumableManager.setActorConsumables(actor, consumables);
        } else {
          await consumableManager.setResourceDie(
            actor,
            consumableType as ConsumableId,
            newDieType as any
          );
        }
        app.render();
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
