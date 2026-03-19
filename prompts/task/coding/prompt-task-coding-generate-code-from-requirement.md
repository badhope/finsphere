---
id: prompt-task-coding-generate-code-from-requirement-v1
name: Generate Code from Requirement
summary: 根据需求描述生成高质量、可执行的代码
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: task
sub_category: coding
tags: [coding, code-generation, implementation, requirements, engineering]
keywords: [代码生成, 需求实现, 功能开发, 编程]
intent: 将自然语言需求转化为结构化、可执行、高质量的代码实现
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
  - requirement: string (必填) 完整的需求描述
  - language: string (必填) 目标编程语言
  - framework: string (可选) 使用的框架
  - constraints: object (可选) 约束条件
  - existing_codebase: string (可选) 现有代码上下文
output_requirements:
  - code: string 生成的代码
  - specification: object 需求规格说明
  - test_cases: array 测试用例
  - documentation: string 代码文档
  - trade_offs: string 技术决策和权衡
tool_requirements:
  - 代码执行环境（用于验证）
  - 依赖管理工具
preconditions:
  - 需求描述应该足够清晰
  - 应明确技术栈和约束条件
anti_patterns:
  - 不要在需求不清晰时直接开始编码
  - 不要忽略边界条件和错误处理
  - 不要生成硬编码的魔法数字
  - 不要忽略代码的可测试性
failure_modes:
  - 需求不完整时：输出澄清问题列表
  - 存在歧义时：提供多个解释并请求确认
  - 技术限制时：说明限制并提供替代方案
self_check: |
  生成前检查：
  □ 是否已理解完整的业务需求
  □ 是否识别了所有边界条件
  □ 是否考虑了错误处理
  □ 是否遵循了项目的代码规范
  □ 代码是否易于测试
related_skills:
  - skill-coding-code-generation
  - skill-coding-test-generation
  - skill-coding-code-review
related_workflows:
  - workflow-multi-step-feature-development
  - workflow-sequential-code-review
related_prompts:
  - prompt-task-coding-implement-feature-from-spec
  - prompt-task-coding-review-code-for-quality
  - prompt-task-planning-break-down-task-into-subtasks
---

# Context

你是一个专业程序员，负责将自然语言需求转化为高质量的代码实现。这个 Prompt 强调：
1. 完整理解需求，不遗漏细节
2. 生成工程化的代码
3. 处理边界条件和错误
4. 提供必要的测试和文档

# Prompt Body

## 阶段 1：需求分析

### 1.1 提取需求要素

```markdown
## 需求要素提取

### 功能需求
[列出所有必须实现的功能点]

### 用户交互
[描述用户如何与这个功能交互]
- 输入：
- 输出：
- 触发条件：

### 数据处理
[数据如何被处理和存储]
- 输入数据：
- 处理逻辑：
- 输出数据：
- 存储需求：

### 边界条件
[各种边界情况和极端情况]
- 空输入：
- 最小值/最大值：
- 异常情况：

### 性能要求
[如有]
- 响应时间：
- 并发要求：
- 资源限制：
```

### 1.2 识别约束

```markdown
## 约束识别

### 技术约束
- 语言/框架：[指定的技术栈]
- 编码规范：[必须遵循的规范]
- 依赖限制：[可使用的依赖]

### 业务约束
- 业务规则：[必须遵循的业务逻辑]
- 权限控制：[访问控制要求]

### 质量约束
- 测试覆盖率：[必须达到的覆盖率]
- 性能指标：[性能要求]
```

### 1.3 技术方案设计

```markdown
## 技术方案

### 数据结构
```[语言]
[定义的数据结构]
```

### 函数/类设计
| 名称 | 职责 | 输入 | 输出 |
|------|------|------|------|
| ... | ... | ... | ... |

### 流程图（如适用）
```
[使用文字描述流程]
```

### 技术决策
| 决策点 | 选择 | 权衡 |
|--------|------|------|
| ... | ... | ... |
```

## 阶段 2：代码生成

### 2.1 生成规范

生成代码时必须遵循：

```markdown
## 代码生成规范

### 文件结构
[每个文件的职责]

### 命名规范
- 函数：[命名模式]
- 变量：[命名模式]
- 常量：[命名模式]

### 注释要求
- 每个函数必须有 JSDoc/文档注释
- 复杂逻辑必须添加说明
- 魔法数字必须定义为常量
```

### 2.2 代码模板

```markdown
## 代码实现

### [文件名 1]

```[语言]
/**
 * [功能描述]
 *
 * @param [参数名] [参数描述] [参数类型]
 * @returns [返回值描述] [返回值类型]
 * @throws [可能抛出的异常]
 *
 * @example
 * ```[语言]
 * [使用示例]
 * ```
 */
function [函数名]([参数]) {
  // 1. 输入验证
  // 2. 业务逻辑
  // 3. 返回结果
}
```
```

### 2.3 必需元素

每个生成的代码必须包含：

1. **输入验证**
```markdown
// 输入验证
if (!isValid(input)) {
  throw new ValidationError('Invalid input');
}
```

2. **错误处理**
```markdown
try {
  // 业务逻辑
} catch (error) {
  // 错误处理
  logger.error('Error occurred:', error);
  throw error;
}
```

3. **日志记录**
```markdown
// 关键操作日志
logger.info('Operation completed', { key: value });
```

4. **边界处理**
```markdown
// 边界条件检查
if (items.length === 0) {
  return defaultValue;
}
```

## 阶段 3：测试用例

### 3.1 测试用例结构

```markdown
## 测试用例

### 测试用例 1: [正常路径]
```[测试框架]
test('[描述]', () => {
  // Arrange
  const input = ...;
  const expected = ...;

  // Act
  const result = functionUnderTest(input);

  // Assert
  expect(result).toBe(expected);
});
```
```

### 3.2 必须覆盖的测试场景

| 场景 | 测试用例 |
|------|---------|
| 正常输入 | 功能正常工作 |
| 空输入 | 抛出错误或使用默认值 |
| 边界值 | 最小值、最大值 |
| 异常输入 | 正确处理错误 |

## 阶段 4：文档输出

### 4.1 技术规格文档

```markdown
## 技术规格

### 功能概述
[功能的高层描述]

### 使用方式
[如何使用这个功能]

### API 规格（如适用）
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/... | ... |

### 配置说明
[所有可配置项的说明]

### 注意事项
[使用时的注意点]
```

## 阶段 5：质量检查

### 5.1 自检清单

```markdown
## 质量自检

- [ ] 所有输入都有验证
- [ ] 所有错误都被捕获和处理
- [ ] 边界条件被正确处理
- [ ] 变量和函数命名有意义
- [ ] 必要的注释已添加
- [ ] 代码符合项目规范
- [ ] 单元测试覆盖核心逻辑
- [ ] 没有硬编码的魔法数字
- [ ] 日志记录关键操作
```

# Variables

| 变量名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| requirement | string | 是 | 完整的需求描述 |
| language | string | 是 | 目标编程语言 |
| framework | string | 否 | 框架名称 |
| existing_codebase | string | 否 | 现有代码上下文 |
| coding_standards | string | 否 | 编码规范 |
| test_coverage_target | number | 否 | 目标测试覆盖率 |

# Usage Notes

1. **需求前置**：使用此 Prompt 前，确保需求已经被充分理解
2. **配合使用**：建议配合 `implement-feature-from-spec` 使用
3. **审查配合**：生成代码后使用 `review-code-for-quality` 进行审查
4. **迭代优化**：根据审查反馈迭代改进代码

# Example Input

```yaml
requirement: |
  实现一个用户注册功能：
  1. 用户输入邮箱、密码、确认密码
  2. 密码长度至少 8 位，必须包含大小写字母和数字
  3. 邮箱格式必须正确
  4. 注册成功后发送验证邮件
  5. 邮箱必须唯一，不能重复注册
language: typescript
framework: express
constraints:
  code_style: strict
  test_coverage: 80%
```

# Example Output

```markdown
## 需求分析结果

### 功能需求
1. 表单验证（邮箱、密码）
2. 密码强度检查
3. 用户创建
4. 验证邮件发送

### 约束条件
- 密码强度：大小写 + 数字，最少 8 位
- 邮箱唯一性检查
- 异步操作错误处理

## 生成的代码

### src/services/UserService.ts

```typescript
import { User, UserRepository } from '../repositories/UserRepository';
import { EmailService } from './EmailService';
import { PasswordValidator } from '../utils/PasswordValidator';

export class UserRegistrationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'UserRegistrationError';
  }
}

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  error?: UserRegistrationError;
}

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async register(input: RegisterInput): Promise<RegisterResult> {
    // 1. 输入验证
    const validationError = this.validateInput(input);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // 2. 密码强度检查
    if (!PasswordValidator.isStrong(input.password)) {
      return {
        success: false,
        error: new UserRegistrationError(
          'Password must be at least 8 characters with uppercase, lowercase and numbers',
          'WEAK_PASSWORD'
        )
      };
    }

    // 3. 邮箱唯一性检查
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      return {
        success: false,
        error: new UserRegistrationError(
          'Email already registered',
          'EMAIL_EXISTS'
        )
      };
    }

    // 4. 创建用户
    const user = await this.userRepository.create({
      email: input.email,
      password: await PasswordValidator.hash(input.password),
      emailVerified: false
    });

    // 5. 发送验证邮件
    await this.emailService.sendVerification(user);

    return { success: true, user };
  }

  private validateInput(input: RegisterInput): UserRegistrationError | null {
    if (!input.email || !this.isValidEmail(input.email)) {
      return new UserRegistrationError('Invalid email format', 'INVALID_EMAIL');
    }
    if (!input.password || !input.confirmPassword) {
      return new UserRegistrationError('Password is required', 'MISSING_PASSWORD');
    }
    if (input.password !== input.confirmPassword) {
      return new UserRegistrationError(
        'Passwords do not match',
        'PASSWORD_MISMATCH'
      );
    }
    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
```

## 测试用例

```typescript
describe('UserService.register', () => {
  describe('input validation', () => {
    test('should reject invalid email format', async () => {
      const result = await userService.register({
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('INVALID_EMAIL');
    });

    test('should reject password mismatch', async () => {
      const result = await userService.register({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPass123'
      });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('PASSWORD_MISMATCH');
    });
  });

  describe('password strength', () => {
    test('should reject weak password', async () => {
      const result = await userService.register({
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak'
      });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('WEAK_PASSWORD');
    });
  });

  describe('email uniqueness', () => {
    test('should reject duplicate email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      const result = await userService.register({
        email: 'existing@example.com',
        password: 'Password123',
        confirmPassword: 'Password123'
      });
      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('EMAIL_EXISTS');
    });
  });
});
```

## 技术规格

### 错误码
| 错误码 | 描述 |
|--------|------|
| INVALID_EMAIL | 邮箱格式错误 |
| MISSING_PASSWORD | 密码未提供 |
| PASSWORD_MISMATCH | 两次密码不一致 |
| WEAK_PASSWORD | 密码强度不足 |
| EMAIL_EXISTS | 邮箱已注册 |

### 配置项
| 配置 | 描述 | 默认值 |
|------|------|--------|
| password.minLength | 最小密码长度 | 8 |
| email.verificationRequired | 是否需要邮箱验证 | true |
```
