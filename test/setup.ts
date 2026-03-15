// Import types for test environment

// Mock Foundry globals
global.game = {
  user: {
    id: 'test-user',
    isGM: true,
    name: 'Test User',
  },
  users: new Map(),
  actors: new Map(),
  items: new Map(),
  i18n: {
    localize: vi.fn(key => key),
    format: vi.fn((key, data) => `${key}:${JSON.stringify(data)}`),
  },
  settings: {
    get: vi.fn(),
    set: vi.fn(),
    register: vi.fn(),
  },
  modules: {
    get: vi.fn(() => ({ active: false })),
  },
  system: {
    id: 'dragonbane',
    title: 'Dragonbane',
  },
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
  },
  time: {
    worldTime: 0,
  },
} as any;

global.ui = {
  notifications: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
} as any;

global.Hooks = {
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  call: vi.fn(),
  callAll: vi.fn(),
} as any;

global.CONFIG = {
  Combat: {},
  Actor: {},
  Item: {},
  JournalEntry: {},
} as any;

global.Actor = class MockActor {
  static create = vi.fn();
  static updateDocuments = vi.fn();
  static deleteDocuments = vi.fn();
} as any;

global.Item = class MockItem {
  static create = vi.fn();
} as any;

global.JournalEntry = class MockJournalEntry {
  static create = vi.fn();
} as any;

global.Dialog = class MockDialog {
  static confirm = vi.fn();
  static prompt = vi.fn();
} as any;

global.Application = class MockApplication {} as any;

global.foundry = {
  utils: {
    randomID: () => 'test-id-' + Math.random().toString(36).substr(2, 9),
    isNewerVersion: vi.fn(() => false),
  },
} as any;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:30000',
    origin: 'http://localhost:30000',
  },
});
