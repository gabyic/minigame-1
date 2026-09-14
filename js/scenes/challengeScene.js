import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../render';
import { drawBlob, drawText, drawPanel, pointInRect } from '../ui/draw';
import { findLetterById, KINGDOMS, CONFUSABLE_PAIRS } from '../content/letters';

const ROUND_SEQUENCE = ['upper', 'lower', 'upper', 'lower'];
const BUBBLE_R = 36;
const ROUND_CLEAR_PAUSE = 45; // 帧数
const DONE_PAUSE = 90;
const COINS_PER_ROUND = 2;
const COINS_BONUS = 5;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * 「认一认」关卡：从下落的气泡里点出和目标一致的字母（大小写都算）
 * 不设失败状态——点错不惩罚，气泡飘走了会在顶部重新出现
 */
export default class ChallengeScene {
  constructor(databus) {
    this.databus = databus;
  }

  enter(letterId) {
    this.letter = findLetterById(letterId);
    this.kingdom = KINGDOMS.find((k) => k.id === this.letter.kingdomId);
    this.round = 0;
    this.phase = 'playing'; // 'playing' | 'roundClear' | 'done'
    this.pauseUntil = 0;
    this.backRect = { x: 16, y: 16, w: 76, h: 40 };
    this.setupRound();
  }

  setupRound() {
    const isUpper = ROUND_SEQUENCE[this.round % ROUND_SEQUENCE.length] === 'upper';
    const targetGlyph = isUpper ? this.letter.upper : this.letter.lower;

    const others = this.kingdom.letters.filter((l) => l.id !== this.letter.id);
    const confusableIds = CONFUSABLE_PAIRS[this.letter.id] || [];
    const confusableLetters = others.filter((l) => confusableIds.includes(l.id));
    const rest = shuffle(others.filter((l) => !confusableIds.includes(l.id)));
    const distractorLetters = [...confusableLetters, ...rest].slice(0, 3);

    const glyphs = shuffle([
      targetGlyph,
      ...distractorLetters.map((l) => (isUpper ? l.upper : l.lower)),
    ]);

    const margin = 60;
    const usableWidth = SCREEN_WIDTH - margin * 2;
    this.bubbles = glyphs.map((glyph, i) => ({
      glyph,
      isTarget: glyph === targetGlyph,
      x: margin + (usableWidth / (glyphs.length - 1 || 1)) * i,
      y: -80 - i * 140,
      vy: 1.1 + Math.random() * 0.6,
      shakeUntil: 0,
    }));

    this.targetGlyph = targetGlyph;
  }

  update() {
    const frame = this.databus.frame;

    if (this.phase === 'roundClear') {
      if (frame >= this.pauseUntil) {
        this.round++;
        if (this.round >= ROUND_SEQUENCE.length) {
          this.phase = 'done';
          this.pauseUntil = frame + DONE_PAUSE;
          this.databus.completeRecognition(this.letter.id, COINS_BONUS);
        } else {
          this.phase = 'playing';
          this.setupRound();
        }
      }
      return;
    }

    if (this.phase === 'done') {
      if (frame >= this.pauseUntil) {
        this.databus.goToMap();
      }
      return;
    }

    this.bubbles.forEach((b) => {
      b.y += b.vy;
      if (b.y - BUBBLE_R > SCREEN_HEIGHT) {
        b.y = -BUBBLE_R - Math.random() * 120;
        b.x = 60 + Math.random() * (SCREEN_WIDTH - 120);
      }
    });
  }

  render(ctx) {
    ctx.fillStyle = '#eaf3ff';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = this.kingdom.color;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.globalAlpha = 1;

    drawPanel(ctx, this.backRect.x, this.backRect.y, this.backRect.w, this.backRect.h, 14, '#ffffff', '#d9e4fb');
    drawText(ctx, '← 地图', this.backRect.x + this.backRect.w / 2, this.backRect.y + this.backRect.h / 2, {
      size: 14,
      align: 'center',
      color: '#5b5480',
    });

    drawText(ctx, `${this.letter.spirit} · ${this.letter.spiritEn}`, SCREEN_WIDTH / 2, 30, {
      size: 15,
      align: 'center',
      color: this.kingdom.color,
      weight: 'bold',
    });

    // 目标卡片
    drawPanel(ctx, SCREEN_WIDTH / 2 - 70, 70, 140, 90, 20, '#ffffff', this.kingdom.color);
    drawText(ctx, '找到它', SCREEN_WIDTH / 2, 92, { size: 13, align: 'center', color: '#8a84ab' });
    drawText(ctx, this.targetGlyph, SCREEN_WIDTH / 2, 132, {
      size: 44,
      align: 'center',
      weight: 'bold',
      color: this.kingdom.color,
    });

    // 进度点
    const dotsY = 172;
    const dotGap = 22;
    const startX = SCREEN_WIDTH / 2 - ((ROUND_SEQUENCE.length - 1) * dotGap) / 2;
    for (let i = 0; i < ROUND_SEQUENCE.length; i++) {
      ctx.beginPath();
      ctx.arc(startX + i * dotGap, dotsY, 6, 0, Math.PI * 2);
      ctx.fillStyle = i < this.round ? this.kingdom.color : '#d9e4fb';
      ctx.fill();
    }

    if (this.phase === 'playing') {
      this.bubbles.forEach((b) => {
        const shake = b.shakeUntil > this.databus.frame ? Math.sin(this.databus.frame * 3) * 4 : 0;
        ctx.beginPath();
        ctx.arc(b.x + shake, b.y, BUBBLE_R, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = this.kingdom.color;
        ctx.stroke();
        drawText(ctx, b.glyph, b.x + shake, b.y, {
          size: 26,
          align: 'center',
          weight: 'bold',
          color: '#241f45',
        });
      });
    }

    if (this.phase === 'roundClear') {
      drawText(ctx, '✓ 棒极了！', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, {
        size: 28,
        align: 'center',
        weight: 'bold',
        color: this.kingdom.color,
      });
    }

    if (this.phase === 'done') {
      drawPanel(ctx, SCREEN_WIDTH / 2 - 120, SCREEN_HEIGHT / 2 - 110, 240, 220, 26, '#ffffff', this.kingdom.color);
      drawBlob(ctx, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 50, 40, this.kingdom.color, { sparkle: true });
      drawText(ctx, '捕获成功！', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 10, {
        size: 20,
        align: 'center',
        weight: 'bold',
      });
      drawText(ctx, `${this.letter.spirit} ${this.letter.upper}${this.letter.lower}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 38, {
        size: 15,
        align: 'center',
        color: '#5b5480',
      });
      drawText(ctx, `\u{1FA99} +${this.databus.activeProfile ? COINS_PER_ROUND * ROUND_SEQUENCE.length + COINS_BONUS : 0}`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 66, {
        size: 15,
        align: 'center',
        color: '#f2960a',
        weight: 'bold',
      });
    }
  }

  handleTouch(x, y) {
    if (pointInRect(x, y, this.backRect)) {
      this.databus.goToMap();
      return;
    }

    if (this.phase !== 'playing') return;

    for (const b of this.bubbles) {
      const dx = x - b.x;
      const dy = y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) <= BUBBLE_R) {
        if (b.isTarget) {
          this.phase = 'roundClear';
          this.pauseUntil = this.databus.frame + ROUND_CLEAR_PAUSE;
          this.databus.awardCoins(COINS_PER_ROUND);
        } else {
          b.shakeUntil = this.databus.frame + 15;
        }
        return;
      }
    }
  }
}
