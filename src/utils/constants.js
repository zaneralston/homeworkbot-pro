// App configuration
export const APP_CONFIG = {
  name: 'HomeworkBot.ai',
  version: '1.0.0',
  description: 'Automate Your Schoolwork with AI',
  pricing: {
    monthly: 30,
    currency: 'USD'
  },
  features: {
    trialDays: 7,
    maxAssignments: 100,
    maxWorkspaces: 10
  }
};

// API endpoints and configuration
export const API_CONFIG = {
  anthropic: {
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-sonnet-20240229'
  },
  canvas: {
    timeout: 10000,
    retryAttempts: 3
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'homeworkbot-theme',
  apiKey: 'homeworkbot-api-key',
  canvasConfig: 'homeworkbot-canvas-config',
  userPreferences: 'homeworkbot-preferences',
  assignments: 'homeworkbot-assignments',
  workspaces: 'homeworkbot-workspaces'
};

// Routes configuration
export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  ASSIGNMENTS: '/assignments',
  WORKSPACE: '/workspace',
  PLANNER: '/planner',
  SETTINGS: '/settings'
};

// Navigation items
export const NAV_ITEMS = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'Home' },
  { name: 'Assignments', href: ROUTES.ASSIGNMENTS, icon: 'BookOpen' },
  { name: 'Workspace', href: ROUTES.WORKSPACE, icon: 'PenTool' },
  { name: 'Planner', href: ROUTES.PLANNER, icon: 'Calendar' },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: 'Settings' },
];

// Assignment types and their configurations
export const ASSIGNMENT_TYPES = {
  ESSAY: {
    key: 'essay',
    label: 'Essay',
    icon: '✍️',
    description: 'Academic essays and research papers',
    estimatedTime: '2-4 hours'
  },
  DISCUSSION: {
    key: 'discussion',
    label: 'Discussion Post',
    icon: '💬',
    description: 'Forum discussions and responses',
    estimatedTime: '15-30 minutes'
  },
  EMAIL: {
    key: 'email',
    label: 'Email',
    icon: '📧',
    description: 'Professional emails to professors',
    estimatedTime: '5-15 minutes'
  },
  STUDY_GUIDE: {
    key: 'study-guide',
    label: 'Study Guide',
    icon: '📚',
    description: 'Comprehensive study materials',
    estimatedTime: '1-3 hours'
  },
  PROBLEM_SET: {
    key: 'problem-set',
    label: 'Problem Set',
    icon: '🧮',
    description: 'Math and science problem sets',
    estimatedTime: '1-2 hours'
  }
};

// Vibe modes configuration
export const VIBE_MODES = {
  CLASSIC_STUDENT: {
    key: 'classic-student',
    name: 'Classic Student',
    emoji: '🧑‍🎓',
    description: 'Professional, academic tone with proper citations and formal structure',
    prompt: 'Write in a professional, academic tone with proper citations and formal structure.'
  },
  LAZY_GENIUS: {
    key: 'lazy-genius',
    name: 'Lazy Genius',
    emoji: '🧠',
    description: 'Does everything for you in autopilot mode',
    prompt: 'Write efficiently with smart shortcuts while maintaining quality and doing everything automatically.'
  }
};

// Status and priority configurations
export const STATUS_CONFIG = {
  PENDING: { key: 'pending', label: 'Pending', color: 'yellow' },
  IN_PROGRESS: { key: 'in-progress', label: 'In Progress', color: 'blue' },
  COMPLETED: { key: 'completed', label: 'Completed', color: 'green' }
};

export const PRIORITY_CONFIG = {
  LOW: { key: 'low', label: 'Low', color: 'green' },
  MEDIUM: { key: 'medium', label: 'Medium', color: 'yellow' },
  HIGH: { key: 'high', label: 'High', color: 'red' }
};

// Animation configurations
export const ANIMATION_CONFIG = {
  page: {
    duration: 0.4,
    ease: 'anticipate'
  },
  card: {
    duration: 0.3,
    ease: 'easeOut'
  },
  button: {
    duration: 0.2,
    ease: 'easeInOut'
  }
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  API_KEY: 'Invalid API key. Please check your settings.',
  CANVAS_CONNECTION: 'Failed to connect to Canvas. Please verify your credentials.',
  GENERATION_FAILED: 'Failed to generate content. Please try again.',
  SAVE_FAILED: 'Failed to save changes. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh the page.'
}; 