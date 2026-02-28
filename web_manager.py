#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FinSphere Pro Web管理服务器
提供基于Web的项目管理界面
"""

import os
import sys
import json
import threading
import webbrowser
from pathlib import Path
from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.parse
import subprocess
from typing import Dict, Any

class WebManagerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.project_root = Path(__file__).parent.parent
        super().__init__(*args, directory=str(self.project_root), **kwargs)
    
    def do_GET(self):
        """处理GET请求"""
        if self.path == '/' or self.path == '/manager':
            self.serve_manager_page()
        elif self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            super().do_GET()
    
    def do_POST(self):
        """处理POST请求"""
        if self.path.startswith('/api/'):
            self.handle_api_request()
        else:
            self.send_error(404)
    
    def serve_manager_page(self):
        """提供管理页面"""
        try:
            # 读取Vue管理页面内容
            manager_html = """
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FinSphere Pro 管理面板</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        #app {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 20px 30px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            margin: 0;
            color: #2c3e50;
        }
        .quick-actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
        }
        .card-icon {
            font-size: 3rem;
            margin-bottom: 15px;
        }
        .card h3 {
            margin: 0 0 10px 0;
            color: #2c3e50;
        }
        .card p {
            color: #7f8c8d;
            margin-bottom: 20px;
        }
        button {
            padding: 12px 25px;
            border: none;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: white;
            width: 100%;
        }
        button:hover:not(:disabled) {
            background: linear-gradient(45deg, #2980b9, #1f618d);
            transform: scale(1.05);
        }
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .log-section {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .log-container {
            height: 300px;
            overflow-y: auto;
            background: #2c3e50;
            border-radius: 10px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            color: #ecf0f1;
        }
        .log-entry {
            margin-bottom: 8px;
            padding: 8px;
            border-radius: 5px;
            display: flex;
            gap: 10px;
        }
        .log-success { background: rgba(46, 204, 113, 0.3); }
        .log-error { background: rgba(231, 76, 60, 0.3); }
        .log-info { background: rgba(52, 152, 219, 0.3); }
        .log-warning { background: rgba(241, 196, 15, 0.3); }
    </style>
</head>
<body>
    <div id="app">
        <div class="header">
            <h1>🚀 FinSphere Pro 管理面板</h1>
            <div>
                <span id="server-status">🔧 服务器: 停止</span>
                <span id="env-status">🌍 环境: 未配置</span>
            </div>
        </div>
        
        <div class="quick-actions">
            <div class="card" onclick="startServer()">
                <div class="card-icon">🎮</div>
                <h3>启动开发服务器</h3>
                <p>一键启动本地开发环境</p>
                <button id="start-btn">立即启动</button>
            </div>
            
            <div class="card" onclick="checkEnvironment()">
                <div class="card-icon">🔍</div>
                <h3>环境状态检测</h3>
                <p>全面检查项目环境状态</p>
                <button>开始检测</button>
            </div>
            
            <div class="card" onclick="configureEnvironment()">
                <div class="card-icon">🔧</div>
                <h3>自动环境配置</h3>
                <p>一键配置完整开发环境</p>
                <button id="config-btn">开始配置</button>
            </div>
        </div>
        
        <div class="log-section">
            <h2>📋 实时日志</h2>
            <div class="log-container" id="log-container"></div>
        </div>
    </div>

    <script>
        let isServerRunning = false;
        let isConfiguring = false;
        
        function addLog(message, type = 'info') {
            const container = document.getElementById('log-container');
            const entry = document.createElement('div');
            entry.className = `log-entry log-${type}`;
            entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
            container.appendChild(entry);
            container.scrollTop = container.scrollHeight;
            
            // 限制日志数量
            if (container.children.length > 100) {
                container.removeChild(container.firstChild);
            }
        }
        
        function updateStatus() {
            document.getElementById('server-status').textContent = 
                `🔧 服务器: ${isServerRunning ? '运行中' : '停止'}`;
            document.getElementById('env-status').textContent = 
                `🌍 环境: ${isConfiguring ? '配置中' : '就绪'}`;
        }
        
        async function startServer() {
            if (isServerRunning) return;
            
            const btn = document.getElementById('start-btn');
            btn.disabled = true;
            btn.textContent = '启动中...';
            
            addLog('正在启动开发服务器...', 'info');
            
            try {
                const response = await fetch('/api/start-server', { method: 'POST' });
                const result = await response.json();
                
                if (result.success) {
                    isServerRunning = true;
                    addLog('开发服务器启动成功！', 'success');
                    addLog(`访问地址: ${result.url}`, 'info');
                } else {
                    addLog(`启动失败: ${result.message}`, 'error');
                }
            } catch (error) {
                addLog(`启动出错: ${error.message}`, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = isServerRunning ? '已运行' : '立即启动';
                updateStatus();
            }
        }
        
        async function checkEnvironment() {
            addLog('开始环境检测...', 'info');
            
            try {
                const response = await fetch('/api/check-environment');
                const result = await response.json();
                
                if (result.success) {
                    addLog('环境检测完成:', 'success');
                    Object.entries(result.data).forEach(([key, value]) => {
                        addLog(`${key}: ${value}`, 'info');
                    });
                } else {
                    addLog(`检测失败: ${result.message}`, 'error');
                }
            } catch (error) {
                addLog(`检测出错: ${error.message}`, 'error');
            }
        }
        
        async function configureEnvironment() {
            if (isConfiguring) return;
            
            const btn = document.getElementById('config-btn');
            btn.disabled = true;
            btn.textContent = '配置中...';
            isConfiguring = true;
            updateStatus();
            
            addLog('开始自动环境配置...', 'warning');
            
            try {
                const response = await fetch('/api/configure-environment', { method: 'POST' });
                const result = await response.json();
                
                if (result.success) {
                    addLog('环境配置完成！🎉', 'success');
                } else {
                    addLog(`配置失败: ${result.message}`, 'error');
                }
            } catch (error) {
                addLog(`配置出错: ${error.message}`, 'error');
            } finally {
                isConfiguring = false;
                btn.disabled = false;
                btn.textContent = '开始配置';
                updateStatus();
            }
        }
        
        // 初始化
        addLog('欢迎使用 FinSphere Pro 管理面板！', 'success');
        addLog('点击上方卡片开始您的开发之旅 🚀', 'info');
        updateStatus();
    </script>
</body>
</html>
            """
            
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(manager_html.encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")
    
    def handle_api_request(self):
        """处理API请求"""
        try:
            if self.path == '/api/start-server':
                self.start_server_api()
            elif self.path == '/api/check-environment':
                self.check_environment_api()
            elif self.path == '/api/configure-environment':
                self.configure_environment_api()
            else:
                self.send_error(404)
        except Exception as e:
            self.send_error(500, f"API Error: {str(e)}")
    
    def start_server_api(self):
        """启动开发服务器API"""
        try:
            # 在后台启动npm run dev
            process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.project_root,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            response = {
                'success': True,
                'message': '服务器启动成功',
                'url': 'http://localhost:3000'
            }
            
        except Exception as e:
            response = {
                'success': False,
                'message': str(e)
            }
        
        self.send_json_response(response)
    
    def check_environment_api(self):
        """环境检测API"""
        try:
            # 执行环境检测脚本
            result = subprocess.run(
                [sys.executable, str(self.project_root / 'scripts' / 'detector.py')],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            response = {
                'success': True,
                'data': {
                    '检测结果': '已完成',
                    '详情': result.stdout[:200] + '...' if len(result.stdout) > 200 else result.stdout
                }
            }
            
        except Exception as e:
            response = {
                'success': False,
                'message': str(e)
            }
        
        self.send_json_response(response)
    
    def configure_environment_api(self):
        """环境配置API"""
        try:
            # 执行配置脚本
            result = subprocess.run(
                [sys.executable, str(self.project_root / 'setup.py')],
                cwd=self.project_root,
                capture_output=True,
                text=True
            )
            
            response = {
                'success': True,
                'message': '配置完成'
            }
            
        except Exception as e:
            response = {
                'success': False,
                'message': str(e)
            }
        
        self.send_json_response(response)
    
    def send_json_response(self, data: Dict[str, Any]):
        """发送JSON响应"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

class WebManagerServer:
    def __init__(self, port: int = 8080):
        self.port = port
        self.server = None
        self.project_root = Path(__file__).parent.parent
    
    def start(self):
        """启动Web服务器"""
        try:
            self.server = HTTPServer(('localhost', self.port), WebManagerHandler)
            print(f"🚀 FinSphere Pro Web管理面板启动成功!")
            print(f"🌐 访问地址: http://localhost:{self.port}")
            print(f"📂 项目路径: {self.project_root}")
            print("💡 按 Ctrl+C 停止服务器")
            
            # 自动打开浏览器
            webbrowser.open(f'http://localhost:{self.port}')
            
            # 启动服务器
            self.server.serve_forever()
            
        except KeyboardInterrupt:
            print("\n👋 服务器已停止")
        except Exception as e:
            print(f"❌ 服务器启动失败: {e}")
        finally:
            if self.server:
                self.server.shutdown()

def main():
    """主函数"""
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ 端口号必须是数字")
            return
    
    server = WebManagerServer(port)
    server.start()

if __name__ == "__main__":
    main()