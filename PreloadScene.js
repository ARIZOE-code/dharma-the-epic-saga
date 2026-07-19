// =====================================================
// DHARMA: The Epic Saga
// PreloadScene
// Powered by STK CREATION
// =====================================================

class PreloadScene extends Phaser.Scene {

    constructor() {
        super("PreloadScene");
    }

    preload() {

        this.cameras.main.setBackgroundColor("#081229");

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.text(
            width / 2,
            height / 2 - 80,
            "Loading DHARMA: The Epic Saga...",
            {
                fontSize: "28px",
                color: "#FFD700",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 210, height / 2 - 10, 420, 40);

        const progressBar = this.add.graphics();

        const percentText = this.add.text(
            width / 2,
            height / 2 + 50,
            "0%",
            {
                fontSize: "22px",
                color: "#FFFFFF"
            }
        ).setOrigin(0.5);

        this.load.on("progress", (value) => {

            progressBar.clear();

            progressBar.fillStyle(0xFFD700, 1);

            progressBar.fillRect(
                width / 2 - 200,
                height / 2,
                400 * value,
                20
            );

            percentText.setText(Math.floor(value * 100) + "%");

        });

        this.load.on("complete", () => {

            progressBar.destroy();
            progressBox.destroy();

        });

        // No external assets yet.
        // Placeholder textures generated in BootScene.

    }

    create() {

        this.scene.start("IntroScene");

    }

}