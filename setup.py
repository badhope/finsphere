#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FinSphere Pro 智能环境配置器
自动检测、下载、配置开发环境的一站式解决方案
"""

import os
import sys
import subprocess
import json
import platform
import urllib.request
import zipfile
import shutil
from pathlib import Path
import hashlib
from typing import Dict, List, Optional
import time

class EnvironmentConfigurator:
    def __init__(self):
        self.project_root = Path(__file__).parent
        self.config_file = self.project_root / ".env.config"
        self.requirements_cache = {}
        
    def log(self, message: str, level: str = "INFO"):
        """统一日志输出"""
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [{level}] {message}")
        
    def check_nodejs(self) -> bool:
        """检查Node.js是否已安装"""
        try:
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                version = result.stdout.strip()
                self.log(f"✅ Node.js 已安装: {version}")
                return True
        except FileNotFoundError:
            pass
        return False
        
    def download_nodejs(self) -> bool:
        """自动下载并安装Node.js"""
        self.log("🔍 正在检测操作系统...")
        system = platform.system().lower()
        arch = platform.machine().lower()
        
        # 确定下载URL
        base_url = "https://nodejs.org/dist/v18.18.0/"
        
        if system == "windows":
            filename = "node-v18.18.0-win-x64.zip"
            download_url = base_url + filename
        elif system == "darwin":  # macOS
            filename = "node-v18.18.0-darwin-x64.tar.gz"
            download_url = base_url + filename
        else:  # Linux
            filename = "node-v18.18.0-linux-x64.tar.xz"
            download_url = base_url + filename
            
        self.log(f"📥 准备下载 Node.js 18.18.0 ({system}-{arch})")
        self.log(f"🔗 下载地址: {download_url}")
        
        # 创建临时目录
        temp_dir = self.project_root / "temp"
        temp_dir.mkdir(exist_ok=True)
        download_path = temp_dir / filename
        
        try:
            # 下载文件
            self.log("⏳ 正在下载 Node.js...")
            urllib.request.urlretrieve(download_url, download_path, self._download_progress)
            self.log("✅ Node.js 下载完成")
            
            # 解压文件
            self.log("🔧 正在解压 Node.js...")
            if system == "windows":
                with zipfile.ZipFile(download_path, 'r') as zip_ref:
                    zip_ref.extractall(temp_dir)
                
                # 移动到项目目录
                extracted_dir = temp_dir / "node-v18.18.0-win-x64"
                node_dir = self.project_root / "nodejs"
                if node_dir.exists():
                    shutil.rmtree(node_dir)
                shutil.move(str(extracted_dir), str(node_dir))
                
                # 添加到PATH
                node_bin = node_dir / "node.exe"
                npm_bin = node_dir / "npm.cmd"
                
                self.log(f"✅ Node.js 已安装到: {node_dir}")
                self.log(f"💡 请将以下路径添加到系统PATH:")
                self.log(f"   {node_dir}")
                
            else:
                # Unix系统处理
                import tarfile
                with tarfile.open(download_path, 'r') as tar_ref:
                    tar_ref.extractall(temp_dir)
                    
                extracted_dir = temp_dir / "node-v18.18.0-linux-x64"
                node_dir = self.project_root / "nodejs"
                if node_dir.exists():
                    shutil.rmtree(node_dir)
                shutil.move(str(extracted_dir), str(node_dir))
                
                self.log(f"✅ Node.js 已安装到: {node_dir}")
                self.log(f"💡 请将以下路径添加到 ~/.bashrc 或 ~/.zshrc:")
                self.log(f"   export PATH=\"{node_dir}/bin:$PATH\"")
            
            # 清理临时文件
            shutil.rmtree(temp_dir)
            return True
            
        except Exception as e:
            self.log(f"❌ Node.js 安装失败: {str(e)}", "ERROR")
            return False
    
    def _download_progress(self, block_num, block_size, total_size):
        """下载进度回调"""
        percent = min(100, (block_num * block_size * 100) // total_size)
        if percent % 10 == 0:  # 每10%显示一次
            self.log(f"   下载进度: {percent}%")
    
    def check_npm_packages(self) -> bool:
        """检查npm包是否已安装"""
        node_modules = self.project_root / "node_modules"
        package_json = self.project_root / "package.json"
        
        if not package_json.exists():
            self.log("❌ 找不到 package.json 文件", "ERROR")
            return False
            
        if node_modules.exists():
            self.log("✅ npm 包已安装")
            return True
        return False
    
    def install_npm_packages(self) -> bool:
        """安装npm包"""
        self.log("📦 正在安装 npm 包...")
        
        # 检查使用哪个npm命令
        npm_cmd = "npm"
        if (self.project_root / "nodejs").exists():
            # 使用本地安装的npm
            if platform.system().lower() == "windows":
                npm_cmd = str(self.project_root / "nodejs" / "npm.cmd")
            else:
                npm_cmd = str(self.project_root / "nodejs" / "bin" / "npm")
        
        try:
            # 设置淘宝镜像源（国内加速）
            subprocess.run([npm_cmd, 'config', 'set', 'registry', 'https://registry.npmmirror.com'], 
                         cwd=self.project_root, check=True)
            
            # 安装依赖
            result = subprocess.run([npm_cmd, 'install'], 
                                  cwd=self.project_root, 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                self.log("✅ npm 包安装成功")
                return True
            else:
                self.log(f"❌ npm 包安装失败: {result.stderr}", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"❌ 安装过程出错: {str(e)}", "ERROR")
            return False
    
    def setup_development_tools(self) -> bool:
        """安装开发工具"""
        self.log("🛠️  正在安装开发工具...")
        
        dev_deps = [
            "@typescript-eslint/eslint-plugin",
            "@typescript-eslint/parser", 
            "eslint",
            "prettier",
            "husky",
            "lint-staged"
        ]
        
        npm_cmd = self._get_npm_command()
        
        try:
            for dep in dev_deps:
                self.log(f"  安装 {dep}...")
                subprocess.run([npm_cmd, 'install', '-D', dep], 
                             cwd=self.project_root, 
                             capture_output=True)
            
            self.log("✅ 开发工具安装完成")
            return True
            
        except Exception as e:
            self.log(f"❌ 开发工具安装失败: {str(e)}", "ERROR")
            return False
    
    def _get_npm_command(self) -> str:
        """获取正确的npm命令路径"""
        if (self.project_root / "nodejs").exists():
            if platform.system().lower() == "windows":
                return str(self.project_root / "nodejs" / "npm.cmd")
            else:
                return str(self.project_root / "nodejs" / "bin" / "npm")
        return "npm"
    
    def create_environment_config(self):
        """创建环境配置文件"""
        self.log("⚙️  正在创建环境配置...")
        
        env_configs = {
            "development": {
                "VITE_APP_TITLE": "FinSphere Pro Dev",
                "VITE_API_BASE_URL": "/api",
                "VITE_MOCK_ENABLED": "true",
                "VITE_DEBUG_MODE": "true"
            },
            "production": {
                "VITE_APP_TITLE": "FinSphere Pro",
                "VITE_API_BASE_URL": "https://api.finsphere.com",
                "VITE_MOCK_ENABLED": "false", 
                "VITE_DEBUG_MODE": "false"
            }
        }
        
        # 创建不同环境的配置文件
        for env, config in env_configs.items():
            env_file = self.project_root / f".env.{env}"
            with open(env_file, 'w', encoding='utf-8') as f:
                f.write("# FinSphere Pro 环境配置文件\n")
                f.write(f"# Environment: {env}\n\n")
                for key, value in config.items():
                    f.write(f"{key}={value}\n")
        
        # 创建主环境文件（默认开发环境）
        main_env = self.project_root / ".env"
        shutil.copy(self.project_root / ".env.development", main_env)
        
        self.log("✅ 环境配置文件创建完成")
    
    def setup_git_hooks(self):
        """设置Git Hooks"""
        self.log("훅 Git Hooks 设置...")
        
        try:
            npm_cmd = self._get_npm_command()
            
            # 初始化husky
            subprocess.run([npm_cmd, 'pkg', 'set', 'scripts.prepare="husky install"'], 
                         cwd=self.project_root, capture_output=True)
            
            # 安装husky
            subprocess.run([npm_cmd, 'run', 'prepare'], 
                         cwd=self.project_root, capture_output=True)
            
            # 创建pre-commit hook
            hooks_dir = self.project_root / ".husky"
            hooks_dir.mkdir(exist_ok=True)
            
            pre_commit = hooks_dir / "pre-commit"
            with open(pre_commit, 'w') as f:
                f.write("""#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 运行代码检查..."
npm run lint
""")
            
            # 设置执行权限（Unix系统）
            if platform.system().lower() != "windows":
                subprocess.run(['chmod', '+x', str(pre_commit)])
            
            self.log("✅ Git Hooks 设置完成")
            
        except Exception as e:
            self.log(f"❌ Git Hooks 设置失败: {str(e)}", "WARNING")
    
    def run_diagnostics(self):
        """运行诊断检查"""
        self.log("📋 运行环境诊断...")
        
        checks = [
            ("Node.js版本", self.check_nodejs),
            ("npm包状态", self.check_npm_packages),
            ("TypeScript编译", lambda: self._check_typescript()),
            ("项目构建", lambda: self._check_build())
        ]
        
        results = []
        for name, check_func in checks:
            try:
                result = check_func()
                status = "✅ 通过" if result else "❌ 失败"
                self.log(f"  {name}: {status}")
                results.append((name, result))
            except Exception as e:
                self.log(f"  {name}: ❌ 错误 - {str(e)}", "ERROR")
                results.append((name, False))
        
        # 统计结果
        passed = sum(1 for _, result in results if result)
        total = len(results)
        self.log(f"\n📊 诊断结果: {passed}/{total} 项通过")
        
        if passed == total:
            self.log("🎉 环境配置完美！可以开始开发了！", "SUCCESS")
        elif passed >= total * 0.8:
            self.log("⚠️  环境基本可用，部分功能可能受限", "WARNING")
        else:
            self.log("❌ 环境存在问题，请检查上述错误", "ERROR")
    
    def _check_typescript(self) -> bool:
        """检查TypeScript编译"""
        try:
            npm_cmd = self._get_npm_command()
            result = subprocess.run([npm_cmd, 'run', 'build'], 
                                  cwd=self.project_root, 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False
    
    def _check_build(self) -> bool:
        """检查项目构建"""
        try:
            npm_cmd = self._get_npm_command()
            result = subprocess.run([npm_cmd, 'run', 'build'], 
                                  cwd=self.project_root, 
                                  capture_output=True, text=True)
            return result.returncode == 0
        except:
            return False
    
    def auto_configure(self):
        """全自动配置流程"""
        self.log("🚀 开始 FinSphere Pro 智能环境配置")
        self.log("=" * 50)
        
        # 1. 检查Node.js
        if not self.check_nodejs():
            self.log("🔍 检测到未安装 Node.js")
            if not self.download_nodejs():
                self.log("❌ Node.js 安装失败，程序退出", "ERROR")
                return False
        else:
            self.log("✅ Node.js 环境正常")
        
        # 2. 安装npm包
        if not self.check_npm_packages():
            self.log("📦 需要安装项目依赖")
            if not self.install_npm_packages():
                self.log("❌ npm包安装失败", "ERROR")
                return False
        else:
            self.log("✅ 项目依赖已安装")
        
        # 3. 创建环境配置
        self.create_environment_config()
        
        # 4. 安装开发工具
        self.setup_development_tools()
        
        # 5. 设置Git Hooks
        self.setup_git_hooks()
        
        # 6. 运行诊断
        self.run_diagnostics()
        
        self.log("=" * 50)
        self.log("🎊 智能配置完成！")
        self.log("💡 下一步:")
        self.log("   - 运行 'npm run dev' 启动开发服务器")
        self.log("   - 访问 http://localhost:3000 查看应用")
        self.log("   - 修改代码时会自动热重载")
        
        return True

def main():
    configurator = EnvironmentConfigurator()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--diagnose":
        configurator.run_diagnostics()
    else:
        configurator.auto_configure()

if __name__ == "__main__":
    main()