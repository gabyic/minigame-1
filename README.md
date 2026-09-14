# 字母派对 Letter Party

一款给刚开始学英语的孩子玩的双语字母闯关小游戏（微信小游戏）。

- 设计方案见 [`design/letter-adventure-design.html`](design/letter-adventure-design.html)：核心玩法、字母精灵收集进化、蛋仔派对风格的奖励机制、26 字母世界地图、开发路线图。
- 每个字母要集齐「认一认 / 写一写 / 听一读」三枚徽章才会让对应的字母精灵进化，读音支持英式/美式两种口音。
- 支持多个探险者档案（最多 4 个），不限定为固定的两个孩子。

当前实现进度对照设计方案里的路线图：

- [x] 阶段 0：仓库初始化、公开推送、设计方案
- [x] 阶段 1：世界地图 + 苹果乐园（A–E）「认一认」关卡可玩通关（占位图形，无美术/音频素材）
- [ ] 阶段 2：手指描字母的「写一写」引擎、字母图鉴、进化系统
- [ ] 阶段 3：「听一读」双音标音频（需要外部素材）、扭蛋 / 装扮间 / 连续打卡
- [ ] 阶段 4：兄弟姐妹协作关卡、家长掌握度面板、剩余四大王国

## 目录结构

```
├── design
│   └── letter-adventure-design.html   // 完整设计方案（可作为 Artifact 查看）
├── js
│   ├── base
│   │   ├── animation.js                // 帧动画的简易实现（占位，暂未接入真实素材）
│   │   ├── pool.js                     // 对象池的简易实现
│   │   └── sprite.js                   // 基于图片的精灵类（占位，暂未接入真实素材）
│   ├── content
│   │   └── letters.js                  // 5 大王国 / 26 字母 / 易混淆字母对 配置
│   ├── libs
│   │   └── tinyemitter.js              // 事件监听和触发
│   ├── runtime
│   │   └── storage.js                  // 探险者档案的本地存储读写
│   ├── scenes
│   │   ├── profileScene.js             // 选择/新建探险者档案
│   │   ├── mapScene.js                 // 世界地图，字母关卡节点
│   │   └── challengeScene.js           // 「认一认」关卡：气泡里点出目标字母
│   ├── ui
│   │   └── draw.js                     // canvas 绘制工具（圆角面板、蛋仔小怪物、文字）
│   ├── databus.js                      // 全局状态：场景切换、档案、掌握进度
│   ├── main.js                         // 游戏入口，场景循环与触摸分发
│   └── render.js                       // 基础渲染信息
├── .eslintrc.js                        // 代码规范
├── game.js                             // 游戏逻辑主入口
├── game.json                           // 游戏运行时配置
├── project.config.json                 // 项目配置
└── project.private.config.json         // 项目个人配置（已 gitignore）
```

## 本地运行

用微信开发者工具打开本目录即可（`project.config.json` 里已配置 `compileType: game`）。
