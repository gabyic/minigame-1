import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { drawBlob, drawText, drawPanel, pointInRect } from '../ui/draw';

const SLOT_SIZE = 130;
const SLOT_GAP = 20;

/**
 * 选择/创建探险者档案（最多 4 个），不预设任何家庭关系，谁都能建一个
 */
export default class ProfileScene {
  constructor(databus) {
    this.databus = databus;
    this.slotRects = [];
  }

  layout() {
    const cols = 2;
    const totalW = cols * SLOT_SIZE + (cols - 1) * SLOT_GAP;
    const startX = (SCREEN_WIDTH - totalW) / 2;
    const startY = SCREEN_HEIGHT / 2 - SLOT_SIZE - SLOT_GAP / 2;

    this.slotRects = [];
    for (let i = 0; i < this.databus.maxProfiles; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      this.slotRects.push({
        x: startX + col * (SLOT_SIZE + SLOT_GAP),
        y: startY + row * (SLOT_SIZE + SLOT_GAP),
        w: SLOT_SIZE,
        h: SLOT_SIZE,
      });
    }
  }

  update() {
    if (this.slotRects.length !== this.databus.maxProfiles) this.layout();
  }

  render(ctx) {
    ctx.fillStyle = '#eaf3ff';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    drawText(ctx, '字母派对', SCREEN_WIDTH / 2, 90, { size: 34, align: 'center', weight: 'bold' });
    drawText(ctx, '选择一个探险者档案开始', SCREEN_WIDTH / 2, 130, {
      size: 16,
      align: 'center',
      color: '#5b5480',
    });

    this.slotRects.forEach((rect, i) => {
      const profile = this.databus.profiles.find((p) => p.slotIndex === i);
      drawPanel(ctx, rect.x, rect.y, rect.w, rect.h, 24, '#ffffff', '#d9e4fb');

      if (profile) {
        drawBlob(ctx, rect.x + rect.w / 2, rect.y + rect.h / 2 - 12, 34, profile.color);
        drawText(ctx, profile.name, rect.x + rect.w / 2, rect.y + rect.h - 24, {
          size: 15,
          align: 'center',
          weight: 'bold',
        });
        drawText(ctx, `\u{1FA99} ${profile.coins}`, rect.x + rect.w / 2, rect.y + rect.h - 4, {
          size: 12,
          align: 'center',
          color: '#8a84ab',
        });
      } else {
        drawText(ctx, '+', rect.x + rect.w / 2, rect.y + rect.h / 2 - 10, {
          size: 44,
          align: 'center',
          color: '#c9d5f5',
          weight: 'bold',
        });
        drawText(ctx, '新建档案', rect.x + rect.w / 2, rect.y + rect.h - 20, {
          size: 14,
          align: 'center',
          color: '#8a84ab',
        });
      }
    });
  }

  handleTouch(x, y) {
    for (let i = 0; i < this.slotRects.length; i++) {
      if (pointInRect(x, y, this.slotRects[i])) {
        const profile = this.databus.profiles.find((p) => p.slotIndex === i);
        if (profile) {
          this.databus.selectProfile(profile.id);
        } else {
          this.databus.createProfileInSlot(i);
        }
        return;
      }
    }
  }
}
