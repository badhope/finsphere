#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FinSphere Pro 环境检测器
智能检测项目环境状态并提供修复建议
"""

import os
import sys
import subprocess
import json
import platform
from pathlib import Path
from typing import Dict, List, Tuple
import time

class EnvironmentDetector:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent  # 上级目录
        self.report = {}
        
    def detect_all(self) -> Dict:
        """执行全面环境检测"""
        print("🔍 开始环境检测...")
        print("=" * 50)
        
        checks = [
            ("系统信息", self.check_system_info),
            ("Node.js环境", self.check_nodejs),
            ("npm/yarn环境", self.check_package_manager),
            ("项目依赖", self.check_project_dependencies),
            ("配置文件", self.check_config_files),
            ("开发工具", self.check_dev_tools),
            ("安全配置", self.check_security_config),
            ("构建状态", self.check_build_status)
        ]
        
        for check_name, check_func in checks:
            print(f"\n📋 检测: {check_name}")
            print("-" * 30)
            try:
                result = check_func()
                self.report[check_name] = result
                self._print_result(result)
            except Exception as e:
                error_result = {"status": "error", "message": str(e)}
                self.report[check_name] = error_result
                print(f"❌ 检测出错: {str(e)}")
        
        return self.report
    
    def check_system_info(self) -> Dict:
        """检测系统基本信息"""
        return {
            "status": "info",
            "data": {
                "操作系统": platform.system(),
                "系统版本": platform.version(),
                "处理器架构": platform.machine(),
                "Python版本": sys.version.split()[0],
                "项目路径": str(self.project_root)
            }
        }
    
    def check_nodejs(self) -> Dict:
        """检测Node.js环境"""
        try:
            # 检查全局Node.js
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True)
            if result.returncode == 0:
                node_version = result.stdout.strip()
                return {
                    "status": "ok",
                    "message": f"Node.js {node_version} 已安装",
                    "version": node_version
                }
            
            # 检查本地安装的Node.js
            local_node = self.project_root / "nodejs" / "node.exe"
            if local_node.exists():
                result = subprocess.run([str(local_node), '--version'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    version = result.stdout.strip()
                    return {
                        "status": "warning",
                        "message": f"本地Node.js {version} 已安装，但未添加到PATH",
                        "version": version,
                        "local_path": str(local_node.parent)
                    }
            
            return {
                "status": "error",
                "message": "未检测到Node.js，请运行 setup.py 进行安装"
            }
            
        except Exception as e:
            return {
                "status": "error", 
                "message": f"Node.js检测失败: {str(e)}"
            }
    
    def check_package_manager(self) -> Dict:
        """检测包管理器"""
        managers = ["npm", "yarn", "pnpm"]
        available = []
        
        for manager in managers:
            try:
                result = subprocess.run([manager, '--version'], 
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    version = result.stdout.strip()
                    available.append(f"{manager} {version}")
            except:
                pass
        
        if available:
            return {
                "status": "ok",
                "message": "可用的包管理器: " + ", ".join(available)
            }
        else:
            return {
                "status": "error",
                "message": "未找到任何包管理器"
            }
    
    def check_project_dependencies(self) -> Dict:
        """检测项目依赖状态"""
        package_json = self.project_root / "package.json"
        node_modules = self.project_root / "node_modules"
        package_lock = self.project_root / "package-lock.json"
        
        if not package_json.exists():
            return {
                "status": "error",
                "message": "缺少 package.json 文件"
            }
        
        deps_status = []
        
        if node_modules.exists():
            deps_status.append("✅ node_modules 目录存在")
        else:
            deps_status.append("❌ 缺少 node_modules 目录")
        
        if package_lock.exists():
            deps_status.append("✅ package-lock.json 存在")
        else:
            deps_status.append("⚠️  缺少 package-lock.json")
        
        # 检查关键依赖
        try:
            with open(package_json, 'r', encoding='utf-8') as f:
                pkg_data = json.load(f)
            
            key_deps = ['vue', 'typescript', 'vite', 'ant-design-vue']
            missing_deps = []
            
            for dep in key_deps:
                if dep not in pkg_data.get('dependencies', {}) and \
                   dep not in pkg_data.get('devDependencies', {}):
                    missing_deps.append(dep)
            
            if missing_deps:
                deps_status.append(f"❌ 缺少关键依赖: {', '.join(missing_deps)}")
            else:
                deps_status.append("✅ 关键依赖完整")
                
        except Exception as e:
            deps_status.append(f"❌ package.json 解析失败: {str(e)}")
        
        status = "ok" if "❌" not in "".join(deps_status) else "warning"
        if "❌ 缺少 node_modules 目录" in deps_status:
            status = "error"
            
        return {
            "status": status,
            "message": "\n  " + "\n  ".join(deps_status)
        }
    
    def check_config_files(self) -> Dict:
        """检测配置文件"""
        required_files = [
            ".env",
            ".env.development", 
            ".env.production",
            "tsconfig.json",
            "vite.config.ts"
        ]
        
        missing = []
        present = []
        
        for file in required_files:
            if (self.project_root / file).exists():
                present.append(file)
            else:
                missing.append(file)
        
        if missing:
            return {
                "status": "warning",
                "message": f"缺少配置文件: {', '.join(missing)}",
                "present": present,
                "missing": missing
            }
        else:
            return {
                "status": "ok",
                "message": "所有必需配置文件都存在",
                "files": present
            }
    
    def check_dev_tools(self) -> Dict:
        """检测开发工具"""
        dev_tools = [
            ("ESLint", ["npm", "list", "@typescript-eslint/eslint-plugin"]),
            ("Prettier", ["npm", "list", "prettier"]),
            ("Husky", ["npm", "list", "husky"]),
            ("TypeScript", ["npm", "list", "typescript"])
        ]
        
        installed = []
        missing = []
        
        for tool_name, check_cmd in dev_tools:
            try:
                result = subprocess.run(check_cmd, 
                                      cwd=self.project_root,
                                      capture_output=True, text=True)
                if result.returncode == 0:
                    installed.append(tool_name)
                else:
                    missing.append(tool_name)
            except:
                missing.append(tool_name)
        
        if missing:
            return {
                "status": "warning",
                "message": f"缺少开发工具: {', '.join(missing)}",
                "installed": installed,
                "missing": missing
            }
        else:
            return {
                "status": "ok",
                "message": "所有开发工具已安装",
                "tools": installed
            }
    
    def check_security_config(self) -> Dict:
        """检测安全配置"""
        issues = []
        
        # 检查认证存储方式
        auth_file = self.project_root / "src" / "utils" / "auth.ts"
        if auth_file.exists():
            with open(auth_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if "localStorage" in content and "加密" not in content:
                    issues.append("⚠️  认证令牌存储在localStorage中（存在安全风险）")
        
        # 检查Mock数据在生产环境的使用
        main_file = self.project_root / "src" / "main.ts"
        if main_file.exists():
            with open(main_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if "setupMock()" in content and "process.env.NODE_ENV" not in content:
                    issues.append("⚠️  生产环境中可能启用了Mock数据")
        
        # 检查HTTPS配置
        vite_config = self.project_root / "vite.config.ts"
        if vite_config.exists():
            with open(vite_config, 'r', encoding='utf-8') as f:
                content = f.read()
                if "https" not in content.lower():
                    issues.append("ℹ️  未配置HTTPS（生产环境建议启用）")
        
        if issues:
            return {
                "status": "warning",
                "message": "发现安全相关问题:\n  " + "\n  ".join(issues)
            }
        else:
            return {
                "status": "ok",
                "message": "安全配置基本符合要求"
            }
    
    def check_build_status(self) -> Dict:
        """检测构建状态"""
        try:
            # 尝试TypeScript编译检查
            result = subprocess.run(['npm', 'run', 'build'], 
                                  cwd=self.project_root,
                                  capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0:
                return {
                    "status": "ok",
                    "message": "项目构建成功"
                }
            else:
                error_lines = result.stderr.split('\n')[:5]
                return {
                    "status": "error",
                    "message": "构建失败:\n  " + "\n  ".join(error_lines)
                }
                
        except subprocess.TimeoutExpired:
            return {
                "status": "error",
                "message": "构建超时（超过60秒）"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": f"构建检测失败: {str(e)}"
            }
    
    def _print_result(self, result: Dict):
        """打印检测结果"""
        status_icons = {
            "ok": "✅",
            "warning": "⚠️",
            "error": "❌",
            "info": "ℹ️"
        }
        
        icon = status_icons.get(result.get("status", "info"), "❓")
        print(f"{icon} {result.get('message', '无详细信息')}")
        
        # 打印额外数据
        if "data" in result:
            for key, value in result["data"].items():
                print(f"   {key}: {value}")
    
    def generate_report(self) -> str:
        """生成详细的检测报告"""
        report_lines = [
            "FinSphere Pro 环境检测报告",
            "=" * 50,
            f"检测时间: {time.strftime('%Y-%m-%d %H:%M:%S')}",
            f"项目路径: {self.project_root}",
            ""
        ]
        
        # 统计结果
        status_count = {"ok": 0, "warning": 0, "error": 0, "info": 0}
        
        for check_name, result in self.report.items():
            status = result.get("status", "unknown")
            status_count[status] += 1
            icon = {"ok": "✅", "warning": "⚠️", "error": "❌", "info": "ℹ️"}.get(status, "❓")
            
            report_lines.append(f"{icon} {check_name}")
            report_lines.append(f"   {result.get('message', '无信息')}")
            report_lines.append("")
        
        # 总结
        total_checks = sum(status_count.values())
        report_lines.extend([
            "=" * 50,
            "检测总结:",
            f"  通过: {status_count['ok']} 项",
            f"  警告: {status_count['warning']} 项", 
            f"  错误: {status_count['error']} 项",
            f"  信息: {status_count['info']} 项",
            f"  总计: {total_checks} 项"
        ])
        
        if status_count["error"] == 0:
            if status_count["warning"] == 0:
                report_lines.append("\n🎉 环境配置完美！")
            else:
                report_lines.append(f"\n⚠️  环境基本可用，建议修复 {status_count['warning']} 个警告项")
        else:
            report_lines.append(f"\n❌ 发现 {status_count['error']} 个严重问题，请优先解决")
        
        return "\n".join(report_lines)

def main():
    detector = EnvironmentDetector()
    detector.detect_all()
    
    # 保存报告
    report_content = detector.generate_report()
    report_file = Path(__file__).parent.parent / "environment_report.txt"
    
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report_content)
    
    print(f"\n📝 详细报告已保存到: {report_file}")
    
    # 如果有严重错误，询问是否自动修复
    error_count = sum(1 for result in detector.report.values() 
                     if result.get("status") == "error")
    
    if error_count > 0:
        print(f"\n🔧 检测到 {error_count} 个严重问题")
        response = input("是否运行自动修复程序？(y/N): ")
        if response.lower() == 'y':
            print("正在启动自动修复...")
            # 这里可以调用修复脚本
            setup_script = Path(__file__).parent / "setup.py"
            if setup_script.exists():
                subprocess.run([sys.executable, str(setup_script)])

if __name__ == "__main__":
    main()