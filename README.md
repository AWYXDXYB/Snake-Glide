# 🐍 Snake Glide - 网页版贪吃蛇游戏

![GitHub](https://img.shields.io/badge/license-MIT-blue.svg)
![GitHub](https://img.shields.io/badge/version-2.0.0-green.svg)
![GitHub](https://img.shields.io/badge/HTML5-CSS3-JavaScript-orange.svg)

## ✨ 项目简介

**Snake Glide** 是一款基于现代Web技术开发的经典贪吃蛇游戏升级版，游戏采用响应式设计，完美支持桌面和移动设备。

## 🎮 游戏特色

### 🏆 核心功能
- **多难度系统** - 简单、中等、困难、疯狂四种难度选择
- **主题切换** - 经典、暗黑、多彩、自然四种视觉主题
- **等级系统** - 随着分数提升自动升级，速度逐渐加快
- **音效反馈** - 完整的音效系统，可自由开启关闭
- **最高分记录** - 本地存储最高分记录

### 🎨 视觉体验
- **流畅动画** - 蛇身移动和食物闪烁的平滑动画
- **网格显示** - 可开关的网格背景
- **响应式设计** - 完美适配各种屏幕尺寸
- **移动端优化** - 虚拟控制按钮和手势支持

### 📱 操作支持
- **键盘控制** - 方向键、WASD、空格暂停、回车开始
- **触摸控制** - 移动端虚拟方向按钮
- **重力感应** - 支持手机重力感应控制（可选）

## 🚀 快速开始

### 在线访问
直接访问 GitHub Pages 部署的页面即可开始游戏

### 本地运行
```bash
# 克隆项目
git clone https://github.com/your-username/snake-glide.git

# 进入目录
cd snake-glide

# 使用任意HTTP服务器运行
# 例如使用Python
python -m http.server 8000

# 或使用Node.js http-server
npx http-server

# 然后在浏览器访问 http://localhost:8000
```

## 🎯 游戏控制

### 🖥️ 桌面端控制
- **方向键** 或 **WASD** - 控制蛇的移动方向
- **空格键** - 暂停/继续游戏
- **回车键** - 开始新游戏
- **ESC键** - 重置游戏

### 📱 移动端控制
- **虚拟按钮** - 屏幕上的方向控制按钮
- **滑动屏幕** - 向相应方向滑动控制移动
- **重力感应** - 倾斜手机控制方向（可选）

## 🛠️ 技术架构

### 前端技术栈
- **HTML5** - 语义化页面结构
- **CSS3** - 现代化样式与动画
- **JavaScript ES6+** - 游戏核心逻辑
- **Canvas API** - 高性能游戏渲染
- **Web Audio API** - 动态音效生成

### 核心特性
```javascript
// 模块化游戏架构
- 游戏状态管理
- 碰撞检测系统
- 分数等级计算
- 本地存储集成
- 响应式画布渲染
```

## 📁 项目结构

```
snake-glide/
├── index.html          # 主页面文件
├── style.css           # 样式和主题定义
├── script.js           # 游戏核心逻辑
└── README.md          # 项目说明文档
```

### 文件说明
- **index.html** - 游戏界面结构，包含画布、控制面板和设置选项
- **style.css** - 完整的样式系统，支持多主题切换和响应式布局
- **script.js** - 游戏引擎，包含状态管理、渲染逻辑和用户交互

## 🎮 游戏规则

### 基本规则
1. 🍎 **吃食物** - 控制蛇吃掉随机出现的食物
2. 📈 **增长身体** - 每吃一个食物，蛇身长度增加
3. ⭐ **得分升级** - 每吃一个食物得10分，每100分升一级
4. 💀 **游戏结束** - 撞到墙壁或自身游戏结束
5. 🏆 **挑战纪录** - 努力创造新的最高分纪录

### 难度系统
| 难度 | 初始速度 | 速度增量 | 最高速度 |
|------|----------|----------|----------|
| 简单 | 200ms | 3ms/级 | 80ms |
| 中等 | 150ms | 5ms/级 | 50ms |
| 困难 | 100ms | 7ms/级 | 30ms |
| 疯狂 | 70ms | 10ms/级 | 20ms |

## 🎨 主题系统

### 可用主题
- **经典主题** - 传统的绿色蛇身和红色食物
- **暗黑主题** - 深色背景，保护眼睛
- **多彩主题** - 鲜艳的色彩搭配
- **自然主题** - 绿色生态风格

### 自定义特性
- 🎯 实时主题切换
- 🎵 音效开关控制
- 🔲 网格显示选项
- 📱 移动端控制面板

## 🔧 开发特性

### 代码亮点
```javascript
// 现代化的游戏状态管理
const gameState = {
    snake: [],          // 蛇身数组
    food: null,         // 食物位置
    direction: 'right', // 当前方向
    score: 0,           // 当前分数
    level: 1,           // 当前等级
    isPlaying: false,   // 游戏状态
    // ... 更多状态
};

// 流畅的游戏循环
function gameUpdate() {
    moveSnake();
    checkCollision();
    drawGame();
}
```

### 性能优化
- ⚡ 使用requestAnimationFrame实现流畅动画
- 🎨 Canvas高效渲染，60FPS流畅体验
- 💾 本地存储优化，减少IO操作
- 📱 移动端触摸事件优化

## 🤝 贡献指南

欢迎为这个项目贡献代码！请遵循以下步骤：

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/snake-glide.git
   ```

2. **创建特性分支**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **提交更改**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **推送分支**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **创建 Pull Request**

### 开发规范
- 使用ES6+语法特性
- 保持代码注释清晰
- 遵循响应式设计原则
- 测试多设备兼容性

## 🐛 问题反馈

如果发现任何bug或有改进建议，请通过以下方式反馈：

1. 查看 [现有Issue](https://github.com/your-username/snake-glide/issues)
2. 创建 [新Issue](https://github.com/your-username/snake-glide/issues/new)
3. 描述详细的问题现象和复现步骤

## 📄 许可证

本项目采用 **MIT 许可证** - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

特别感谢：
- **Web技术社区** - 提供了丰富的开发资源
- **测试用户** - 提供了宝贵的反馈意见
- **开源项目** - 借鉴了优秀的设计理念

---

**享受流畅的贪吃蛇游戏体验吧！** 🎊

*让经典游戏在现代浏览器中焕发新生！*

---
*项目最后更新：2024年6月6日*  
*保持更新，请关注项目仓库* ⭐
