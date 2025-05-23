# 围棋对弈系统

这是一个基于 Next.js 开发的围棋对弈系统，支持人机对战，具有完整的围棋规则实现和 AI 等级系统。

## 功能特点

- 完整的围棋规则实现
  - 提子规则
  - 打劫规则
  - 自杀规则
  - 终局判定
  - 数子和贴目

- AI 系统
  - 支持从初段到九段的 AI 等级
  - AI 行为会根据等级调整策略
  - 每步棋都有评估和建议

- 对局功能
  - 落子
  - 提子
  - 虚手（Pass）
  - 认输
  - 悔棋
  - 保存对局记录

- 界面功能
  - 响应式设计
  - 棋盘和棋子的动画效果
  - 对局信息显示
  - 操作按钮
  - AI 等级设置

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL
- React Konva (棋盘渲染)
- Zustand (状态管理)

## 开发环境设置

1. 克隆项目
```bash
git clone https://github.com/yourusername/go-game.git
cd go-game
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
创建 `.env` 文件并添加以下内容：
```
DATABASE_URL="postgresql://username:password@localhost:5432/go_game?schema=public"
```

4. 初始化数据库
```bash
npx prisma db push
```

5. 启动开发服务器
```bash
npm run dev
```

## 项目结构

```
go-game/
├── src/
│   ├── app/              # Next.js 页面
│   ├── components/       # React 组件
│   ├── services/        # 服务层
│   ├── store/           # 状态管理
│   ├── types/           # TypeScript 类型定义
│   └── utils/           # 工具函数
├── prisma/              # Prisma 配置和模型
├── public/              # 静态资源
└── package.json         # 项目配置
```

## 使用说明

1. 开始新游戏
   - 选择 AI 等级（初段到九段）
   - 点击"开始新游戏"按钮

2. 对弈过程
   - 点击棋盘交叉点落子
   - 使用功能按钮：虚手、认输、悔棋等
   - 查看对局信息和分析

3. 结束游戏
   - 双方连续虚手或一方认输
   - 显示胜负结果和对局分析
   - 可以选择保存对局记录或开始新游戏

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。在提交代码前，请确保：

1. 代码符合项目的代码风格
2. 添加了适当的测试
3. 更新了相关文档

## 许可证

MIT License
