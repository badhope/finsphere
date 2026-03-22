---
id: prompt-everyday-checklist
name: Checklist Generator
summary: 清单生成器
type: prompt
status: active
version: 1.0.0
owner: skill-repository
category: everyday
sub_category: productivity
tags:
  - checklist
  - todo
  - planning
  - productivity
  - daily-use
intent: |
  帮助用户创建各类清单，包括待办事项清单、旅行清单、会议清单等。
applicable_models:
  - "*"
input_requirements:
  - checklist_type: string (required) 清单类型（待办/旅行/搬家/会议/购物/学习/其他）
  - context: string (optional) 具体场景描述
  - duration: string (optional) 时间范围（一天/一周/一个月）
output_requirements:
  - categories: list 清单分类
  - items: list 清单项目
  - tips: string 实用建议
usage_example: |
  输入：
  - 类型：旅行
  - 场景：去海边度假一周

  输出：
  - 分类：证件、衣物、电子设备、洗漱用品...
  - 项目：护照、手机、泳衣、防晒霜...
---

# ✅ 清单生成器

## 🎯 选择清单类型

| 类型 | 适用场景 | 特点 |
|------|---------|------|
| 📋 待办清单 | 日常工作管理 | 优先级标注 |
| ✈️ 旅行清单 | 出差/度假准备 | 分类清晰 |
| 🏠 搬家清单 | 搬家准备 | 时间节点 |
| 📊 会议清单 | 会议准备/记录 | 议程导向 |
| 🛒 购物清单 | 超市/电商购物 | 分类+数量 |
| 📚 学习清单 | 学习计划制定 | 进度跟踪 |

## 🚀 快速生成

告诉我：
1. **清单类型**：（如上选择）
2. **具体场景**：要去哪？做什么？
3. **时间范围**：一天？一周？

## 💡 清单设计原则

### 优秀清单的特点
- ✅ 分类清晰
- ✅ 每项简洁
- ✅ 重要项标注
- ✅ 可勾选完成

### 检查清单公式
```
[类别1]
  □ 项目1.1
  □ 项目1.2
[类别2]
  □ 项目2.1
```

## 📝 示例：搬家清单

```
【重要证件】⭐
  □ 身份证
  □ 户口本
  □ 房产证

【衣物】
  □ 当季衣服
  □ 床上用品
  □ 鞋子

【厨房用品】
  □ 餐具
  □ 调料（扔掉或带走）
```

---

**告诉我你需要什么清单，我来帮你生成！**
