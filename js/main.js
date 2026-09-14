import './render'; // 初始化 Canvas
import DataBus from './databus';
import ProfileScene from './scenes/profileScene';
import MapScene from './scenes/mapScene';
import ChallengeScene from './scenes/challengeScene';

const ctx = canvas.getContext('2d');

GameGlobal.databus = new DataBus();

/**
 * 字母派对 —— 游戏主函数
 * 场景由 databus.scene 驱动：profile（选档案）-> map（世界地图）-> challenge（字母关卡）
 */
export default class Main {
  aniId = 0;

  constructor() {
    const databus = GameGlobal.databus;

    this.profileScene = new ProfileScene(databus);
    this.mapScene = new MapScene(databus);
    this.challengeScene = new ChallengeScene(databus);

    this.currentSceneKey = null;

    wx.onTouchStart(this.handleTouch.bind(this));

    this.start();
  }

  start() {
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }

  getActiveScene() {
    const databus = GameGlobal.databus;

    if (this.currentSceneKey !== databus.scene) {
      this.currentSceneKey = databus.scene;
      if (databus.scene === 'challenge') {
        this.challengeScene.enter(databus.activeLetterId);
      }
    }

    if (databus.scene === 'profile') return this.profileScene;
    if (databus.scene === 'challenge') return this.challengeScene;
    return this.mapScene;
  }

  handleTouch(event) {
    const { clientX, clientY } = event.touches[0];
    this.getActiveScene().handleTouch(clientX, clientY);
  }

  render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.getActiveScene().render(ctx);
  }

  update() {
    GameGlobal.databus.frame++;
    this.getActiveScene().update();
  }

  loop() {
    this.update();
    this.render();
    this.aniId = requestAnimationFrame(this.loop.bind(this));
  }
}
