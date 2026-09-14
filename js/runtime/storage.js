const PROFILES_KEY = 'letterAdventure.profiles';
const ACTIVE_KEY = 'letterAdventure.activeProfileId';

const AVATAR_COLORS = ['#2fbf88', '#ff6b6b', '#4c8dff', '#8b5cf6', '#f2960a', '#e779c1'];

function safeGet(key, fallback) {
  try {
    const value = wx.getStorageSync(key);
    return value || fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    // 存储失败时静默忽略，不影响当次游戏体验
  }
}

export function loadProfiles() {
  return safeGet(PROFILES_KEY, []);
}

export function saveProfiles(profiles) {
  safeSet(PROFILES_KEY, profiles);
}

export function loadActiveProfileId() {
  return safeGet(ACTIVE_KEY, null);
}

export function saveActiveProfileId(id) {
  safeSet(ACTIVE_KEY, id);
}

export function createProfile(slotIndex) {
  return {
    id: `p${slotIndex}${Date.now()}`,
    slotIndex,
    name: `探险者${slotIndex + 1}`,
    color: AVATAR_COLORS[slotIndex % AVATAR_COLORS.length],
    coins: 0,
    // progress[letterId] = { recognized: bool }
    progress: {},
    createdAt: Date.now(),
  };
}

export { AVATAR_COLORS };
