@echo off
chcp 65001 > nul
title FinSphere Pro 新手友好启动器

echo ==================================================
echo        🌟 FinSphere Pro 新手启动器 🌟
echo ==================================================
echo.
echo 你好！我是你的智能助手，会帮你一步步配置项目。
echo 即使你是编程新手也没关系，跟着提示操作就好！
echo.

REM 检查Python环境
echo 🔍 第一步：检查Python环境...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 没有找到Python环境
    echo 💡 请先安装Python 3.6或更高版本
    echo 🌐 下载地址：https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Python环境正常
)

echo.
echo 🎯 第二步：选择启动方式
echo.
echo 1. 🌐 使用Web管理面板（推荐新手）
echo 2. 🎮 直接启动开发服务器  
echo 3. 🔧 环境配置和检测
echo 4. 📚 查看新手指南
echo 5. 🚪 退出
echo.

set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto web_manager
if "%choice%"=="2" goto direct_start
if "%choice%"=="3" goto setup_env
if "%choice%"=="4" goto show_guide
if "%choice%"=="5" goto exit

echo 输入无效，请重新选择
goto start

:web_manager
cls
echo 🌐 启动Web管理面板...
echo.
echo 💡 提示：浏览器将会自动打开管理界面
echo    你可以在界面上点击按钮来操作项目
echo.
python web_manager.py
goto end

:direct_start
cls
echo 🎮 直接启动开发服务器...
echo.
echo 🔍 正在检查环境...
if not exist "node_modules" (
    echo ⚠️  检测到缺少依赖包
    echo 🔄 正在自动安装...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        echo 💡 建议使用选项1的Web管理面板
        pause
        goto start
    )
)
echo ✅ 环境检查通过
echo 🚀 启动开发服务器...
npm run dev
goto end

:setup_env
cls
echo 🔧 环境配置和检测...
echo.
echo 🔄 运行智能环境检测...
python scripts\detector.py
echo.
echo 🛠️  运行自动环境配置...
python setup.py
echo.
echo ✅ 环境配置完成！
pause
goto start

:show_guide
cls
echo 📚 新手使用指南
echo.
echo 由于这是文本界面，建议你：
echo 1. 查看项目根目录的 BEGINNER_GUIDE.md 文件
echo 2. 运行选项1使用Web管理面板（更直观）
echo 3. 访问在线文档获取更多信息
echo.
echo 💡 小贴士：
echo • 遇到问题时先查看实时日志
echo • 可以随时重新运行此程序
echo • Web管理面板有更详细的操作指导
echo.
pause
goto start

:exit
echo 再见！期待下次见到你 😊
exit /b 0

:end
echo.
echo ==================================================
echo        FinSphere Pro 运行结束
echo ==================================================
echo 感谢使用！有任何问题都可以重新运行此程序。
echo.
pause