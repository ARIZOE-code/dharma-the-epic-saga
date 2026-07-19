// =====================================================
// DHARMA: The Epic Saga
// Powered by STK CREATION
// Main Game Configuration
// =====================================================

// Game Resolution
const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

// Global Game State
window.DHARMA_STATE = {
    currentChapter: 1,
    unlockedChapters: [1],
    playerHealth: 100,
    playerMana: 100,
    inventory: [],
    coins: 0,
    score: 0,
    completedMissions: [],
    settings: {
        music: true,
        sound: true,
        vibration: true
    }
};

// Phaser Configuration
const config = {
    type: Phaser.AUTO,

    parent: "game-container",

    width: GAME_WIDTH,
    height: GAME_HEIGHT,

    backgroundColor: "#0A0E27",

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: [

        BootScene,

        PreloadScene,

        IntroScene,

        MainMenuScene,

        Chapter1Scene,

        Chapter2Scene,

        Chapter3Scene

    ]
};

// Start Game
const game = new Phaser.Game(config);