/**
 * 代码解析模块 - 统一导出
 *
 * 基于 tree-sitter 的多语言代码解析引擎。
 */

export { initLanguages, getLanguageByExtension, getLanguageByFilePath, getRegisteredLanguages, getLanguage } from './languages.js';
export type { SupportedLanguage, LanguageInfo } from './languages.js';

export { parseSource, updateParse, parseFile, parseFiles } from './engine.js';
export type { ParseResult } from './engine.js';

export { extractSymbols, getSymbolsInRange, findSymbolByName } from './symbols.js';
export type { CodeSymbol, SymbolKind } from './symbols.js';

export { parseCache } from './cache.js';
