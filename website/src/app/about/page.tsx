'use client';

import { motion } from 'framer-motion';
import { Users, GitBranch, Heart, Sparkles, Layers, Zap } from 'lucide-react';

const stats = [
  { label: 'Prompts', value: '132+', icon: '💬' },
  { label: 'Skills', value: '27+', icon: '🎯' },
  { label: 'Workflows', value: '10+', icon: '🔧' },
  { label: 'Contributors', value: '1', icon: '👤' },
];

const architecture = [
  {
    icon: Layers,
    title: '分层架构',
    description: '清晰的层级结构，从入口文档到具体实现，层次分明',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: '模块化设计',
    description: '高度解耦的模块设计，便于扩展和维护',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: '性能优化',
    description: '轻量级实现，高效的资源利用',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: GitBranch,
    title: '版本控制',
    description: '完善的版本管理和更新机制',
    color: 'from-green-500 to-emerald-500',
  },
];

const team = [
  {
    name: 'badhope',
    role: 'Creator & Main Developer',
    avatar: '👨‍💻',
    description: '项目的创始人和主要开发者，负责整体架构设计和核心功能实现',
  },
];

export default function About() {
  return (
    <main className="min-h-screen py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className="text-8xl">🚀</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              关于项目
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
            AI Skill & Prompt Repository 是一个开源的 AI 辅助工具仓库，
            致力于为开发者提供高质量的 Prompt 模板和 Skill 定义，
            帮助提升编程效率和代码质量。
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            核心特性
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {architecture.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                className="flex gap-6 p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 hover:border-primary-500/30 transition-colors"
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} flex-shrink-0`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            技术架构
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-3xl bg-neutral-800/50 border border-neutral-700/50"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-bold text-white mb-2">Prompts</h3>
                <p className="text-neutral-400 text-sm">
                  132+ 高质量提示词模板，覆盖编程、调试、学习等场景
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-white mb-2">Skills</h3>
                <p className="text-neutral-400 text-sm">
                  27+ 标准化技能定义，模块化可组合
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-lg font-bold text-white mb-2">Workflows</h3>
                <p className="text-neutral-400 text-sm">
                  10+ 预定义工作流，开箱即用
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            团队成员
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex gap-6 p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50"
              >
                <div className="text-5xl">{member.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-primary-400 text-sm mb-3">{member.role}</p>
                  <p className="text-neutral-400 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20"
        >
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-white">
            开源精神
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-8">
            本项目采用 MIT 许可证，完全开源免费。我们相信分享的力量，
            希望这个工具仓库能够帮助更多的开发者提升效率。
          </p>
          <a
            href="https://github.com/badhope/skill"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-full font-semibold hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            在 GitHub 上关注我们
          </a>
        </motion.section>
      </motion.div>
    </main>
  );
}
