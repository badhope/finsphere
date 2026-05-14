// ============================================================
// 压缩服务 - 使用 LLM 智能压缩对话历史
// ============================================================

import { BaseService } from './base.js';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../di/tokens.js';
import type { IProviderFactory, IConfigManager } from './interfaces.js';

/**
 * 压缩结果
 */
export interface CompressionResult {
  /** 压缩后的摘要 */
  summary: string;
  /** 原始消息数 */
  originalMessages: number;
  /** 压缩后消息数 */
  compressedMessages: number;
  /** 节省的 token 数（估算） */
  tokensSaved: number;
}

/**
 * 压缩服务
 * 使用 LLM 对旧对话消息进行智能摘要压缩
 */
@injectable()
export class CompressionService extends BaseService {
  constructor(
    @inject(TOKENS.ProviderFactory) private providerFactory: IProviderFactory,
    @inject(TOKENS.ConfigManager) private config: IConfigManager
  ) {
    super();
  }

  /**
   * 使用 LLM 对旧对话消息进行摘要压缩
   * @param messages 消息列表
   * @param options 压缩选项
   * @returns 压缩结果
   */
  async compressMessages(
    messages: Array<{ role: string; content: string }>,
    options?: { keepRecent?: number; maxSummaryTokens?: number }
  ): Promise<CompressionResult> {
    const keepRecent = options?.keepRecent ?? 4;
    const maxSummaryTokens = options?.maxSummaryTokens ?? 500;

    if (messages.length <= keepRecent + 1) {
      return {
        summary: '',
        originalMessages: messages.length,
        compressedMessages: messages.length,
        tokensSaved: 0,
      };
    }

    const toCompress = messages.slice(0, -keepRecent);
    const toKeep = messages.slice(-keepRecent);

    // 构建压缩提示词
    const compressionPrompt = `请简洁地总结以下对话历史的关键信息，保留：
1. 用户的主要需求和意图
2. 重要的决策和结论
3. 已完成的操作和待办事项
4. 关键的技术细节和参数

对话历史：
${toCompress.map(m => `[${m.role}]: ${m.content}`).join('\n')}

请用简洁的中文总结（不超过${maxSummaryTokens}字）：`;

    const provider = this.providerFactory.getDefaultProvider();
    if (!provider) {
      throw new Error('没有可用的 AI 提供商');
    }

    const defaultProvider = this.config.getDefaultProvider();
    const providerConfig = defaultProvider
      ? this.config.getProviderConfig(defaultProvider)
      : undefined;
    const defaultModel = providerConfig?.defaultModel || 'gpt-4';

    const response = await provider.chat({
      messages: [{ role: 'user', content: compressionPrompt }],
      model: defaultModel,
      temperature: 0.3,
      maxTokens: maxSummaryTokens,
    });

    return {
      summary: response.content,
      originalMessages: messages.length,
      compressedMessages: keepRecent + 1, // summary + recent
      tokensSaved: Math.round(
        toCompress.reduce((sum, m) => sum + m.content.length / 4, 0)
      ),
    };
  }

  /**
   * 根据估算的 token 数判断是否需要压缩
   * @param messages 消息列表
   * @param threshold token 阈值（默认 6000）
   * @returns 是否需要压缩
   */
  shouldCompress(
    messages: Array<{ role: string; content: string }>,
    threshold?: number
  ): boolean {
    const totalTokens = messages.reduce(
      (sum, m) => sum + m.content.length / 4,
      0
    );
    return totalTokens > (threshold || 6000);
  }
}
