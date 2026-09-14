/**
 * 世界地图内容配置：5 大王国、26 个字母
 * 目前只有「苹果乐园」(A-E) 接入了可玩的关卡，其余王国先在地图上以锁定状态展示
 */
export const KINGDOMS = [
  {
    id: 'apple-grove',
    name: '苹果乐园',
    nameEn: 'Apple Grove',
    color: '#2fbf88',
    boss: '大嘴怪蛋 Munchy Mimic',
    playable: true,
    letters: [
      { id: 'a', upper: 'A', lower: 'a', word: 'apple', spirit: '苹苹', spiritEn: 'Applet' },
      { id: 'b', upper: 'B', lower: 'b', word: 'bee', spirit: '嗡嗡', spiritEn: 'Buzzling' },
      { id: 'c', upper: 'C', lower: 'c', word: 'cat', spirit: '喵喵', spiritEn: 'Purrly' },
      { id: 'd', upper: 'D', lower: 'd', word: 'duck', spirit: '嘎嘎', spiritEn: 'Quackle' },
      { id: 'e', upper: 'E', lower: 'e', word: 'elephant', spirit: '蹦蹦', spiritEn: 'Elphi' },
    ],
  },
  {
    id: 'flame-valley',
    name: '火焰谷',
    nameEn: 'Flame Valley',
    color: '#ff6b6b',
    boss: '烈焰蛋王 Blaze Yolk King',
    playable: false,
    letters: [
      { id: 'f', upper: 'F', lower: 'f' },
      { id: 'g', upper: 'G', lower: 'g' },
      { id: 'h', upper: 'H', lower: 'h' },
      { id: 'i', upper: 'I', lower: 'i' },
      { id: 'j', upper: 'J', lower: 'j' },
    ],
  },
  {
    id: 'ocean-bay',
    name: '海洋湾',
    nameEn: 'Ocean Bay',
    color: '#4c8dff',
    boss: '深海章鱼蛋 Inky Deep-Egg',
    playable: false,
    letters: [
      { id: 'k', upper: 'K', lower: 'k' },
      { id: 'l', upper: 'L', lower: 'l' },
      { id: 'm', upper: 'M', lower: 'm' },
      { id: 'n', upper: 'N', lower: 'n' },
      { id: 'o', upper: 'O', lower: 'o' },
    ],
  },
  {
    id: 'starlight-plain',
    name: '星光原',
    nameEn: 'Starlight Plain',
    color: '#8b5cf6',
    boss: '幻影猫头鹰 Nightowl Shade',
    playable: false,
    letters: [
      { id: 'p', upper: 'P', lower: 'p' },
      { id: 'q', upper: 'Q', lower: 'q' },
      { id: 'r', upper: 'R', lower: 'r' },
      { id: 's', upper: 'S', lower: 's' },
      { id: 't', upper: 'T', lower: 't' },
    ],
  },
  {
    id: 'cloud-castle',
    name: '云朵城',
    nameEn: 'Cloud Castle',
    color: '#f2960a',
    boss: '巨蛋守护龙 Grand Egg Dragon',
    playable: false,
    letters: [
      { id: 'u', upper: 'U', lower: 'u' },
      { id: 'v', upper: 'V', lower: 'v' },
      { id: 'w', upper: 'W', lower: 'w' },
      { id: 'x', upper: 'X', lower: 'x' },
      { id: 'y', upper: 'Y', lower: 'y' },
      { id: 'z', upper: 'Z', lower: 'z' },
    ],
  },
];

// 容易混淆的字母对，出现在关卡里时会优先作为干扰项
export const CONFUSABLE_PAIRS = {
  b: ['d'], d: ['b'],
  p: ['q'], q: ['p'],
  m: ['n', 'w'], n: ['m', 'u'],
  u: ['n', 'v'], v: ['u'],
  i: ['l', 'j'], l: ['i'],
};

export function getAllPlayableLetters() {
  return KINGDOMS.filter((k) => k.playable).flatMap((k) =>
    k.letters.map((l) => ({ ...l, kingdomId: k.id, kingdomColor: k.color }))
  );
}

export function findLetterById(id) {
  for (const kingdom of KINGDOMS) {
    const letter = kingdom.letters.find((l) => l.id === id);
    if (letter) return { ...letter, kingdomId: kingdom.id, kingdomColor: kingdom.color };
  }
  return null;
}
