# 朱健科 AI Resume Agent

这是一个面向 **AI 应用 / Agent 实习岗位** 的个人交互式简历项目。它把传统简历改造成一个可浏览、可追问、可做岗位匹配分析的 AI 简历站：访问者可以查看教育背景、实习经历、项目经历，也可以直接向 AI 简历提问。

项目已改造成朱健科个人版本，前端展示、岗位匹配样例、AI 问答建议问题、知识库 profile 和 README 均围绕个人简历内容维护。

## 功能概览

- **个人简历展示**：首屏、教育背景、实习经历、项目经历、技能标签和联系方式。
- **AI 简历问答**：通过聊天窗口追问实习经历、项目亮点、Agent / RAG 能力和岗位匹配情况。
- **DeepSeek / OpenRouter 配置**：前端提供模型设置弹窗，支持配置服务商、Base URL、模型名、Temperature 和 Max Tokens。
- **岗位匹配分析**：支持预置岗位样例，也可以粘贴真实 JD 进行匹配分析。
- **知识库同步**：前端静态 profile、后端 profile fallback 和 Memvid 知识库共同维护个人经历内容。
- **移动端适配**：优化手机端首屏、导航菜单、聊天窗口、模型配置弹窗，适合部署后在手机浏览器访问。

## 技术栈

| 模块     | 技术                                                |
| -------- | --------------------------------------------------- |
| 前端     | React 19、TypeScript、Vite、Tailwind CSS、shadcn/ui |
| 后端     | Python、FastAPI、SSE Streaming                      |
| 检索     | Memvid、RAG、语义检索、profile fallback             |
| 模型接入 | DeepSeek API、OpenRouter 兼容接口                   |
| 部署     | Docker / Podman Compose、GitHub                     |

## 项目结构

```text
ai-resume/
  frontend/           # React 前端页面、AI 聊天窗口、模型配置弹窗
  api-service/        # FastAPI 后端，负责聊天、岗位匹配和模型代理
  memvid-service/     # Rust gRPC 检索服务
  ingest/             # Markdown 简历 -> Memvid 知识库 / profile.json
  data/               # 简历源数据和本地知识库输出
  deployment/         # 容器部署配置
  docs/               # 架构、部署、安全和开发文档
```

## 本地启动

前端：

```bash
cd frontend
npm install
npm run dev
```

默认访问：

```text
http://localhost:5173/
```

后端与检索服务可以按项目内 Taskfile 或 Docker/Podman 配置启动。当前开发环境中常用端口：

```text
frontend:       5173
api-service:    3000
memvid-service: 50051
```

## 配置 DeepSeek

页面右上角菜单或聊天窗口里的齿轮按钮可以打开 **模型设置**。

推荐配置：

```text
服务商: DeepSeek
Base URL: https://api.deepseek.com
模型: deepseek-flash
```

API Key 只保存在当前浏览器本地，不会写入代码仓库。请求时前端会把配置通过请求头发送给本地后端代理，由后端调用模型接口。

> 部署到公网服务器时，不建议把个人 API Key 固化在前端代码中。更稳妥的方式是使用服务器环境变量、反向代理鉴权或个人访问控制。

## 更新简历和知识库

主要数据源：

```text
data/master_resume.md              # 本地简历源 Markdown
frontend/public/profile.json       # 前端静态 profile
data/.memvid/profile.json          # 后端 profile fallback
data/.memvid/resume.mv2            # 本地 Memvid 知识库文件
```

重新生成知识库：

```bash
cd ingest
uv run python ingest.py --verify
```

如果只改前端静态展示，需要同步 `frontend/public/profile.json`。如果希望 AI 问答也能检索到新内容，需要同步 `data/master_resume.md` 并重新 ingest。

## 当前项目经历摘要

### Deep Research Agent (Multi-Agent)

独立完成的多智能体深度研究项目，使用 LangGraph 构建 Planner、Researcher、Writer、Reviewer 四 Agent 协作流程，结合 Milvus、BM25、RRF、父子分块、来源引用和 SSE 流式输出，实现从问题拆解到报告生成的完整链路。

线上访问地址：

```text
http://118.89.119.163:8000/
```

### AI Resume Agent / 个人交互式简历

基于 React、FastAPI、Memvid 和 DeepSeek/OpenRouter 兼容接口改造的个人 AI 简历站。项目完成了个人内容替换、AI 问答配置、岗位匹配、移动端适配、知识库同步、GitHub public 仓库发布和密钥提交防护。

## 安全注意事项

本仓库不应提交以下内容：

- `.env`
- `deployment/.env`
- `frontend/.env`
- 真实 API Key
- 临时输出文件
- 本地截图和构建产物

提交前建议检查：

```bash
git status --short
rg -n "sk-|OPENROUTER_API_KEY|DEEPSEEK_API_KEY|github_pat_|ghp_|gho_" .
```

## 构建检查

前端类型检查：

```bash
cd frontend
npm run typecheck
```

前端生产构建：

```bash
cd frontend
npm run build
```

## 仓库

```text
https://github.com/FlySword6/ai-resume
```

## License

本项目保留原仓库 License 文件。使用和分发前请查看 [LICENSE](LICENSE)。
