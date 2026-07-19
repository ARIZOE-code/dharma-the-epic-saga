// =====================================================
// BootScene - Preload assets before Intro
// =====================================================

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.add.text(width / 2, height / 2 - 30, 'Loading...', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5);

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2, 320, 20);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xd4af37, 1);
      progressBar.fillRect(width / 2 - 155, height / 2 + 3, 310 * value, 14);
    });

    // ---- PLACEHOLDER ASSETS ----
    // Replace these generated textures with real art in /assets later.
    // For now we generate simple colored rectangles/circles so the game runs standalone.
  }

  create() {
    // Generate placeholder textures programmatically so nothing is broken
    // before real art assets are dropped into /assets.
    this.generatePlaceholderTextures();
    this.scene.start('IntroScene');
  }

  generatePlaceholderTextures() {
    // Player placeholder (blue capsule-ish rect)
    let g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x2b5fd9, 1);
    g.fillRoundedRect(0, 0, 32, 48, 8);
    g.generateTexture('player', 32, 48);
    g.destroy();

    // Training dummy / NPC placeholder (gold)
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xd4af37, 1);
    g.fillRoundedRect(0, 0, 32, 48, 8);
    g.generateTexture('npc', 32, 48);
    g.destroy();

    // Arrow placeholder
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(0, 4, 16, 0, 16, 8);
    g.generateTexture('arrow', 16, 8);
    g.destroy();

    // Target placeholder
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xaa2222, 1);
    g.fillCircle(20, 20, 20);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(20, 20, 12);
    g.fillStyle(0xaa2222, 1);
    g.fillCircle(20, 20, 5);
    g.generateTexture('target', 40, 40);
    g.destroy();

    // Ground tile
    g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x3a4a2a, 1);
    g.fillRect(0, 0, 64, 64);
    g.generateTexture('ground', 64, 64);
    g.destroy();
  }
}
