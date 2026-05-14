import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { TOKENS } from './tokens.js';

// 导入核心服务类
import { ConfigManager } from '../config/manager.js';
import { MemoryManager } from '../memory/manager.js';
import { GitManager } from '../git/manager.js';
import { ToolRegistry } from '../tools/registry.js';
import { PluginLoader } from '../plugins/plugin-loader.js';
import { HistoryManager } from '../history/manager.js';

// ============================================================
// 依赖注入容器配置
// ============================================================

/**
 * 注册核心服务到 DI 容器
 * 所有核心服务都以单例模式注册
 */
export function registerCoreServices(): void {
  // ConfigManager - 单例
  container.register(TOKENS.ConfigManager, { useClass: ConfigManager }, { lifecycle: Lifecycle.Singleton });

  // MemoryManager - 单例
  container.register(TOKENS.MemoryManager, { useClass: MemoryManager }, { lifecycle: Lifecycle.Singleton });

  // GitManager - 单例
  container.register(TOKENS.GitManager, { useClass: GitManager }, { lifecycle: Lifecycle.Singleton });

  // ToolRegistry - 单例
  container.register(TOKENS.ToolRegistry, { useClass: ToolRegistry }, { lifecycle: Lifecycle.Singleton });

  // PluginLoader - 单例
  container.register(TOKENS.PluginLoader, { useClass: PluginLoader }, { lifecycle: Lifecycle.Singleton });

  // HistoryManager - 单例
  container.register(TOKENS.HistoryManager, { useClass: HistoryManager }, { lifecycle: Lifecycle.Singleton });
}

/**
 * 获取已注册的服务实例
 * 这些辅助函数提供类型安全的服务访问
 */
export function getConfigManager(): ConfigManager {
  return container.resolve<ConfigManager>(TOKENS.ConfigManager);
}

export function getMemoryManager(): MemoryManager {
  return container.resolve<MemoryManager>(TOKENS.MemoryManager);
}

export function getGitManager(): GitManager {
  return container.resolve<GitManager>(TOKENS.GitManager);
}

export function getToolRegistry(): ToolRegistry {
  return container.resolve<ToolRegistry>(TOKENS.ToolRegistry);
}

export function getPluginLoader(): PluginLoader {
  return container.resolve<PluginLoader>(TOKENS.PluginLoader);
}

export function getHistoryManager(): HistoryManager {
  return container.resolve<HistoryManager>(TOKENS.HistoryManager);
}

// 导出容器实例（用于高级用例）
export { container };
