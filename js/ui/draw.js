/**
 * 通用 canvas 绘制小工具：圆角矩形、蛋仔风格的小怪物、按钮
 * 目前先用几何图形占位，后续可以替换成真正的美术素材
 */

export function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawPanel(ctx, x, y, w, h, r, fillColor, strokeColor) {
  roundedRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fillColor;
  ctx.fill();
  if (strokeColor) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}

/**
 * 画一只圆滚滚的蛋仔小精灵：主体 + 两只眼睛 + 腮红
 */
export function drawBlob(ctx, cx, cy, size, color, opts = {}) {
  const { sleepy = false, sparkle = false } = opts;

  ctx.save();
  ctx.translate(cx, cy);

  // 主体
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.9, 0, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  if (!sleepy) {
    // 眼睛
    ctx.fillStyle = '#241f45';
    ctx.beginPath();
    ctx.ellipse(-size * 0.32, -size * 0.05, size * 0.1, size * 0.13, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.32, -size * 0.05, size * 0.1, size * 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#241f45';
    ctx.lineWidth = size * 0.06;
    ctx.beginPath();
    ctx.moveTo(-size * 0.44, -size * 0.05);
    ctx.lineTo(-size * 0.2, -size * 0.05);
    ctx.moveTo(size * 0.2, -size * 0.05);
    ctx.lineTo(size * 0.44, -size * 0.05);
    ctx.stroke();
  }

  // 腮红
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(-size * 0.55, size * 0.28, size * 0.13, size * 0.09, 0, 0, Math.PI * 2);
  ctx.ellipse(size * 0.55, size * 0.28, size * 0.13, size * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  if (sparkle) {
    ctx.fillStyle = '#8b5cf6';
    ctx.font = `${Math.round(size * 0.7)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✦', size * 0.75, -size * 0.85);
  }

  ctx.restore();
}

export function drawText(ctx, text, x, y, { size = 20, color = '#241f45', align = 'left', weight = '' } = {}) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px sans-serif`.trim();
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function pointInRect(px, py, rect) {
  return px >= rect.x && px <= rect.x + rect.w && py >= rect.y && py <= rect.y + rect.h;
}
