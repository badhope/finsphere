import chalk from 'chalk';
import { configManager } from '../../config/manager.js';
import { printError, printInfo } from '../logo.js';
import { createProvider } from '../../providers/index.js';
import { PROVIDER_INFO, PROVIDER_TYPE_LIST, type ProviderType } from '../../types.js';

/**
 * Stream chat with AI provider
 */
export async function streamChat(
  provider: any,
  messages: Array<{ role: string; content: string }>,
  modelId: string,
  temperature: number,
  maxTokens: number,
): Promise<string> {
  let fullContent = '';

  process.stdout.write(chalk.green('  AI: '));

  try {
    const stream = provider.stream({
      messages,
      model: modelId,
      temperature,
      maxTokens,
    });

    for await (const chunk of stream) {
      if (chunk.done) break;
      if (chunk.content) {
        process.stdout.write(chunk.content);
        fullContent += chunk.content;
      }
    }
  } catch (error: any) {
    if (fullContent) {
      process.stdout.write(chalk.red('\n\n  ⚠ 流式输出中断'));
    }
    throw error;
  }

  console.log('\n');
  return fullContent;
}

/**
 * Resolve available AI provider
 */
export function resolveProvider(): { providerType: ProviderType; provider: any; modelId: string } | null {
  const defaultProvider = configManager.getDefaultProvider();
  const configuredProviders = PROVIDER_TYPE_LIST.filter(type =>
    !PROVIDER_INFO[type].requiresApiKey || configManager.getApiKey(type)
  );

  let providerType: ProviderType;
  if (defaultProvider && configuredProviders.includes(defaultProvider)) {
    providerType = defaultProvider;
  } else if (configuredProviders.length > 0) {
    providerType = configuredProviders[0];
  } else {
    printError('没有已配置的AI平台');
    printInfo('请运行: devflow config set-key aliyun <apiKey>');
    return null;
  }

  const info = PROVIDER_INFO[providerType];
  const providerConfig = configManager.getProviderConfig(providerType);
  const modelId = providerConfig.defaultModel || info.models[0]?.id;

  const provider = createProvider(providerType, {
    apiKey: providerConfig.apiKey,
    baseUrl: providerConfig.baseUrl,
    timeout: 60000,
    maxRetries: 2,
  });

  return { providerType, provider, modelId };
}
