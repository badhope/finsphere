#!/bin/bash

# FinSphere Pro 开发环境自动配置脚本

echo "=========================================="
echo "  FinSphere Pro 开发环境自动配置"
echo "=========================================="
echo

# 检查Node.js版本
echo "🔍 检查Node.js环境..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js版本: $NODE_VERSION"
    
    # 检查版本是否符合要求
    if [[ $NODE_VERSION =~ ^v([0-9]+)\. ]]; then
        MAJOR_VERSION=${BASH_REMATCH[1]}
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            echo "⚠ 警告: Node.js版本低于18.0.0，建议升级到v18或更高版本"
        fi
    fi
else
    echo "❌ 未找到Node.js，请先安装Node.js (https://nodejs.org)"
    exit 1
fi

# 检查npm版本
echo "🔍 检查npm版本..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm版本: $NPM_VERSION"
else
    echo "❌ 未找到npm"
    exit 1
fi

# 检查项目依赖
echo "🔍 检查项目依赖..."
if [ -f "package.json" ]; then
    echo "✓ 找到package.json文件"
else
    echo "❌ 未找到package.json文件"
    exit 1
fi

# 安装依赖
echo "📦 安装项目依赖..."
echo "这可能需要几分钟时间，请耐心等待..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 创建环境配置文件
echo "⚙️ 配置环境变量..."
if [ ! -f ".env.local" ]; then
    cp .env.development .env.local
    echo "✓ 创建本地环境配置文件"
fi

# 构建类型声明文件
echo "🔨 生成类型声明文件..."
npm run type-check

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "开发服务器将在 http://localhost:3000 启动"
echo "按 Ctrl+C 可以停止服务器"
echo

npm run dev