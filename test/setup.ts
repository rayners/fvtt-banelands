// Import types for test environment

// Mock jQuery
const mockJQuery = () => ({
  find: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  off: vi.fn().mockReturnThis(),
  html: vi.fn().mockReturnThis(),
  append: vi.fn().mockReturnThis(),
  remove: vi.fn().mockReturnThis(),
  addClass: vi.fn().mockReturnThis(),
  removeClass: vi.fn().mockReturnThis(),
  hasClass: vi.fn(() => false),
  attr: vi.fn().mockReturnThis(),
  data: vi.fn().mockReturnThis(),
  val: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  each: vi.fn().mockReturnThis(),
  length: 0,
  get: vi.fn(() => undefined),
  [Symbol.iterator]: function* () {
    // Make it iterable
  },
});

global.$ = vi.fn(mockJQuery);
global.jQuery = global.$;

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
