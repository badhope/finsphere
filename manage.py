#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FinSphere Pro 项目管理器
提供一键启动、环境检测、自动配置等功能
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path
import time

class ProjectManager:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.scripts_dir = self.project_root / "scripts"
        
    def run_setup(self):
        """运行环境配置"""
        print("🚀 启动智能环境配置...")
        setup_script = self.scripts_dir / "setup.py"
        if setup_script.exists():
            subprocess.run([sys.executable, str(setup_script)])
        else:
            print("❌ 找不到配置脚本")
    
    def run_detection(self):
        """运行环境检测"""
        print("🔍 启动环境检测...")
        detector_script = self.scripts_dir / "detector.py"
        if detector_script.exists():
            subprocess.run([sys.executable, str(detector_script)])
        else:
            print("❌ 找不到检测脚本")
    
    def start_dev_server(self):
        """启动开发服务器"""
        print("🎮 启动开发服务器...")
        
        # 检查依赖
        if not (self.project_root / "node_modules").exists():
            print("⚠️  检测到缺少依赖，正在安装...")
            subprocess.run(["npm", "install"], cwd=self.project_root)
        
        # 启动开发服务器
        try:
            subprocess.run(["npm", "run", "dev"], cwd=self.project_root)
        except KeyboardInterrupt:
            print("\n👋 开发服务器已停止")
    
    def build_project(self):
        """构建项目"""
        print("🏗️  开始构建项目...")
        
        try:
            result = subprocess.run(["npm", "run", "build"], 
                                  cwd=self.project_root,
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ 构建成功！")
                print(f"输出目录: {self.project_root / 'dist'}")
            else:
                print("❌ 构建失败:")
                print(result.stderr)
                
        except Exception as e:
            print(f"❌ 构建出错: {str(e)}")
    
    def clean_project(self):
        """清理项目"""
        print("🧹 清理项目缓存...")
        
        cleanup_paths = [
            "node_modules",
            "dist",
            ".cache",
            "temp",
            ".husky/_"
        ]
        
        for path_str in cleanup_paths:
            path = self.project_root / path_str
            if path.exists():
                import shutil
                if path.is_dir():
                    shutil.rmtree(path)
                    print(f"  已删除: {path_str}")
                else:
                    path.unlink()
                    print(f"  已删除: {path_str}")
        
        print("✅ 清理完成")

def main():
    parser = argparse.ArgumentParser(description="FinSphere Pro 项目管理工具")
    parser.add_argument("command", choices=["setup", "detect", "dev", "build", "clean", "all"],
                       help="执行的命令")
    parser.add_argument("--port", type=int, default=3000, help="开发服务器端口")
    
    args = parser.parse_args()
    
    manager = ProjectManager()
    
    if args.command == "setup":
        manager.run_setup()
    elif args.command == "detect":
        manager.run_detection()
    elif args.command == "dev":
        manager.start_dev_server()
    elif args.command == "build":
        manager.build_project()
    elif args.command == "clean":
        manager.clean_project()
    elif args.command == "all":
        print("🎯 执行完整流程: 检测 -> 配置 -> 启动")
        manager.run_detection()
        manager.run_setup()
        manager.start_dev_server()

if __name__ == "__main__":
    main()

