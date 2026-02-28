#!/bin/bash

# FinSphere Pro 环境配置工具 (Linux/macOS版本)

show_menu() {
    echo "=================================================="
    echo "        FinSphere Pro 智能环境配置工具"
    echo "=================================================="
    echo
    echo "请选择操作:"
    echo "1. 🔧 全自动环境配置"
    echo "2. 🔍 环境状态检测"  
    echo "3. 🎮 启动开发服务器"
    echo "4. 🏗️  构建生产版本"
    echo "5. 🧹 清理项目缓存"
    echo "6. 🎯 一键完整流程 (检测+配置+启动)"
    echo "7. 🚪 退出"
    echo
}

setup_environment() {
    echo "🔧 开始全自动环境配置..."
    python3 scripts/setup.py
    read -p "按回车键继续..."
}

detect_environment() {
    echo "🔍 运行环境检测..."
    python3 scripts/detector.py
    read -p "按回车键继续..."
}

start_dev_server() {
    echo "🎮 启动开发服务器..."
    python3 manage.py dev
}

build_project() {
    echo "🏗️  开始构建项目..."
    python3 manage.py build
    read -p "按回车键继续..."
}

clean_project() {
    echo "🧹 清理项目缓存..."
    python3 manage.py clean
    read -p "按回车键继续..."
}

run_complete_flow() {
    echo "🎯 执行完整流程..."
    python3 manage.py all
}

# 主循环
while true; do
    clear
    show_menu
    
    read -p "请输入选项 (1-7): " choice
    
    case $choice in
        1)
            setup_environment
            ;;
        2)
            detect_environment
            ;;
        3)
            start_dev_server
            ;;
        4)
            build_project
            ;;
        5)
            clean_project
            ;;
        6)
            run_complete_flow
            ;;
        7)
            echo "再见！"
            exit 0
            ;;
        *)
            echo "无效选择，请重新输入"
            sleep 1
            ;;
    esac
done