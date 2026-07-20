// =====================================================
// DHARMA: The Epic Saga - Main Game Config
// Powered by STK CREATION
// =====================================================

// On-screen error catcher (so errors are visible on mobile without dev tools)
window.addEventListener('error', function (e) {
  const box = document.createElement('div');
  box.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#330000;color:#ff6666;' +
    'font-family:monospace;font-size:13px;padding:12px;z-index:99999;white-space:pre-wrap;';
  box.textContent = 'JS ERROR:\n' + e.message + '\nFile: ' + e.filename + '\nLine: ' + e.lineno;
  document.body.appendChild(box);
});

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
  scene: [BootScene, IntroScene, MainMenuScene, Chapter1Scene, Chapter2Scene, Chapter3Scene, Chapter4Scene, Chapter5Scene, Chapter6Scene, Chapter7Scene]
};

// Global save/progress object (Phase 1: local only, Firebase later)
window.DHARMA_STATE = {
  currentChapter: 1,
  unlockedChapters: [1],
  playerHealth: 100,
  inventory: []
};

const game = new Phaser.Game(config);
