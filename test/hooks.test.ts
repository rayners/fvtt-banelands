import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerHooks } from '../src/hooks';

describe('registerHooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a renderDoDCharacterSheet hook (not renderActorSheet)', () => {
    registerHooks();

    const hookCalls = vi.mocked(Hooks.on).mock.calls;
    const hookNames = hookCalls.map(call => call[0]);

    expect(hookNames).toContain('renderDoDCharacterSheet');
    expect(hookNames).not.toContain('renderActorSheet');
  });

  it('should register createActor and preUpdateActor hooks', () => {
    registerHooks();

    const hookCalls = vi.mocked(Hooks.on).mock.calls;
    const hookNames = hookCalls.map(call => call[0]);

    expect(hookNames).toContain('createActor');
    expect(hookNames).toContain('preUpdateActor');
  });
});

describe('addConsumableDisplay (via renderDoDCharacterSheet hook)', () => {
  let hookCallback: (app: any, element: HTMLElement, context: any, options: any) => void;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up mock consumable manager
    game.banelands = {
      consumables: {
        getConsumableDisplay: vi.fn(() => [
          { type: 'food', name: 'Food', die: 'D8', depleted: false },
          { type: 'water', name: 'Water', die: 'D6', depleted: false },
          { type: 'arrows', name: 'Arrows', die: null, depleted: true },
          { type: 'torches', name: 'Torches', die: 'D12', depleted: false },
        ]),
        useConsumable: vi.fn(),
        setResourceDie: vi.fn(),
        getActorConsumables: vi.fn(() => ({
          arrows: { type: 'd6', depleted: true },
        })),
        setActorConsumables: vi.fn(),
        initializeActorConsumables: vi.fn(),
      } as any,
      journeys: null,
      resourceDice: {} as any,
      api: {} as any,
    };

    registerHooks();

    // Extract the renderDoDCharacterSheet callback
    const hookCalls = vi.mocked(Hooks.on).mock.calls;
    const renderCall = hookCalls.find(call => call[0] === 'renderDoDCharacterSheet');
    expect(renderCall).toBeDefined();
    hookCallback = renderCall![1] as any;
  });

  function createMockSheetElement(): HTMLElement {
    // Build the mock DOM structure using DOM API
    const container = document.createElement('div');
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.dataset.group = 'primary';
    tab.dataset.tab = 'inventory';

    const statBox = document.createElement('div');
    statBox.classList.add('derived-stat-box');

    const table = document.createElement('table');
    table.classList.add('derived-stat');
    const row = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = 'Gold';
    const td = document.createElement('td');
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '10';
    td.appendChild(input);
    row.appendChild(th);
    row.appendChild(td);
    table.appendChild(row);
    statBox.appendChild(table);
    tab.appendChild(statBox);
    container.appendChild(tab);

    return container;
  }

  function createMockApp(type = 'character') {
    return {
      actor: {
        id: 'test-actor',
        name: 'Test Character',
        type,
        getFlag: vi.fn(),
        setFlag: vi.fn(),
        system: {},
      },
      render: vi.fn(),
    };
  }

  it('should insert consumables HTML after the currency derived-stat-box', () => {
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    // Should have two derived-stat-box elements now (currency + consumables)
    const statBoxes = element.querySelectorAll('.derived-stat-box');
    expect(statBoxes.length).toBe(2);

    // The second one should be our consumables box
    const consumablesBox = statBoxes[1]!;
    expect(consumablesBox.querySelector('.roll-resource-die')).toBeTruthy();
    expect(consumablesBox.querySelectorAll('.resource-die-select').length).toBe(4);
  });

  it('should skip non-character actors', () => {
    const element = createMockSheetElement();
    const app = createMockApp('monster');

    hookCallback(app, element, {}, {});

    // Should still have only one derived-stat-box
    const statBoxes = element.querySelectorAll('.derived-stat-box');
    expect(statBoxes.length).toBe(1);
  });

  it('should mark depleted resources with depleted class', () => {
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    const consumablesBox = element.querySelectorAll('.derived-stat-box')[1]!;
    const rows = consumablesBox.querySelectorAll('tr');
    const depletedRows = consumablesBox.querySelectorAll('tr.depleted');

    expect(rows.length).toBe(4);
    expect(depletedRows.length).toBe(1); // arrows is depleted
  });

  it('should add click handlers on .roll-resource-die elements', async () => {
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    // Click a non-depleted resource die label
    const foodDieLabel = element.querySelector(
      '.roll-resource-die[data-consumable="food"]'
    ) as HTMLElement;
    expect(foodDieLabel).toBeTruthy();

    foodDieLabel.click();

    // Wait for async handler
    await vi.waitFor(() => {
      expect(game.banelands!.consumables.useConsumable).toHaveBeenCalledWith(app.actor, 'food');
    });
  });

  it('should not roll depleted resources on click', async () => {
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    // Click the depleted resource die label (arrows)
    const arrowsDieLabel = element.querySelector(
      '.roll-resource-die[data-consumable="arrows"]'
    ) as HTMLElement;
    expect(arrowsDieLabel).toBeTruthy();

    arrowsDieLabel.click();

    // Give async handler time to potentially run
    await new Promise(r => setTimeout(r, 10));
    expect(game.banelands!.consumables.useConsumable).not.toHaveBeenCalled();
  });

  it('should add change handlers on .resource-die-select elements', async () => {
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    // Change a resource die select
    const foodSelect = element.querySelector(
      '.resource-die-select[data-consumable="food"]'
    ) as HTMLSelectElement;
    expect(foodSelect).toBeTruthy();

    foodSelect.value = 'd10';
    foodSelect.dispatchEvent(new Event('change'));

    await vi.waitFor(() => {
      expect(game.banelands!.consumables.setResourceDie).toHaveBeenCalledWith(
        app.actor,
        'food',
        'd10'
      );
    });
  });

  it('should use native DOM APIs, not jQuery', () => {
    // Verified by working with plain HTMLElement (not jQuery object)
    const element = createMockSheetElement();
    const app = createMockApp();

    hookCallback(app, element, {}, {});

    const statBoxes = element.querySelectorAll('.derived-stat-box');
    expect(statBoxes.length).toBe(2);
  });
});
