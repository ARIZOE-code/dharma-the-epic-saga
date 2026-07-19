class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: "PreloadScene" });
    }

    preload() {

        // Background
        this.cameras.main.setBackgroundColor("#081229");

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Loading Text
        const loadingText = this.add.text(width / 2, height / 2 - 80,
            "Loading DHARMA: The Epic Saga...", {
                fontSize: "26px",
                color: "#FFD700",
                fontStyle: "bold"
            }).setOrigin(0.5);

        // Progress Box
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 210, height / 2 - 10, 420, 40);

        // Progress Bar
        const progressBar = this.add.graphics();

        // Percentage
        const percentText = this.add.text(width / 2, height / 2 + 50, "0%", {
            fontSize: "22px",
            color: "#ffffff"
        }).setOrigin(0.5);

        this.load.on("progress", (value) => {

            progressBar.clear();

            progressBar.fillStyle(0xFFD700, 1);

            progressBar.fillRect(
                width / 2 - 200,
                height / 2,
                400 * value,
                20
            );

            percentText.setText(parseInt(value * 100) + "%");
        });

        this.load.on("complete", () => {

            progressBar.destroy();
            progressBox.destroy();

        });

        // ========= ASSETS =========

        // Images
        this.load.image("logo", "assets/images/logo.png");
        this.load.image("menuBg", "assets/images/menu-bg.jpg");

        // Player
        this.load.spritesheet("ram",
            "assets/sprites/ram.png",
            {
                frameWidth: 64,
                frameHeight: 64
            });

        // Enemy
        this.load.spritesheet("tataka",
            "assets/sprites/tataka.png",
            {
                frameWidth: 64,
                frameHeight: 64
            });

        // Weapons
        this.load.image("arrow", "assets/weapons/arrow.png");
        this.load.image("bow", "assets/weapons/bow.png");

        // Audio
        this.load.audio("bgMusic", "assets/audio/bg.mp3");
        this.load.audio("arrowSound", "assets/audio/arrow.mp3");

    }

    create() {

        this.scene.start("IntroScene");

    }
}