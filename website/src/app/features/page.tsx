'use client';

import { motion } from 'framer-motion';
import { Code, Bug, BookOpen, Calendar, Mail, CheckSquare, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: '💻 编程能力',
    description: '从需求到代码的完整生命周期支持',
    capabilities: [
      '自然语言需求转代码实现',
      '多语言代码生成与优化',
      '代码风格自动对齐',
      '接口代码自动生成',
    ],
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    category: 'coding',
  },
  {
    icon: Bug,
    title: '🔧 调试能力',
    description: '系统性Bug定位与安全修复',
    capabilities: [
      '智能错误诊断与分析',
      'Bug根因定位',
      '修复方案生成',
      '修复后验证',
    ],
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    category: 'debugging',
  },
  {
    icon: BookOpen,
    title: '📚 学习支持',
    description: '编程学习的全方位辅助',
    capabilities: [
      '概念解释与答疑',
      '代码逐行解读',
      '学习路径规划',
      '练习题生成',
    ],
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    category: 'learning',
  },
  {
    icon: Calendar,
    title: '📅 日程规划',
    description: '高效的每日时间管理',
    capabilities: [
      '智能日程安排',
      '优先级排序',
      '番茄工作法',
      '艾森豪威尔矩阵',
    ],
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    category: 'everyday',
  },
  {
    icon: Mail,
    title: '📧 邮件撰写',
    description: '各类邮件的专业撰写辅助',
    capabilities: [
      '工作邮件撰写',
      '正式邮件格式',
      '邮件模板生成',
      '多语言邮件支持',
    ],
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    category: 'everyday',
  },
  {
    icon: CheckSquare,
    title: '✅ 清单管理',
    description: '各类清单的快速生成',
    capabilities: [
      '待办事项清单',
      '旅行打包清单',
      '会议议程清单',
      '购物清单生成',
    ],
    color: 'from-teal-500 to-cyan-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/30',
    category: 'everyday',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Features() {
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
              核心功能
            </span>
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            六大核心能力模块，覆盖编程开发、调试修复、学习支持、日常生活的全方位 AI 辅助解决方案
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
            访问 GitHub 仓库，获取完整的项目代码和详细的使用文档
          </p>
          <a
            href="https://github.com/badhope/skill"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white shadow-lg hover:shadow-primary-500/30 transition-all duration-300 hover:scale-105"
          >
            立即访问
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </motion.div>
    </main>
  );
}

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className={`group relative p-8 rounded-3xl ${feature.bgColor} border ${feature.borderColor} backdrop-blur-sm hover:shadow-xl transition-all duration-500`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

      <div className="relative">
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-white transition-colors">
          {feature.title}
        </h3>

        <p className="text-neutral-400 mb-6 group-hover:text-neutral-300 transition-colors">
          {feature.description}
        </p>

        <ul className="space-y-3">
          {feature.capabilities.map((cap, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${feature.color} mt-2 flex-shrink-0`} />
              {cap}
            </li>
          ))}
        </ul>

        <div className={`mt-6 pt-6 border-t border-neutral-800/50 flex items-center justify-between`}>
          <span className="text-xs text-neutral-500 uppercase tracking-wider">
            {feature.category}
          </span>
          <ArrowRight className={`w-4 h-4 text-neutral-500 group-hover:text-primary-400 group-hover:translate-x-1 transition-all duration-300`} />
        </div>
      </div>
    </motion.div>
  );
}
