// =====================================================
// Chapter1Scene - Ayodhya: Training / Archery / Basic Controls
// =====================================================

class Chapter1Scene extends Phaser.Scene {
  constructor() {
    super('Chapter1Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    // World bounds larger than screen (open training ground)
    const worldW = 1600;
    const worldH = 900;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Ground tiles
    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setAlpha(0.9);
      }
    }

    // Chapter title banner
    this.add.text(width / 2, 20, 'Chapter 1: Ayodhya — Training', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Player
    this.player = this.physics.add.sprite(200, 400, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 220;

    // NPC trainer (Guru)
    this.trainer = this.physics.add.staticSprite(400, 400, 'npc');
    this.add.text(400, 360, 'Guru', {
      fontSize: '14px', color: '#ffffff'
    }).setOrigin(0.5);

    // Archery target
    this.target = this.physics.add.staticSprite(900, 400, 'target');
    this.add.text(900, 350, 'Archery Target', {
      fontSize: '14px', color: '#ffffff'
    }).setOrigin(0.5);

    // Arrows group
    this.arrows = this.physics.add.group();
    this.arrowsShot = 0;
    this.targetsHit = 0;

    // Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Input
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Mouse click = shoot arrow toward pointer (basic combat/archery control)
    this.input.on('pointerdown', (pointer) => {
      this.shootArrow(pointer);
    });

    // Collisions
    this.physics.add.overlap(this.arrows, this.target, (arrow, target) => {
      arrow.destroy();
      this.targetsHit++;
      this.hud.setText(this.hudText());
      this.flashText(this.target.x, this.target.y - 40, 'Hit!', '#00ff88');
      if (this.targetsHit >= 3) {
        this.completeTraining();
      }
    });

    // HUD (fixed to camera)
    this.hud = this.add.text(16, 16, '', {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);
    this.hud.setText(this.hudText());

    // Instructions
    this.add.text(width / 2, height - 20,
      'WASD: Move   |   Shift: Sprint   |   Click: Shoot Arrow',
      { fontSize: '14px', color: '#aaaaaa' }
    ).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    this.trainingComplete = false;
  }

  hudText() {
    return `Chapter 1: Ayodhya\nTargets Hit: ${this.targetsHit}/3`;
  }

  shootArrow(pointer) {
    if (this.trainingComplete) return;

    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const arrow = this.arrows.create(this.player.x, this.player.y, 'arrow');
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    arrow.setRotation(angle);

    const speed = 500;
    arrow.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.arrowsShot++;

    // Destroy arrow after 2s if it hits nothing
    this.time.delayedCall(2000, () => {
      if (arrow.active) arrow.destroy();
    });
  }

  flashText(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '16px', color }).setOrigin(0.5);
    this.tweens.add({
      targets: t,
      y: y - 30,
      alpha: 0,
      duration: 800,
      onComplete: () => t.destroy()
    });
  }

  completeTraining() {
    this.trainingComplete = true;
    const { width, height } = this.cameras.main;
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setScrollFactor(0).setDepth(90);
    const msg = this.add.text(width / 2, height / 2 - 20,
      'Training Complete!\nAyodhya training ke baad, Vishwamitra tumhe\nyagya suraksha ke liye bulate hain...',
      { fontSize: '20px', color: '#d4af37', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const nextBtn = this.add.text(width / 2, height / 2 + 60, '[ Continue to Chapter 2 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });

    nextBtn.on('pointerdown', () => {
      this.scene.start('Chapter2Scene');
    });
  }

  update() {
    if (!this.player.body) return;

    const speed = this.keys.sprint.isDown ? this.playerSpeed * 1.6 : this.playerSpeed;
    let vx = 0, vy = 0;

    if (this.keys.left.isDown) vx = -1;
    else if (this.keys.right.isDown) vx = 1;

    if (this.keys.up.isDown) vy = -1;
    else if (this.keys.down.isDown) vy = 1;

    const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
    this.player.setVelocity(vec.x, vec.y);
  }
}
