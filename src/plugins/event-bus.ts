// ============================================================
// Plugin System - Event Bus
// ============================================================

import type { PluginHook, HookHandler } from './types.js';

/** Options for registering a hook handler */
export interface HookRegistrationOptions {
  pluginName?: string;
  priority?: number;
}

/**
 * Lightweight event emitter for plugin lifecycle hooks.
 *
 * Handlers are executed sequentially in priority order (lower number = earlier).
 * All handlers are awaited, so async handlers are fully supported.
 */
export class EventBus {
  private handlers: Map<string, HookHandler[]> = new Map();

  /**
   * Subscribe to a lifecycle hook.
   * @returns An unsubscribe function
   */
  on(
    hook: PluginHook,
    handler: (...args: any[]) => void | Promise<void>,
    options?: HookRegistrationOptions,
  ): () => void {
    const entry: HookHandler = {
      pluginName: options?.pluginName ?? 'anonymous',
      handler,
      priority: options?.priority ?? 100,
    };

    let list = this.handlers.get(hook);
    if (!list) {
      list = [];
      this.handlers.set(hook, list);
    }
    list.push(entry);
    this.sortHandlers(hook);

    // Return unsubscribe function
    return () => {
      const current = this.handlers.get(hook);
      if (!current) return;
      const idx = current.indexOf(entry);
      if (idx !== -1) {
        current.splice(idx, 1);
      }
    };
  }

  /**
   * Remove a specific handler from a hook.
   */
  off(hook: PluginHook, handler: (...args: any[]) => void | Promise<void>): void {
    const list = this.handlers.get(hook);
    if (!list) return;
    const idx = list.findIndex((h) => h.handler === handler);
    if (idx !== -1) {
      list.splice(idx, 1);
    }
  }

  /**
   * Emit a lifecycle hook, invoking all registered handlers sequentially
   * in priority order. All handlers are awaited.
   */
  async emit(hook: PluginHook, ...args: any[]): Promise<void> {
    const list = this.handlers.get(hook);
    if (!list || list.length === 0) return;

    for (const entry of list) {
      try {
        await entry.handler(...args);
      } catch (err) {
        // Prevent one failing handler from blocking others
        console.error(
          `[EventBus] Handler error on "${hook}" from plugin "${entry.pluginName}":`,
          err,
        );
      }
    }
  }

  /**
   * Remove all handlers registered by a specific plugin.
   */
  removeAllForPlugin(pluginName: string): void {
    for (const [hook, list] of this.handlers) {
      const filtered = list.filter((h) => h.pluginName !== pluginName);
      if (filtered.length !== list.length) {
        this.handlers.set(hook, filtered);
      }
    }
  }

  /**
   * Get all handlers for a given hook (sorted by priority).
   */
  getHandlers(hook: PluginHook): HookHandler[] {
    return this.handlers.get(hook) ?? [];
  }

  /**
   * Sort handlers for a hook by priority (ascending).
   */
  private sortHandlers(hook: PluginHook): void {
    const list = this.handlers.get(hook);
    if (!list) return;
    list.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  }
}

/** Singleton event bus instance */
export const eventBus = new EventBus();
