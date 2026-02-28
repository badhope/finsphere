# FinSphere Pro 开发环境自动配置脚本

echo "=========================================="
echo "  FinSphere Pro 开发环境自动配置"
echo "=========================================="
echo.

# 检查Node.js版本
echo "🔍 检查Node.js环境..."
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js版本: $nodeVersion"
    
    # 检查版本是否符合要求
    if ($nodeVersion -match "v(\d+)\.") {
        $majorVersion = [int]$matches[1]
        if ($majorVersion -lt 18) {
            Write-Host "⚠ 警告: Node.js版本低于18.0.0，建议升级到v18或更高版本"
        }
    }
} else {
    Write-Host "❌ 未找到Node.js，请先安装Node.js (https://nodejs.org)"
    exit 1
}

# 检查npm版本
echo "🔍 检查npm版本..."
if (Get-Command npm -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "✓ npm版本: $npmVersion"
} else {
    Write-Host "❌ 未找到npm"
    exit 1
}

# 检查项目依赖
echo "🔍 检查项目依赖..."
if (Test-Path "package.json") {
    Write-Host "✓ 找到package.json文件"
} else {
    Write-Host "❌ 未找到package.json文件"
    exit 1
}

# 安装依赖
echo "📦 安装项目依赖..."
Write-Host "这可能需要几分钟时间，请耐心等待..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 依赖安装成功"
} else {
    Write-Host "❌ 依赖安装失败"
    exit 1
}

# 创建环境配置文件
echo "⚙️ 配置环境变量..."
if (-not (Test-Path ".env.local")) {
    Copy-Item ".env.development" ".env.local"
    Write-Host "✓ 创建本地环境配置文件"
}

# 构建类型声明文件
echo "🔨 生成类型声明文件..."
npm run type-check

# 启动开发服务器
echo "🚀 启动开发服务器..."
Write-Host "开发服务器将在 http://localhost:3000 启动"
Write-Host "按 Ctrl+C 可以停止服务器"
echo.

npm run dev