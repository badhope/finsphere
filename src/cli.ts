#!/usr/bin/env node

// 必须先导入 reflect-metadata 以支持 TSyringe 装饰器
import 'reflect-metadata';

import { Command } from 'commander';
import { aiCommand } from './commands/ai.js';
import { configCommand } from './commands/config.js';
import { chatCommand } from './commands/chat.js';
import { historyCommand } from './commands/history.js';
import { reviewCommand } from './commands/review.js';
import { filesCommand } from './commands/files.js';
import { toolsCommand } from './commands/tools.js';
import { memoryCommand } from './commands/memory.js';
import { agentCommand } from './commands/agent.js';
import { gitCommand } from './commands/git.js';
import { dataCommand } from './commands/data.js';
import { configManager } from './config/manager.js';
import { printHeader, printSuccess, printError, printInfo, printWarning } from './ui/logo.js';
import { showMainMenu } from './ui/menu.js';
import { handleMenuChoice } from './ui/menu-handler.js';
import { logger } from './services/logger.js';
import { generateStartupSuggestions, formatHealthCheckForCLI } from './agent/startup-suggestions.js';
import { autonomousGoalManager } from './agent/autonomous-goals.js';

// 注册 DI 容器服务（可选，用于未来的依赖注入迁移）
import { initializeContainer } from './di/index.js';
initializeContainer();

// 导入需要在清理时停止的服务
import { syncManager } from './cloud/sync-manager.js';

// 注册全局清理处理器
const cleanup = () => {
  // 停止所有自动同步
  syncManager.stopAutoSync();
  // 清理定时器
  // 保存未保存的状态
};
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

const program = new Command();

program
  .name('devflow')
  .description('DevFlow Agent CLI - 可靠、诚实、可控的AI开发助手')
  .version('0.1.0');

program.addCommand(aiCommand);
program.addCommand(configCommand);
program.addCommand(chatCommand);
program.addCommand(historyCommand);
program.addCommand(reviewCommand);
program.addCommand(filesCommand);
program.addCommand(toolsCommand);
program.addCommand(memoryCommand);
program.addCommand(agentCommand);
program.addCommand(gitCommand);
program.addCommand(dataCommand);

program
  .command('help-interactive')
  .alias('help')
  .description('打开交互式帮助中心')
  .action(async () => {
    await configManager.init();
    const { interactiveHelp } = await import('./ui/help.js');
    await interactiveHelp();
  });

process.on('uncaughtException', (error) => {
  console.log();
  logger.error({ error: error.message, stack: error.stack }, 'Uncaught exception');
  printError(`程序异常: ${error.message}`);
  printInfo('请尝试重新运行，如果问题持续请提交 Issue');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.log();
  logger.error({ reason }, 'Unhandled promise rejection');
  printError(`未处理的Promise异常: ${reason}`);
  process.exit(1);
});

if (process.argv.length === 2) {
  (async () => {
    logger.info('Starting DevFlow Agent in interactive mode');
    try {
      await configManager.init();
      logger.debug('Configuration initialized successfully');

      // 首次运行检测和引导
      const hasApiKey = configManager.getProviderConfig('openai')?.apiKey
        || configManager.getProviderConfig('anthropic')?.apiKey
        || processDELETE.OPENAI_API_KEY
        || processDELETE.ANTHROPIC_API_KEY;

      if (!hasApiKey) {
        console.log();
        printWarning('⚠️  检测到首次运行：尚未配置 API Key');
        printInfo('DevFlow Agent 需要 AI 提供商的 API Key 才能工作');
        console.log();
        console.log('  快速配置方式：');
        console.log('    1. 运行 devflow config set-provider --provider openai --api-key YOUR_KEY');
        console.log('    2. 设置环境变量: export OPENAI_API_KEY=your_key');
        console.log('    3. 在交互菜单中选择 "⚙️ 配置管理" → "设置AI提供商"');
        console.log();
        printInfo('支持 OpenAI、Anthropic、阿里云百炼 等提供商');
        console.log();
      }

      // 运行启动健康检查（非阻塞，仅提示）
      try {
        const healthResult = await generateStartupSuggestions(process.cwd());
        if (healthResult.healthStatus !== 'healthy') {
          console.log();
          if (healthResult.healthStatus === 'critical') {
            printWarning(`项目健康检查: ${healthResult.summary}`);
          } else {
            printInfo(`项目健康检查: ${healthResult.summary}`);
          }
          // 显示前 3 条建议
          for (const suggestion of healthResult.suggestions.slice(0, 3)) {
            console.log(`    ${suggestion}`);
          }
          console.log();
        }
      } catch {
        // 健康检查失败不影响主流程
      }
    } catch (error: any) {
      logger.error({ error: error.message }, 'Configuration initialization failed');
      printError(`配置初始化失败: ${error.message}`);
      printInfo('请检查 .devflow 目录权限');
      process.exit(1);
    }

    while (true) {
      try {
        const choice = await showMainMenu();

        if (choice === null || choice === 'exit') {
          printHeader();
          printSuccess('感谢使用 DevFlow Agent，再见！');
          logger.info('DevFlow Agent exited normally');
          process.exit(0);
        }

        await handleMenuChoice(choice);
      } catch (error: any) {
        logger.error({ error: error?.message || error }, 'Operation failed in main loop');
        printError(`操作失败: ${error?.message || error}`);
        printInfo('返回主菜单...');
      }
    }
  })();
} else {
  program.parse();
}
