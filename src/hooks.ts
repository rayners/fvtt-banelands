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
  Hooks.on('renderActorSheet', (app: { actor: Actor; render(): void }, html: JQuery<HTMLElement>) => {
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
function addConsumableDisplay(app: { actor: Actor; render(): void }, html: JQuery<HTMLElement>): void {
  const actor = app.actor;
  const consumableManager = game.banelands?.consumables;

  if (!consumableManager) return;

  // Find a good place to insert consumables (this will vary by system)
  let insertTarget: Element | null = null;

  // Try to find system-specific insertion points
  if (game.system.id === 'dragonbane') {
    // Look for Dragonbane inventory tab, specifically after the currency section
    const inventoryTab = html.find('.sheet-body .tab[data-tab="inventory"]')[0];
    if (inventoryTab) {
      // Try to find currency section to insert after
      const currencySection = html.find('.currency, .money, [data-group="currency"]').last()[0];
      insertTarget = currencySection || inventoryTab;
    }
    
    // Fallback to main tab if inventory not found
    if (!insertTarget) {
      insertTarget = html.find('.sheet-body .tab[data-tab="main"]')[0] || html.find('.sheet-body')[0] || null;
    }
  } else {
    // Generic fallback - try inventory first, then main
    insertTarget = 
      html.find('.tab[data-tab="inventory"]')[0] || 
      html.find('.sheet-body')[0] || 
      html.find('.window-content')[0] || 
      null;
  }

  if (!insertTarget) return;

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
                <option value="d6" ${!consumable.depleted && consumable.die === 'D6' ? 'selected' : ''}>⬛ D6</option>
                <option value="d8" ${!consumable.depleted && consumable.die === 'D8' ? 'selected' : ''}>◆ D8</option>
                <option value="d10" ${!consumable.depleted && consumable.die === 'D10' ? 'selected' : ''}>🔸 D10</option>
                <option value="d12" ${!consumable.depleted && consumable.die === 'D12' ? 'selected' : ''}>🔹 D12</option>
              </select>
            </td>
          </tr>
        `
          )
          .join('')}
      </table>
    </div>
  `;

  // Insert the HTML - after currency section if found, otherwise at end of container
  const isCurrencySection = insertTarget.classList?.contains('currency') || 
                           insertTarget.classList?.contains('money') || 
                           insertTarget.hasAttribute?.('data-group');
  
  if (isCurrencySection) {
    insertTarget.insertAdjacentHTML('afterend', consumablesHtml);
  } else {
    insertTarget.insertAdjacentHTML('beforeend', consumablesHtml);
  }

  // Add event listeners for rolling resource dice (clicking the labels)
  html.find('.roll-resource-die').on('click', async event => {
    event.preventDefault();
    const $target = $(event.currentTarget);
    const consumableType = $target.data('consumable');
    
    // Don't roll if the resource is depleted
    if ($target.closest('tr').hasClass('depleted')) {
      return;
    }
    
    if (consumableType && consumableManager) {
      await consumableManager.useConsumable(actor, consumableType as ConsumableId);
      app.render(); // Re-render the sheet to update display
    }
  });

  // Add event listeners for manual die type changes
  html.find('.resource-die-select').on('change', async event => {
    const $target = $(event.currentTarget);
    const consumableType = $target.data('consumable');
    const newDieType = $target.val() as string;
    
    if (consumableType && consumableManager) {
      if (newDieType === '' || newDieType === '—') {
        // Set as depleted
        const consumables = consumableManager.getActorConsumables(actor);
        consumables[consumableType as ConsumableId].depleted = true;
        await consumableManager.setActorConsumables(actor, consumables);
      } else {
        // Set the new die type
        await consumableManager.setResourceDie(actor, consumableType as ConsumableId, newDieType as any);
      }
      app.render(); // Re-render the sheet to update display
    }
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
