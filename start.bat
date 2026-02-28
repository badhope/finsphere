@echo off
chcp 65001 > nul
title FinSphere Pro 一键启动

echo ==================================================
echo        FinSphere Pro 一键智能启动
echo ==================================================
echo.

echo 🔍 正在检测环境状态...

REM 检查Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Python，请先安装 Python 3.6+
    pause
    exit /b 1
)

REM 检查项目管理脚本
if not exist "manage.py" (
    echo ❌ 未找到项目管理脚本
    pause
    exit /b 1
)

echo ✅ 环境检查通过

echo.
echo 🚀 启动智能配置流程...
echo.

python manage.py all

echo.
echo ==================================================
echo        FinSphere Pro 启动完成！
echo ==================================================
echo 访问地址: http://localhost:3000
echo 按 Ctrl+C 可以停止开发服务器
echo.

REM 保持窗口开启
pause

