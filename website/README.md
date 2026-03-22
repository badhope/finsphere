# AI Skill Repository - Visual Website

> 高度可视化的项目介绍网站，展示 AI Skill & Prompt Repository 的核心功能和内容

## 🎨 技术栈

### 前端
- **Next.js 14** (App Router) - React 全栈框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 原子化 CSS
- **Framer Motion** - 页面动画
- **GSAP** - 高性能动画
- **Three.js** - 3D 图形
- **SplitType** - 文字拆分动画
- **Lenis** - 平滑滚动

### 后端
- **FastAPI** - Python 高性能 API
- **Pydantic** - 数据验证
- **Loguru** - 日志系统
- **Markdown** - 内容解析

## 📁 项目结构

```
website/
├── src/
│   ├── app/
│   │   ├── page.tsx          # 首页
│   │   ├── layout.tsx        # 布局
│   │   ├── globals.css       # 全局样式
│   │   ├── features/
│   │   │   └── page.tsx      # 功能页
│   │   ├── docs/
│   │   │   └── page.tsx      # 文档页
│   │   └── about/
│   │       └── page.tsx      # 关于页
│   └── components/
├── backend/
│   ├── main.py               # API 服务
│   └── requirements.txt      # Python 依赖
├── package.json
├── tailwind.config.js
└── next.config.js
```

## 🚀 快速开始

### 前端开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build
```

### 后端开发

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate   # Windows

# 安装依赖
pip install -r backend/requirements.txt

# 运行 API 服务
cd backend
uvicorn main:app --reload
```

## ✨ 功能特性

- 🎯 **首页 Hero** - 3D 粒子背景 + GSAP 字符动画
- 📊 **数字统计** - 动态计数动画
- 🃏 **功能卡片** - 悬浮 3D 效果
- 📑 **分类导航** - 清晰的内容组织
- 🌐 **响应式设计** - 完美适配所有设备
- 🔍 **API 接口** - 动态内容管理

## 📦 集成库使用统计

| 类别 | 库 | 应用场景数 |
|------|-----|-----------|
| 动画 | GSAP | 3 |
| 动画 | Framer Motion | 3 |
| 3D | Three.js | 3 |
| 文字 | SplitType | 3 |
| 滚动 | Lenis | 3 |
| 后端 | FastAPI | 3 |
| 后端 | Pydantic | 3 |
| 后端 | Loguru | 3 |
| 后端 | Markdown | 3 |
| 图片 | Pillow | 3 |

## 🎨 视觉效果

- 字符拆分动画 (SplitType + GSAP)
- 页面过渡动画 (Framer Motion)
- 3D 粒子背景 (Three.js)
- 悬浮效果 (CSS + Framer Motion)
- 滚动视差 (Lenis + GSAP)
- 数字计数动画 (GSAP)

## 📱 响应式断点

| 设备 | 断点 | 布局 |
|------|------|------|
| Mobile | < 640px | 单列 |
| Tablet | 640-1024px | 双列 |
| Desktop | 1024-1440px | 正常 |
| Large | > 1440px | 扩展 |

## 🔗 相关链接

- [主项目仓库](https://github.com/badhope/skill)
- [技术方案文档](../docs/WEBSITE-TECH-SPEC.md)
- [评估报告](../docs/EVALUATION-REPORT.md)

## 📄 许可证

MIT License - 详见主项目
