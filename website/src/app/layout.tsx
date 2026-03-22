import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Skill Repository | 专业的 Prompt 工具箱',
  description: '132+ 高质量提示词，27+ 技能定义，10+ 工作流。涵盖编程、调试、学习、日常生活的全方位 AI 辅助解决方案。',
  keywords: ['AI', 'Prompt', 'Skill', '编程助手', '代码生成', 'GPT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neutral-900 text-white antialiased">
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-800/50">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                AI
              </div>
              <span className="font-bold text-xl hidden sm:block">Skill Repo</span>
            </a>

            <div className="flex items-center gap-8">
              <NavLink href="/features">功能</NavLink>
              <NavLink href="/docs">文档</NavLink>
              <NavLink href="/about">关于</NavLink>
              <a
                href="https://github.com/badhope/skill"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </nav>

        <div className="pt-16">
          {children}
        </div>

        <footer className="py-12 px-6 border-t border-neutral-800/50">
          <div className="max-w-6xl mx-auto text-center text-neutral-500">
            <p>AI Skill Repository © 2026. Built with Next.js, GSAP, Three.js.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative text-neutral-400 hover:text-white transition-colors group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-hover:w-full transition-all duration-300" />
    </a>
  );
}
