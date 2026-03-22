'use client';

import { motion } from 'framer-motion';
import { BookOpen, Code, Bug, Lightbulb, FileText, ArrowRight, Zap, Globe, Shield } from 'lucide-react';

const quickStart = [
  {
    icon: Zap,
    title: '🚀 快速入门',
    description: '3步开启 AI 辅助编程之旅',
    steps: ['选择场景', '复制 Prompt', '开始使用'],
    href: '#quick-start',
  },
  {
    icon: Globe,
    title: '💬 Prompts',
    description: '132+ 精选提示词，覆盖各类场景',
    href: '/docs/prompts',
  },
  {
    icon: BookOpen,
    title: '📚 完整分类',
    description: '按任务类型系统化组织',
    href: '/docs/categories',
  },
];

const categories = [
  {
    icon: Code,
    title: '编程开发',
    path: '/prompts/task/coding',
    count: 20,
    description: '代码生成、接口实现、功能扩展',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Bug,
    title: '调试修复',
    path: '/prompts/task/debugging',
    count: 20,
    description: 'Bug定位、错误诊断、修复验证',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Lightbulb,
    title: '学习支持',
    path: '/prompts/general/learning-support',
    count: 8,
    description: '概念解释、代码解读、练习生成',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: FileText,
    title: '文档生成',
    path: '/prompts/task/documentation-for-code',
    count: 6,
    description: 'API文档、注释生成、技术文档',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: '安全检测',
    path: '/prompts/task/security',
    count: 5,
    description: '漏洞检测、代码审计、安全加固',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: BookOpen,
    title: '仓库分析',
    path: '/prompts/task/repo-analysis',
    count: 10,
    description: '项目理解、结构分析、依赖审查',
    color: 'from-teal-500 to-cyan-500',
  },
];

export default function Docs() {
  return (
    <main className="min-h-screen py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              文档中心
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            完整的文档资源，帮你快速上手并深入了解所有功能
          </p>
        </div>

        <section id="quick-start" className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-white">快速入口</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStart.map((item) => (
              <motion.a
                key={item.title}
                href={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="group p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-primary-500/20 text-primary-400 group-hover:bg-primary-500/30 transition-colors">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-neutral-400 text-sm mb-4">{item.description}</p>
                {item.steps && (
                  <div className="flex gap-2">
                    {item.steps.map((step, i) => (
                      <span key={i} className="px-2 py-1 text-xs rounded bg-neutral-700/50 text-neutral-400">
                        {i + 1}. {step}
                      </span>
                    ))}
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 text-white">完整分类</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <motion.a
                key={cat.title}
                href={cat.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-br from-neutral-400 to-neutral-600 bg-clip-text text-transparent">
                    {cat.count}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-4">{cat.description}</p>
                <div className="flex items-center gap-2 text-primary-400 text-sm font-medium">
                  <span>查看全部</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20"
        >
          <h2 className="text-2xl font-bold mb-4 text-white text-center">需要更多帮助？</h2>
          <p className="text-neutral-400 text-center mb-8 max-w-lg mx-auto">
            访问我们的 GitHub 仓库，获取完整的文档、示例代码和社区支持
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://github.com/badhope/skill"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-white text-neutral-900 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub 仓库
            </a>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
