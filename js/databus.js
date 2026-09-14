import Pool from './base/pool';
import { getAllPlayableLetters } from './content/letters';
import {
  loadProfiles,
  saveProfiles,
  loadActiveProfileId,
  saveActiveProfileId,
  createProfile,
} from './runtime/storage';

let instance;

const MAX_PROFILES = 4;

/**
 * 全局状态管理器：场景切换、探险者档案、字母掌握进度
 */
export default class DataBus {
  pool = new Pool();
  animations = [];
  frame = 0;

  scene = 'profile'; // 'profile' | 'map' | 'challenge'
  activeLetterId = null; // 当前挑战的字母 id

  profiles = [];
  activeProfileId = null;

  constructor() {
    if (instance) return instance;
    instance = this;

    this.profiles = loadProfiles();
    this.activeProfileId = loadActiveProfileId();
  }

  get activeProfile() {
    return this.profiles.find((p) => p.id === this.activeProfileId) || null;
  }

  hasEmptySlot() {
    return this.profiles.length < MAX_PROFILES;
  }

  get maxProfiles() {
    return MAX_PROFILES;
  }

  createProfileInSlot(slotIndex) {
    const profile = createProfile(slotIndex);
    this.profiles.push(profile);
    saveProfiles(this.profiles);
    this.selectProfile(profile.id);
    return profile;
  }

  selectProfile(id) {
    this.activeProfileId = id;
    saveActiveProfileId(id);
    this.scene = 'map';
  }

  goToMap() {
    this.scene = 'map';
    this.activeLetterId = null;
  }

  startChallenge(letterId) {
    this.activeLetterId = letterId;
    this.scene = 'challenge';
  }

  // 当前档案已掌握（认字徽章点亮）的字母数量，决定地图上解锁到第几个
  masteredCount() {
    const profile = this.activeProfile;
    if (!profile) return 0;
    const letters = getAllPlayableLetters();
    let count = 0;
    for (const letter of letters) {
      if (profile.progress[letter.id] && profile.progress[letter.id].recognized) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  isLetterUnlocked(letterId) {
    const letters = getAllPlayableLetters();
    const index = letters.findIndex((l) => l.id === letterId);
    if (index === -1) return false;
    return index <= this.masteredCount();
  }

  isLetterMastered(letterId) {
    const profile = this.activeProfile;
    return !!(profile && profile.progress[letterId] && profile.progress[letterId].recognized);
  }

  completeRecognition(letterId, coinsEarned) {
    const profile = this.activeProfile;
    if (!profile) return;
    if (!profile.progress[letterId]) profile.progress[letterId] = {};
    profile.progress[letterId].recognized = true;
    profile.coins += coinsEarned;
    saveProfiles(this.profiles);
  }

  awardCoins(amount) {
    const profile = this.activeProfile;
    if (!profile) return;
    profile.coins += amount;
    saveProfiles(this.profiles);
  }
}
