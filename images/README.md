# 🌅 Bing 每日一图

> 自动抓取 Bing 每日壁纸，生成 WebP 格式，提供优雅的图片展示页面和 API 接口

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-自动部署-blue?logo=githubactions)](https://github.com/features/actions)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-部署-orange?logo=cloudflare)](https://pages.cloudflare.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 📖 简介

本项目基于 GitHub Actions 每日定时抓取 Bing 首页壁纸，自动转换为 WebP 格式，并通过 Cloudflare Pages 部署，实现：

- 🖼️ **优雅的图片展示页面** - 明暗主题、大图预览、缩放拖拽
- 📅 **每日自动更新** - 北京时间 22:00 自动抓取
- 📂 **历史图片管理** - 保留最近 90 天的高清壁纸
- 🔌 **API 接口** - 随机图片、每日图片接口，方便调用

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 📥 **自动抓取** | 每天定时从 Bing 官方源抓取高清壁纸 |
| 🖼️ **格式转换** | 自动转换为 WebP 格式，加载速度快 |
| 🌓 **明暗主题** | 支持亮色/暗色模式切换，自动记忆偏好 |
| 🔍 **大图预览** | 点击图片放大预览，支持缩放、拖拽、左右切换 |
| 📂 **历史记录** | 保留最近 90 天的壁纸，按日期排序 |
| 🔌 **API 接口** | 提供随机图片和每日图片接口 |
| 📱 **响应式设计** | 完美适配桌面端和移动端 |

---

## 🚀 快速部署

### 1. Fork 仓库

```bash
git clone https://github.com/chnbsdan/bingtc.git
cd bingtc
```

### 2. 部署到 Cloudflare Pages

1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 点击 **"创建项目"** → **"连接到 Git"**
3. 选择你的仓库 `chnbsdan/bingtc`
4. 设置：
   - **分支**: `main`
   - **构建命令**: 留空
   - **输出目录**: 留空
5. 点击 **"保存并部署"**

### 3. 配置 GitHub Secrets（可选）

如需使用 Personal Access Token 推送，在仓库设置中添加：

| Secret 名称 | 值 |
|-------------|-----|
| `PAT_TOKEN` | 你的 GitHub Personal Access Token |

---

## 📁 项目结构

```
bingtc/
├── .github/workflows/
│   └── main.yaml              # GitHub Actions 定时任务
├── functions/api/             # Cloudflare Pages Functions
│   ├── index.js               # API 文档页面
│   ├── daily.js               # 每日图片 API
│   └── random.js              # 随机图片 API
├── webp/                      # WebP 图片存储（自动生成）
│   ├── 20260724.webp
│   ├── latest.webp
│   ├── daily.jpeg
│   ├── original.jpeg
│   └── index.json             # 图片索引（90天）
├── json/                      # Bing API 原始数据
├── 1080pimages/               # 1080p PNG 图片
├── images/                    # 原图 PNG 图片
├── dimages.py                 # 核心抓取与转换脚本
├── tool.py                    # 工具函数
├── create.py                  # README 生成
├── main.py                    # 主入口
├── index.html                 # 网页展示页面
├── favicon.ico                # 网站图标
└── requirements.txt           # Python 依赖
```

---

## 🔌 API 接口

部署完成后，你可以使用以下 API 接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api` | GET | 查看 API 文档 |
| `/api/random` | GET | 返回随机图片 |
| `/api/random?redirect=true` | GET | 302 重定向到随机图片 |
| `/api/daily` | GET | 返回今日图片 (WebP) |
| `/api/daily?format=jpeg` | GET | 返回今日图片 (JPEG) |
| `/api/daily?format=original` | GET | 返回今日图片 (原始 JPEG) |
| `/api/daily?redirect=true` | GET | 302 重定向到今日图片 |

**示例：**

```html
<!-- 在网页中使用随机图片 -->
<img src="https://your-domain.com/api/random" alt="随机壁纸" />

<!-- 在网页中使用今日图片 -->
<img src="https://your-domain.com/api/daily" alt="今日壁纸" />
```

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Python** | 图片抓取与格式转换 |
| **GitHub Actions** | 定时任务自动化 |
| **Cloudflare Pages** | 网站托管与 Serverless Functions |
| **Pillow** | 图片处理（PNG → WebP） |
| **HTML/CSS/JavaScript** | 前端展示页面 |

---

## 📊 数据流程

```
Bing API
    ↓
GitHub Actions (每天 22:00)
    ↓
dimages.py (下载 → 转换 WebP)
    ↓
webp/ 目录 + index.json
    ↓
Cloudflare Pages 部署
    ↓
用户访问网站 / API
```

---

## ⚙️ 配置说明

### 修改抓取时间

编辑 `.github/workflows/main.yaml`：

```yaml
on:
  schedule:
   - cron: '0 14 * * *'   # UTC 14:00 = 北京时间 22:00
```

| Cron | UTC 时间 | 北京时间 |
|------|----------|----------|
| `0 14 * * *` | 14:00 | **22:00** |
| `0 12 * * *` | 12:00 | **20:00** |

### 修改保留天数

编辑 `dimages.py` 中的 `generate_index_json()` 函数：

```python
# 只保留最近90天
ninety_days_ago = (datetime.now() - timedelta(days=90)).strftime('%Y%m%d')
```

| 天数 | 修改 `days` 值 |
|------|----------------|
| 30 天 | `days=30` |
| 60 天 | `days=60` |
| 90 天 | `days=90`（默认） |

### 修改图片语言

编辑 `main.py`：

```python
# 英文
downloads('...&mkt=en-US')
# 中文
downloads('...&mkt=zh-CN')
```

---

## 🎨 预览

| 暗色主题 | 亮色主题 |
|----------|----------|
| ![暗色主题](https://via.placeholder.com/400x200/121212/ffffff?text=Dark+Mode) | ![亮色主题](https://via.placeholder.com/400x200/f5f5f5/222222?text=Light+Mode) |

---

## 📝 更新日志

### 2026-07-24
- ✅ 添加 WebP 格式支持
- ✅ 优化图片加载速度
- ✅ 修复预览图文字显示
- ✅ 添加明暗主题切换
- ✅ 支持大图缩放和拖拽

### 2026-07-23
- ✅ 初始化项目
- ✅ 接入 Bing API
- ✅ 部署到 Cloudflare Pages

---

## 🙏 致谢

- [微软 Bing](https://cn.bing.com/) - 壁纸图片来源
- [GitHub Actions](https://github.com/features/actions) - 自动化部署
- [Cloudflare Pages](https://pages.cloudflare.com/) - 网站托管

---

## 📄 License

MIT License © 2026 [chnbsdan](https://github.com/chnbsdan)

---

## 🔗 相关链接

- [项目地址](https://github.com/chnbsdan/bingtc)
- [在线预览](https://bing.shd.sryze.cc)
- [API 文档](https://bing.shd.sryze.cc/api)
- [站长博客](https://aoso.hangdn.com/)

