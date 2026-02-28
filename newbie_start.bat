@echo off
chcp 65001 > nul
title FinSphere Pro 新手启动器

echo ==================================================
echo        🌟 FinSphere Pro 新手友好启动器 🌟
echo ==================================================
echo.
echo 你好！我是你的智能助手，会帮你一步步配置项目。
echo 即使你是编程新手也没关系，跟着提示操作就好！
echo.

REM 检查Node.js环境
echo 🔍 第一步：检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 没有找到Node.js环境
    echo 💡 请先安装Node.js 16或更高版本
    echo 🌐 下载地址：https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Node.js环境正常
    node --version
)

echo.
echo 🎯 第二步：安装必要依赖...
echo 🔧 正在安装express和open模块...
npm install express open
if %errorlevel% neq 0 (
    echo ⚠️  依赖安装出现问题，但将继续尝试启动
)

echo.
echo 🚀 第三步：启动管理面板...
echo 💡 浏览器将自动打开管理界面
echo    你可以在界面上点击按钮来操作项目
echo.

node web_manager.js

echo.
echo ==================================================
echo        FinSphere Pro 运行结束
echo ==================================================
echo 感谢使用！有任何问题都可以重新运行此程序。
echo.
pause