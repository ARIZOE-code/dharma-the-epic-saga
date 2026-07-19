// =====================================================
// DHARMA: The Epic Saga - Main Game Config
// Powered by STK CREATION
// =====================================================

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#0a0e27',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, IntroScene, MainMenuScene, Chapter1Scene, Chapter2Scene, Chapter3Scene]
};

// Global save/progress object (Phase 1: local only, Firebase later)
window.DHARMA_STATE = {
  currentChapter: 1,
  unlockedChapters: [1],
  playerHealth: 100,
  inventory: []
};

const game = new Phaser.Game(config);
