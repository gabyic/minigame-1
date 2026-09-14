import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { drawBlob, drawText, drawPanel, pointInRect } from '../ui/draw';
import { KINGDOMS } from '../content/letters';

const NODE_R = 34;

/**
 * 世界地图：苹果乐园(A-E) 的字母关卡节点 + 火焰谷预告(锁定)
 */
export default class MapScene {
  constructor(databus) {
    this.databus = databus;
    this.nodeRects = [];
    this.switchRect = null;
  }

  layout() {
    const kingdom = KINGDOMS[0];
    const letters = kingdom.letters;
    const topY = 220;
    const gapY = 92;
    const startX = SCREEN_WIDTH / 2;
    const amplitude = SCREEN_WIDTH / 2 - 70;

    this.nodeRects = letters.map((letter, i) => {
      const cx = startX + Math.sin(i * 1.1) * amplitude * 0.55;
      const cy = topY + i * gapY;
      return { letter, cx, cy, r: NODE_R };
    });

    this.switchRect = {
      x: SCREEN_WIDTH - 64,
      y: 24,
      w: 40,
      h: 40,
    };
  }

  update() {
    if (this.nodeRects.length === 0) this.layout();
  }

  render(ctx) {
    const databus = this.databus;
    const kingdom = KINGDOMS[0];

    ctx.fillStyle = '#eaf3ff';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // 顶部信息条
    drawPanel(ctx, 16, 16, SCREEN_WIDTH - 96, 46, 16, '#ffffff', '#d9e4fb');
    const profile = databus.activeProfile;
    drawBlob(ctx, 40, 39, 15, profile ? profile.color : '#2fbf88');
    drawText(ctx, profile ? profile.name : '', 66, 39, { size: 15, weight: 'bold' });
    drawText(ctx, `\u{1FA99} ${profile ? profile.coins : 0}`, SCREEN_WIDTH - 96, 39, {
      size: 15,
      align: 'right',
      color: '#8a84ab',
      weight: 'bold',
    });

    // 切换档案按钮
    drawPanel(ctx, this.switchRect.x, this.switchRect.y, this.switchRect.w, this.switchRect.h, 12, '#ffffff', '#d9e4fb');
    drawText(ctx, '↻', this.switchRect.x + 20, this.switchRect.y + 21, { size: 18, align: 'center', color: '#5b5480' });

    drawText(ctx, kingdom.name, SCREEN_WIDTH / 2, 130, { size: 24, align: 'center', weight: 'bold', color: '#2fbf88' });
    drawText(ctx, kingdom.nameEn, SCREEN_WIDTH / 2, 156, { size: 13, align: 'center', color: '#8a84ab' });

    // 连接路径
    ctx.strokeStyle = '#c9d5f5';
    ctx.lineWidth = 6;
    ctx.setLineDash([2, 14]);
    ctx.lineCap = 'round';
    ctx.beginPath();
    this.nodeRects.forEach((n, i) => {
      if (i === 0) ctx.moveTo(n.cx, n.cy);
      else ctx.lineTo(n.cx, n.cy);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const masteredCount = databus.masteredCount();

    this.nodeRects.forEach((n, i) => {
      const letter = n.letter;
      const unlocked = i <= masteredCount;
      const mastered = databus.isLetterMastered(letter.id);

      ctx.beginPath();
      ctx.arc(n.cx, n.cy, n.r, 0, Math.PI * 2);
      ctx.fillStyle = unlocked ? kingdom.color : '#d9e4fb';
      ctx.globalAlpha = unlocked ? 1 : 0.6;
      ctx.fill();
      ctx.globalAlpha = 1;

      drawText(ctx, letter.upper + letter.lower, n.cx, n.cy, {
        size: 22,
        align: 'center',
        color: '#ffffff',
        weight: 'bold',
      });

      if (mastered) {
        drawText(ctx, '★', n.cx + n.r - 8, n.cy - n.r + 8, { size: 16, align: 'center', color: '#f2960a' });
      }
      if (!unlocked) {
        drawText(ctx, '\u{1F512}', n.cx, n.cy + n.r + 16, { size: 14, align: 'center', color: '#8a84ab' });
      }
    });

    // 当前所在位置的小蛋仔
    const currentIndex = Math.min(masteredCount, this.nodeRects.length - 1);
    const current = this.nodeRects[currentIndex];
    if (current) {
      const bob = Math.sin(databus.frame / 20) * 6;
      drawBlob(ctx, current.cx + NODE_R + 26, current.cy + bob, 22, profile ? profile.color : '#2fbf88');
    }

    // 下一个王国预告
    const nextKingdom = KINGDOMS[1];
    const previewY = this.nodeRects.length
      ? this.nodeRects[this.nodeRects.length - 1].cy + 100
      : SCREEN_HEIGHT - 120;
    drawText(ctx, `\u{1F512} ${nextKingdom.name} 即将开放`, SCREEN_WIDTH / 2, previewY, {
      size: 14,
      align: 'center',
      color: '#8a84ab',
    });
  }

  handleTouch(x, y) {
    if (pointInRect(x, y, this.switchRect)) {
      this.databus.scene = 'profile';
      return;
    }

    const masteredCount = this.databus.masteredCount();
    for (let i = 0; i < this.nodeRects.length; i++) {
      const n = this.nodeRects[i];
      const dx = x - n.cx;
      const dy = y - n.cy;
      if (Math.sqrt(dx * dx + dy * dy) <= n.r) {
        if (i <= masteredCount) {
          this.databus.startChallenge(n.letter.id);
        }
        return;
      }
    }
  }
}
