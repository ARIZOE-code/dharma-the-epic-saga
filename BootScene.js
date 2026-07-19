// =====================================================
// DHARMA: The Epic Saga
// BootScene
// Powered by STK CREATION
// =====================================================

class BootScene extends Phaser.Scene {

    constructor() {
        super("BootScene");
    }

    preload() {

        // Boot assets only (future logo/fonts can be loaded here)

    }

    create() {

        // Global Placeholder Textures
        this.generatePlaceholderTextures();

        // Move to Preloader
        this.scene.start("PreloadScene");

    }

    generatePlaceholderTextures() {

        let g = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        // Player
        g.fillStyle(0x2B5FD9, 1);
        g.fillRoundedRect(0, 0, 32, 48, 8);
        g.generateTexture("player", 32, 48);
        g.destroy();

        // NPC
        g = this.make.graphics({ add: false });

        g.fillStyle(0xD4AF37, 1);
        g.fillRoundedRect(0, 0, 32, 48, 8);
        g.generateTexture("npc", 32, 48);
        g.destroy();

        // Arrow
        g = this.make.graphics({ add: false });

        g.fillStyle(0xFFFFFF, 1);
        g.fillTriangle(0, 4, 16, 0, 16, 8);
        g.generateTexture("arrow", 16, 8);
        g.destroy();

        // Target
        g = this.make.graphics({ add: false });

        g.fillStyle(0xAA2222);
        g.fillCircle(20, 20, 20);

        g.fillStyle(0xFFFFFF);
        g.fillCircle(20, 20, 12);

        g.fillStyle(0xAA2222);
        g.fillCircle(20, 20, 5);

        g.generateTexture("target", 40, 40);
        g.destroy();

        // Ground
        g = this.make.graphics({ add: false });

        g.fillStyle(0x3A4A2A);
        g.fillRect(0, 0, 64, 64);

        g.generateTexture("ground", 64, 64);
        g.destroy();

    }

}