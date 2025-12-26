# 个人网站技术架构文档 v2.0

## 1. 技术栈选择

### 1.1 前端 (Frontend)
- **核心框架**: React 18+ (Vite)
- **UI 体系**: 
    - **样式**: Tailwind CSS (支持 Dark Mode `dark:` 前缀)
    - **组件库**: shadcn/ui (Radix UI) + Lucide React
    - **可视化**: 
        - `recharts` (折线图、雷达图)
        - `d3.js` 或 `react-force-graph` (知识图谱力导向图)
        - `echarts-wordcloud` 或 `react-wordcloud` (碎碎念词云)
- **逻辑处理**:
    - **路由**: React Router v6
    - **状态**: Zustand
    - **渲染**: `react-markdown`, `rehype-katex` (LaTeX), `react-syntax-highlighter`
    - **动画**: `framer-motion` (用于三相正弦波彩蛋)

### 1.2 后端与数据 (Backend & Data)
- **BaaS**: Supabase
    - **PostgreSQL**: 核心数据存储
    - **Auth**: 管理员鉴权
    - **Storage**: 静态资源托管
    - **Edge Functions**: 处理轻量级后端逻辑 (如 Server 酱推送触发)
- **自动化脚本 (Scripts)**:
    - **Python/Node.js**: 
        - 笔记元数据提取 (字数, LaTeX 计数)
        - 孤立页检测
        - Jieba 分词 (生成词云数据)
        - 自动备份脚本

## 2. 数据库设计 (Schema)

### 2.1 核心业务表
- **`users`**: 管理员信息 (Supabase Auth)
- **`notes`**: 
    - `id`, `title`, `content`, `slug` (SEO URL), `category_id`, `created_at`
    - `stats_word_count` (int), `stats_latex_count` (int), `stats_code_blocks` (int)
- **`note_links`** (新): 
    - `source_note_id`, `target_note_id` (用于构建图谱)
- **`mutters`**: 
    - `id`, `content`, `images` (jsonb), `created_at`
- **`tools_stats`** (新):
    - `tool_id` (string), `uv_count` (int), `like_count` (int), `collection_count` (int)

### 2.2 成长追踪表
- **`daily_stats`** (新):
    - `date` (date), `new_knowledge_count` (int), `review_count` (int), `commit_count` (int)
- **`okrs`** (新):
    - `id`, `quarter` (string, e.g., '2025-Q2'), `objective` (text), `key_results` (jsonb), `progress` (int)
- **`skill_radar`** (新):
    - `dimension` (string), `score` (int, 0-100), `updated_at`

## 3. 插件化接口定义

### 3.1 前端工具接口 (`src/types/tool.ts`)
```typescript
export interface ITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  defaultWidth?: string; // e.g., 'w-full', 'w-1/2'
  defaultHeight?: string;
}
```

### 3.2 搜索引擎配置 (`public/config/search_engines.yaml`)
```yaml
- name: "Google"
  icon: "google.svg"
  templateUrl: "https://www.google.com/search?q={query}"
  isActive: true
  type: "general" # or "vertical"

- name: "CNKI"
  icon: "cnki.png"
  templateUrl: "https://scholar.cnki.net/result?kw={query}"
  isActive: true
  type: "vertical"
```

## 4. 目录结构规划 (src)
```
src/
├── assets/
├── components/
│   ├── ui/             # shadcn 基础组件
│   ├── business/       # 业务组件 (NoteCard, MutterItem)
│   ├── charts/         # 可视化组件 (KnowledgeGraph, SkillRadar)
│   └── tools/          # 具体工具实现 (BaseConverter...)
├── config/             # 静态配置 (search_engines 默认值)
├── hooks/
├── lib/                # utils, supabase client
├── pages/
│   ├── Dashboard/      # 管理员面板 (新)
│   ├── ...
├── scripts/            # 维护脚本 (本地运行或 CI)
│   ├── analyze_notes.js # 统计字数、链接、孤立页
│   └── generate_og.js   # SEO 图片生成
└── types/              # TS 类型定义
```

## 5. 安全与运维
- **RLS**: 严格限制 `daily_stats`, `okrs` 表仅管理员可读写。
- **Backup**: 配置 GitHub Actions 每日凌晨运行备份脚本，同步至 OSS。
- **SEO**: 使用 `react-helmet-async` 管理 Head 标签，配合服务端预渲染 (SSG/SSR) 或简单的 Meta 标签动态注入。
