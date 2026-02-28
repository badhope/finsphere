@echo off
chcp 65001 > nul
title FinSphere Pro 环境配置工具

echo ==================================================
echo        FinSphere Pro 智能环境配置工具
echo ==================================================
echo.

:menu
echo 请选择操作:
echo 1. 🔧 全自动环境配置
echo 2. 🔍 环境状态检测  
echo 3. 🎮 启动开发服务器
echo 4. 🏗️  构建生产版本
echo 5. 🧹 清理项目缓存
echo 6. 🎯 一键完整流程 (检测+配置+启动)
echo 7. 🚪 退出
echo.

set /p choice=请输入选项 (1-7): 

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto detect  
if "%choice%"=="3" goto dev
if "%choice%"=="4" goto build
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto all
if "%choice%"=="7" goto exit

echo 无效选择，请重新输入
echo.
goto menu

:setup
cls
echo 🔧 开始全自动环境配置...
python scripts\setup.py
pause
goto menu

:detect
cls
echo 🔍 运行环境检测...
python scripts\detector.py
pause
goto menu

:dev
cls
echo 🎮 启动开发服务器...
python manage.py dev
goto menu

:build
cls
echo 🏗️  开始构建项目...
python manage.py build
pause
goto menu

:clean
cls
echo 🧹 清理项目缓存...
python manage.py clean
pause
goto menu

:all
cls
echo 🎯 执行完整流程...
python manage.py all
goto menu

:exit
echo 再见！
exit /b 0