---
id: prompt-task-coding-implement-feature-from-spec-v1
name: Implement Feature from Spec
summary: 根据技术规格说明文档实现完整功能模块
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: task
sub_category: coding
tags: [coding, implementation, specification, feature, development]
keywords: [功能实现, 规格开发, 规范实现, 模块开发]
intent: 将技术规格说明（Spec）转化为完整的、可集成的功能代码
applicable_models:
  - gpt-4
  - gpt-4-turbo
  - claude-3-opus
  - claude-3-sonnet
  - qwen-max
  - qwen-plus
  - deepseek-v3
  - minimax-large
input_requirements:
  - specification: string (必填) 完整的技术规格说明
  - target_language: string (必填) 目标编程语言
  - existing_modules: object (可选) 已有的相关模块
  - integration_points: array (可选) 需要集成的接口
output_requirements:
  - implementation: object 包含：
    - files: array 生成的文件列表
    - code: object 文件名到代码的映射
    - integration_guide: string 集成指南
  - test_spec: object 测试规格
  - verification_checklist: array 验证清单
tool_requirements:
  - 代码执行环境
  - 依赖管理工具
preconditions:
  - 规格说明应该是完整的和准确的
  - 应明确技术栈和编码规范
anti_patterns:
  - 不要偏离规格说明
  - 不要忽略规格中的边界情况
  - 不要跳过规格中的任何要求
  - 不要假设规格中有歧义的部分
failure_modes:
  - 规格不完整时：列出缺失的信息
  - 规格有歧义时：列出可能的解读
  - 技术限制时：说明并提供替代实现
self_check: |
  实现前检查：
  □ 是否已理解完整的规格说明
  □ 是否已识别所有功能点和非功能需求
  □ 是否已了解现有的代码结构
  □ 是否已理解集成点
  □ 是否识别了规格中的假设和约束
related_skills:
  - skill-coding-code-generation
  - skill-coding-test-generation
  - skill-coding-code-review
related_workflows:
  - workflow-multi-step-feature-development
  - workflow-sequential-code-review
related_prompts:
  - prompt-task-coding-generate-code-from-requirement
  - prompt-task-coding-review-code-for-quality
---

# Context

你是一个专业程序员，负责根据技术规格说明（Spec）实现完整的功能模块。这个 Prompt 强调：
1. 严格遵循规格说明
2. 保持与现有代码的一致性
3. 正确处理集成点
4. 提供完整的测试和验证

# Prompt Body

## 阶段 1：规格解析

### 1.1 提取规格要素

```markdown
## 规格要素提取

### 功能规格
| 功能点 | 描述 | 优先级 | 验收标准 |
|--------|------|--------|----------|
| F1 | ... | 必须 | ... |
| F2 | ... | 应该 | ... |

### 数据规格
| 数据项 | 类型 | 格式 | 约束 |
|--------|------|------|------|
| D1 | ... | ... | ... |

### API 规格
| 端点 | 方法 | 输入 | 输出 | 错误码 |
|------|------|------|------|--------|
| /api/... | GET | ... | ... | ... |

### 性能规格
| 指标 | 要求 |
|------|------|
| 响应时间 | < X ms |
| 并发数 | > X |

### 安全规格
| 要求 | 实现方式 |
|------|---------|
| 认证 | ... |
| 授权 | ... |
```

### 1.2 分析集成点

```markdown
## 集成点分析

### 依赖的模块
| 模块 | 接口 | 使用方式 |
|------|------|---------|
| ModuleA | methodA() | 调用 |
| ModuleB | eventB | 监听 |

### 被依赖的接口
| 接口 | 调用方 | 契约 |
|------|--------|------|
| interfaceX | ModuleC | ... |

### 事件/消息
| 事件 | 发送方 | 接收方 | 载荷 |
|------|--------|--------|------|
| user.created | This | Listener | ... |
```

### 1.3 确认理解

```markdown
## 理解确认

### 核心功能
[用自己的话描述核心功能]

### 数据流
```
[数据流描述]
```

### 关键决策点
| 决策 | 选择 | 理由 |
|------|------|------|
| ... | ... | ... |
```

## 阶段 2：实现规划

### 2.1 文件结构设计

```markdown
## 文件结构

```
src/
├── [模块名]/
│   ├── index.ts           # 导出
│   ├── [子模块1].ts      # 功能1
│   ├── [子模块2].ts      # 功能2
│   └── types.ts          # 类型定义
└── tests/
    └── [模块名].test.ts  # 测试
```
```

### 2.2 实现顺序

```markdown
## 实现顺序

1. **类型定义** - 定义所有数据结构
2. **核心逻辑** - 实现业务逻辑
3. **接口实现** - 实现暴露的接口
4. **集成代码** - 集成外部依赖
5. **错误处理** - 完善错误处理
```

### 2.3 风险识别

```markdown
## 风险识别

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| ... | ... | ... |
```

## 阶段 3：代码实现

### 3.1 类型定义

```typescript
// types.ts

/**
 * [类型名] 的完整类型定义
 */
export interface [TypeName] {
  /** 字段说明 */
  field1: string;
  /** 字段说明 */
  field2: number;
}

/**
 * [枚举名] 枚举定义
 */
export enum [EnumName] {
  /** 选项1 */
  Option1 = 'option1',
  /** 选项2 */
  Option2 = 'option2',
}

/**
 * [错误类型] 错误定义
 */
export class [ErrorName] extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = '[ErrorName]';
  }
}
```

### 3.2 核心实现

```typescript
// [module].ts

import { TypeName, ErrorName } from './types';
import { DependencyA } from '../dependency-a';
import { IDependencyB } from '../dependency-b';

/**
 * [类/函数名] 实现
 *
 * @description
 * 详细的功能描述，包括：
 * - 主要职责
 * - 使用方式
 * - 注意事项
 */
export class [ClassName] {
  constructor(
    private readonly dependencyA: DependencyA,
    private readonly dependencyB: IDependencyB
  ) {}

  /**
   * [方法名] 方法实现
   *
   * @param input - 输入参数描述
   * @returns 返回值描述
   * @throws [ErrorName] 当[某种情况]时
   */
  async [methodName](input: TypeName): Promise<[ReturnType]> {
    // 1. 输入验证
    this.validateInput(input);

    // 2. 业务逻辑
    const result = await this.processBusiness(input);

    // 3. 返回结果
    return result;
  }

  private validateInput(input: TypeName): void {
    if (!input.field1) {
      throw new ErrorName('MISSING_FIELD', 'field1 is required');
    }
    // ... 更多验证
  }

  private async processBusiness(input: TypeName): Promise<[ReturnType]> {
    // 核心业务逻辑
  }
}
```

### 3.3 集成代码

```typescript
// integration.ts

import { [ModuleClass] } from './[module]';
import { createDependencyA } from '../dependency-a';
import { DependencyBAdapter } from '../adapters/dependency-b';

/**
 * 创建并配置 [模块名] 实例
 */
export function create[ModuleName](): [ModuleClass] {
  const dependencyA = createDependencyA();
  const dependencyB = new DependencyBAdapter();

  return new [ModuleClass](dependencyA, dependencyB);
}
```

## 阶段 4：测试规格

### 4.1 测试用例设计

```markdown
## 测试规格

### 单元测试用例

| 用例 | 输入 | 预期输出 | 覆盖 |
|------|------|---------|------|
| 正常流程 | valid input | success | 路径1 |
| 空输入 | {} | error | 验证 |
| 边界 | edge case | behavior | 边界 |

### 集成测试用例

| 用例 | 场景 | 验证点 |
|------|------|--------|
| I1 | 正常注册 | 创建成功 |
| I2 | 重复邮箱 | 返回错误 |
```

### 4.2 Mock 策略

```markdown
## Mock 策略

| 依赖 | Mock 方式 | 理由 |
|------|-----------|------|
| DependencyA | 真实调用 | 轻量级 |
| DependencyB | mock | 隔离外部依赖 |
```

## 阶段 5：集成指南

### 5.1 集成步骤

```markdown
## 集成指南

### 步骤 1：安装依赖
```bash
npm install [package]
```

### 步骤 2：配置
```typescript
const config = {
  option1: 'value1',
  option2: 'value2',
};
```

### 步骤 3：初始化
```typescript
import { create[ModuleName] } from './[module]';

const module = create[ModuleName](config);
```

### 步骤 4：使用
```typescript
const result = await module.[methodName](input);
```
```

## 阶段 6：验证清单

### 6.1 自检清单

```markdown
## 验证清单

- [ ] 规格中的每个功能点都已实现
- [ ] 规格中的每个验收标准都可验证
- [ ] 所有 API 端点都符合规格
- [ ] 错误码符合规格定义
- [ ] 性能指标满足要求
- [ ] 安全要求已满足
- [ ] 单元测试覆盖率 > X%
- [ ] 集成测试通过
- [ ] 与现有代码风格一致
```

# Variables

| 变量名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| specification | string | 是 | 完整的技术规格 |
| target_language | string | 是 | 目标编程语言 |
| existing_modules | object | 否 | 现有模块信息 |
| integration_points | array | 否 | 集成点列表 |
| coding_standards | string | 否 | 编码规范 |
| coverage_target | number | 否 | 测试覆盖率目标 |

# Usage Notes

1. **规格前置**：确保规格说明是完整的
2. **按顺序执行**：遵循 6 个阶段的执行顺序
3. **严格自检**：使用验证清单确保符合规格
4. **文档齐全**：提供完整的集成和使用文档
