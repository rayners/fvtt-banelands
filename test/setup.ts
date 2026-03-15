// Import types for test environment

// Mock Foundry globals
(globalThis as any).game = {
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
};

(globalThis as any).ui = {
  notifications: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
};

(globalThis as any).Hooks = {
  on: vi.fn(),
  once: vi.fn(),
  off: vi.fn(),
  call: vi.fn(),
  callAll: vi.fn(),
};

(globalThis as any).CONFIG = {
  Combat: {},
  Actor: {},
  Item: {},
  JournalEntry: {},
};

(globalThis as any).Actor = class MockActor {
  static create = vi.fn();
  static updateDocuments = vi.fn();
  static deleteDocuments = vi.fn();
};

(globalThis as any).Item = class MockItem {
  static create = vi.fn();
};

(globalThis as any).JournalEntry = class MockJournalEntry {
  static create = vi.fn();
};

(globalThis as any).Dialog = class MockDialog {
  static confirm = vi.fn();
  static prompt = vi.fn();
};

(globalThis as any).Application = class MockApplication {};

(globalThis as any).foundry = {
  utils: {
    randomID: () => 'test-id-' + Math.random().toString(36).substr(2, 9),
    isNewerVersion: vi.fn(() => false),
  },
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:30000',
    origin: 'http://localhost:30000',
  },
});
