# 聊效管家-前端

### **🔖 最新版本：v0.1.1**

这里是 **聊效管家 (ChatKeeper)** 的前端仓库。这是一个基于 Vue 3 和 Vite 构建的前端项目。项目采用 PrimeVue 作为 UI 组件库，并结合 Tailwind CSS 进行样式定制，使用 Pinia 进行状态管理。

## 技术栈

* **核心框架:** [Vue 3](https://vuejs.org/)
* **构建工具:** [Vite](https://vitejs.dev/)
* **状态管理:** [Pinia](https://pinia.vuejs.org/)
* **路由:** [Vue Router](https://router.vuejs.org/)
* **UI 组件库:** [PrimeVue](https://primevue.org/)
* **CSS 框架:** [Tailwind CSS](https://tailwindcss.com/)
* **HTTP 请求:** [Axios](https://axios-http.com/)
* **代码格式化:** [Prettier](https://prettier.io/)

## 聊效管家前端用户开发及部署指南

## 1. 环境准备

在开始之前，请确保您的开发环境中已经安装了 [Node.js](https://nodejs.org/) (推荐 v18.x 或更高版本) 和 npm。

## 2. 安装与启动

1.  **克隆项目到本地 (如果需要)**
    ```bash
    git clone https://github.com/Chat-Keeper/ChatKeeper-Frontend.git
    cd ChatKeeper-Frontend
    ```

2.  **配置环境变量**
    复制 `.env.example` 为 `.env.development` 或 `.env.mock`，取决于您的使用哪种开发模式，并填入您的服务器地址 ：
    ```
    VITE_API_BASE=SERVER_API_ADDRESS
    ```

3.  **安装依赖**
    在项目根目录下运行以下命令来安装所有必需的依赖包：
    ```bash
    npm install
    ```

4.  **启动开发服务器**
    项目提供了两种开发模式：

    * **标准开发模式 (连接后端API)**
        ```bash
        npm run dev
        ```
        此命令会启动一个开发服务器，您可以通过或终端提示的端口访问。服务会监听在 `0.0.0.0`，允许局域网内其他设备访问。

    * **Mock数据模式 (使用模拟数据)**
        ```bash
        npm run mock
        ```
        此命令会以 `mock` 模式启动开发服务器，用于在没有后端支持的情况下进行开发和调试。

## 3. 主要命令

本项目在 `package.json` 的 `scripts` 中定义了以下常用命令：

| 命令 | 描述 |
| :--- | :--- |
| `npm run dev` | 以 **开发模式** 启动 Vite 开发服务器。 |
| `npm run mock` | 以 **Mock模式** 启动 Vite 开发服务器，用于前端独立调试。 |
| `npm run build` | 构建用于生产环境的项目文件，产物会生成在 `dist` 目录下。 |
| `npm run preview` | 在本地预览 **生产环境构建后** 的项目效果。请先执行 `npm run build`。 |
| `npm run format` | 使用 Prettier 自动格式化 `src/` 目录下的所有代码文件。 |

## 4. 部署

1.  **配置生产环境**
    复制 `.env.example` 为 `.env`，并填入您的部署服务器地址 ：
    ```
    VITE_API_BASE=SERVER_API_ADDRESS
    ```

2.  **构建项目**
    运行构建命令，生成静态文件：
    ```bash
    npm run build
    ```

3.  **部署静态文件**
    将 `dist` 目录下生成的所有文件部署到您的 Web 服务器（如 Nginx, Apache 或其他静态文件托管服务）的根目录即可。

