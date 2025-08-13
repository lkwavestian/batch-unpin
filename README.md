# Batch Unpin Tabs - 批量取消当前窗口固定标签页

<div align="center">

[English](README_EN.md) | [中文](README.md)

</div>

## 功能描述

这个 VSCode 插件提供了批量取消当前窗口固定标签页的功能。当你有多个固定标签页时，可以一键取消当前活动窗口中的所有固定标签页，而不需要逐个手动取消。特别适用于拆分编辑器后只想取消当前窗口固定标签页的场景。

## 功能特点

- 🚀 一键批量取消当前窗口固定标签页
- 🎯 智能识别当前活动窗口，只操作当前窗口的标签页
- ⚡ 从后向前取消固定，避免标签页闪现移位现象
- ⚠️ 操作前会显示确认对话框，防止误操作
- 📊 显示操作结果和统计信息
- 📝 支持通过命令面板和编辑器标题栏访问
- 🌍 支持多语言界面（中文/英文）

## 使用方法

### 方法 1：命令面板

1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板
2. 输入 "取消当前窗口固定标签页" 或 "Batch Unpin"
3. 选择命令并执行

### 方法 2：编辑器标题栏

在编辑器标题栏的导航组中找到 "取消当前窗口固定标签页" 按钮

![Button Icon](./images/button.png)

## 安装方法

### 从 VSCode 扩展市场安装

1. 打开 VSCode
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索 "Batch Unpin Tabs"
4. 点击安装

### 开发环境安装

1. 克隆或下载此项目
2. 在项目根目录运行：
   ```bash
   npm install
   npm run compile
   ```
3. 按 `F5` 启动调试模式，会打开一个新的 VSCode 窗口
4. 在新窗口中测试插件功能

### 手动安装

1. 安装 `vsce` 工具：
   ```bash
   npm install -g vsce
   ```
2. 在项目根目录运行：
   ```bash
   vsce package
   ```
3. 生成的 `.vsix` 文件可以在 VSCode 中通过 "扩展" 面板安装

## 开发说明

### 项目结构

```
batch-unpin/
├── src/
│   ├── extension.ts      # 主要插件逻辑
│   └── i18n.ts          # 国际化支持
├── i18n/
│   ├── zh-cn.json       # 中文语言包
│   └── en.json          # 英文语言包
├── package.nls.json      # VSCode界面国际化（中文）
├── package.nls.en.json   # VSCode界面国际化（英文）
├── package.json          # 插件配置
├── tsconfig.json         # TypeScript配置
└── README.md            # 说明文档
```

### 主要功能实现

- 使用 `vscode.window.tabGroups.all` 获取所有标签页组
- 通过 `flatMap` 获取所有标签页
- 使用 `filter` 筛选出固定标签页
- 通过 `vscode.commands.executeCommand('workbench.action.unpinEditor')` 取消固定
- 支持多语言界面，自动根据 VSCode 语言设置切换

### 国际化特性

- **VSCode 界面国际化**：命令标题、工具提示等界面元素支持中英文
- **运行时国际化**：操作过程中的所有消息都支持多语言
- **自动语言检测**：根据用户的 VSCode 语言设置自动选择对应语言
- **参数化消息**：支持动态参数替换，如标签页数量等

## 注意事项

- 插件会显示确认对话框，防止误操作
- 如果当前没有固定标签页，会显示提示信息
- 操作完成后会显示成功取消的标签页数量
- 界面语言会根据 VSCode 设置自动切换

## 许可证

MIT License
