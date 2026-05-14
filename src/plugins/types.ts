// ============================================================
// Plugin System - Core Types
// ============================================================

/**
 * Plugin manifest - describes a plugin's metadata and entry point.
 * Placed at the root of a plugin directory as `manifest.json`.
 */
export interface PluginManifest {
  /** Unique plugin identifier (kebab-case) */
  name: string;
  /** Semantic version */
  version: string;
  /** Human-readable description */
  description: string;
  /** Plugin author */
  author?: string;
  /** License identifier */
  license?: string;
  /** Entry point relative to plugin directory (default: index.js) */
  main?: string;
  /** Searchable keywords */
  keywords?: string[];
  /** Peer plugin dependencies (name -> semver range) */
  dependencies?: Record<string, string>;
  /** Dev-only peer dependencies */
  devDependencies?: Record<string, string>;
  /** Whether the plugin is enabled by default (default: true) */
  enabled?: boolean;
}

/**
 * Logger scoped to a plugin name.
 */
export interface PluginLogger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

/**
 * Context object passed to a plugin during activation.
 * Provides access to all registration APIs and configuration.
 */
export interface PluginContext {
  /** Plugin's own manifest */
  manifest: PluginManifest;
  /** Register a new tool with the tool registry */
  registerTool(definition: any): void;
  /** Register a new CLI command with Commander */
  registerCommand(command: any): void;
  /** Get plugin-specific configuration */
  getConfig(): Record<string, any>;
  /** Update plugin-specific configuration */
  setConfig(config: Record<string, any>): void;
  /** Access to the global config manager */
  configManager: any;
  /** Logger scoped to plugin name */
  logger: PluginLogger;
  /** Read-only access to the tool registry */
  toolRegistry: Map<string, any>;
}

/** Plugin activation function */
export type PluginActivateFn = (context: PluginContext) => void | Promise<void>;

/** Plugin deactivation function */
export type PluginDeactivateFn = () => void | Promise<void>;

/**
 * A loaded plugin instance.
 * Plugins must export a default object conforming to this interface.
 */
export interface Plugin {
  manifest: PluginManifest;
  activate: PluginActivateFn;
  deactivate?: PluginDeactivateFn;
}

/**
 * Available lifecycle hooks that plugins can subscribe to.
 */
export type PluginHook =
  | 'beforeRun'
  | 'afterRun'
  | 'beforeStep'
  | 'afterStep'
  | 'beforeToolExecution'
  | 'afterToolExecution'
  | 'onError'
  | 'onConfigChange';

/**
 * A registered hook handler with metadata.
 */
export interface HookHandler {
  /** Name of the plugin that registered this handler */
  pluginName: string;
  /** The handler function */
  handler: (...args: any[]) => void | Promise<void>;
  /** Execution priority (lower = earlier, default: 100) */
  priority?: number;
}

/**
 * Runtime state of a plugin.
 */
export interface PluginState {
  manifest: PluginManifest;
  state: 'loaded' | 'activated' | 'deactivated' | 'error';
  error?: string;
  activatedAt?: number;
}
