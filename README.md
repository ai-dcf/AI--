# AI 画廊 — 微信小程序

一个基于 AI 文生图技术的微信小程序，用户可以通过输入文字描述生成 AI 画作，并在社区画廊中分享和浏览作品。

## 功能概览

### 🏠 首页 — 社区画廊

- 以**瀑布流**布局展示所有用户发布的 AI 画作
- 每张卡片展示生成图片、提示词、作者头像和昵称
- 支持**无限滚动加载**，滚动到底部自动加载更多作品
- 点击图片可全屏预览
- 右下角**悬浮按钮**一键跳转至创建页面

### 🎨 创建图片 — AI 文生图

- **提示词输入**：支持最多 500 字的画面描述，带占位符引导
- **6 种风格标签**：写实、动漫、电影感、梦幻、油画、水彩，点击即追加到提示词
- **5 种画面比例**：1:1（正方形）、3:4（竖版）、4:3（横版）、9:16（长竖版）、16:9（长横版）
- **反向提示词**：可选填写不希望出现的内容
- **生成过程**：
  - 提交后显示脉冲动画和进度条
  - 云端异步生成，前端轮询任务状态（每 3 秒一次，最多 60 次）
  - 生成完成后展示结果图片和提示词
- **重新生成 / 发布**：对结果满意可一键发布到画廊

### 👤 我的 — 个人中心

- **微信一键登录**：未登录时展示登录引导页
- **个人信息展示**：头像、昵称、作品/获赞/收藏统计
- **编辑资料**：弹窗修改头像（微信原生头像选择）和昵称（微信昵称填写组件），头像上传至云存储
- **个人画廊**：三列网格展示自己发布的所有作品，点击可全屏预览
- **功能菜单**：创作历史、隐私设置、帮助与反馈、退出登录

## 技术栈

| 技术 | 说明 |
|------|------|
| 微信小程序 | 基础框架，TypeScript 开发 |
| TDesign Weixin | v1.14.0，腾讯 UI 组件库 |
| 微信云开发 | 云函数 + 云数据库 + 云存储 |
| 阿里云 DashScope | Wan2.6-t2i 文生图模型 |
| glass-easel | 小程序组件渲染框架 |

## 项目结构

```
├── cloudfunctions/                # 云函数
│   ├── login/                     # 用户登录/注册
│   ├── publish/                   # 发布作品 & 获取图片列表
│   ├── text2image/                # 调用 DashScope API 文生图
│   └── updateUserInfo/            # 更新用户头像/昵称
├── miniprogram/                   # 小程序前端
│   ├── assets/icons/              # TabBar 图标
│   ├── pages/
│   │   ├── home/                  # 首页（社区画廊）
│   │   ├── create/                # 创建图片（AI 文生图）
│   │   └── profile/               # 我的（个人中心）
│   ├── utils/util.ts              # 通用工具函数
│   ├── app.ts                     # 小程序入口
│   ├── app.json                   # 全局配置
│   └── app.wxss                   # 全局样式（CSS 变量）
├── docs/                          # 项目文档
│   └── prd.md                     # 需求文档
├── prototype/                     # 原型页面
├── typings/                       # TypeScript 类型声明
├── project.config.json            # 项目配置
├── tsconfig.json                  # TypeScript 配置
└── package.json                   # 依赖声明
```

## 云函数说明

### login

用户登录与注册。首次调用自动创建用户记录，已有用户则更新最后登录时间。

- **集合**：`users`
- **返回**：openid、avatarUrl、nickName、stats（works/likes/favorites）、isNewUser

### publish

提供三个操作：

| 操作名 | 说明 |
|--------|------|
| `publish` | 下载 AI 生成的图片到云存储，保存记录到 `images` 集合，更新用户作品数 |
| `getMyImages` | 分页获取当前用户发布的图片（按时间倒序） |
| `getAllImages` | 分页获取所有用户发布的图片（按时间倒序） |

### text2image

调用阿里云 DashScope API（Wan2.6-t2i 模型）进行文生图：

| 操作名 | 说明 |
|--------|------|
| `create` | 创建文生图异步任务，支持 prompt、negativePrompt、size、n 参数 |
| `query` | 根据 taskId 查询任务状态，轮询获取生成结果 |

- **环境变量**：需配置 `DASHSCOPE_API_KEY`
- **模型**：`wan2.6-t2i`
- **API**：`dashscope.aliyuncs.com`

### updateUserInfo

更新当前用户的头像和昵称。

## 数据库集合

### users

| 字段 | 类型 | 说明 |
|------|------|------|
| _openid | string | 微信 openid |
| avatarUrl | string | 头像云存储 fileID |
| nickName | string | 昵称 |
| stats | object | 统计数据 { works, likes, favorites } |
| createTime | date | 注册时间 |
| lastLoginTime | date | 最后登录时间 |

### images

| 字段 | 类型 | 说明 |
|------|------|------|
| _openid | string | 发布者 openid |
| imageUrl | string | 图片云存储 fileID |
| prompt | string | 提示词 |
| nickName | string | 发布者昵称（快照） |
| avatarUrl | string | 发布者头像（快照） |
| likes | number | 点赞数 |
| createTime | date | 发布时间 |

## 云存储路径

| 路径 | 说明 |
|------|------|
| `avatars/{openid}.{ext}` | 用户头像 |
| `images/{openid}_{timestamp}.png` | 发布的 AI 画作 |

## 开发指南

### 环境要求

- 微信开发者工具
- Node.js
- 已开通微信云开发的小程序账号

### 配置步骤

1. 克隆项目并在微信开发者工具中打开
2. 在微信开发者工具中开通云开发，获取环境 ID
3. 修改 `miniprogram/app.ts` 中的云开发环境 ID：
   ```ts
   wx.cloud.init({
     env: '你的云环境ID',
     traceUser: true,
   })
   ```
4. 在云开发控制台创建 `users` 和 `images` 集合
5. 在 `text2image` 云函数的环境变量中配置 `DASHSCOPE_API_KEY`（[阿里云 DashScope 控制台](https://dashscope.console.aliyun.com/)获取）
6. 安装 npm 依赖并构建：
   ```bash
   npm install
   ```
   在微信开发者工具中点击「工具 → 构建 npm」
7. 分别右键每个云函数目录，选择「上传并部署：云端安装依赖」

### 画面比例与尺寸对照

| 比例 | 描述 | 像素尺寸 |
|------|------|----------|
| 1:1 | 正方形 | 1280×1280 |
| 3:4 | 竖版 | 1104×1472 |
| 4:3 | 横版 | 1472×1104 |
| 9:16 | 长竖版 | 960×1696 |
| 16:9 | 长横版 | 1696×960 |

## 全局设计变量

项目使用 CSS 变量统一管理主题色，定义在 `app.wxss`：

| 变量 | 值 | 用途 |
|------|----|------|
| --brand-color | #0052D9 | 品牌主色 |
| --brand-color-light | #E8F0FE | 品牌浅色（背景） |
| --brand-color-hover | #003CAB | 品牌深色（按压态） |
| --td-bg | #F5F5F5 | 页面背景 |
| --td-card | #FFFFFF | 卡片背景 |
| --td-text | #1a1a1a | 主文字 |
| --td-text-secondary | #999999 | 辅助文字 |
| --td-success | #00A870 | 成功色 |
| --td-warning | #ED7B2F | 警告色 |
| --td-danger | #D54941 | 危险色 |
