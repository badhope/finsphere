@echo off
chcp 65001 > nul
title FinSphere Pro 静态管理面板

echo ==================================================
echo        🌟 FinSphere Pro 静态管理面板 🌟
echo ==================================================
echo.
echo 这是一个无需服务器的简化版本管理面板
echo 可以直接在浏览器中使用所有基本功能
echo.

REM 获取当前目录
set "current_dir=%~dp0"
set "html_file=%current_dir%manager.html"

echo 🔍 正在检查管理面板文件...
if exist "%html_file%" (
    echo ✅ 找到管理面板文件
    echo 🌐 即将打开管理界面...
    echo.
    
    REM 尝试使用默认浏览器打开
    start "" "%html_file%"
    
    echo ==================================================
    echo 管理面板已在浏览器中打开！
    echo 如果没有自动打开，请手动访问以下文件：
    echo %html_file%
    echo ==================================================
    echo.
    echo 功能说明：
    echo • 启动开发服务器 - 检查并启动项目
    echo • 环境状态检测 - 全面检查开发环境
    echo • 自动环境配置 - 一键配置所需环境
    echo • 实时操作日志 - 显示详细操作过程
    echo.
) else (
    echo ❌ 未找到管理面板文件
    echo 请确保 manager.html 文件存在
    echo.
)

pause