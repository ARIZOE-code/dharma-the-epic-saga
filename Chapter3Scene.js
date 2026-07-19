// =====================================================
// Chapter3Scene - Mithila: Shiv Dhanush, Kings Competition, Divine Bow
// =====================================================

class Chapter3Scene extends Phaser.Scene {
  constructor() {
    super('Chapter3Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    const worldW = 1400;
    const worldH = 800;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Palace courtyard ground (stone tint)
    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setTint(0x888899).setAlpha(0.9);
      }
    }

    this.add.text(width / 2, 20, 'Chapter 3: Mithila — Shiv Dhanush', {
      fontSize: '20px', color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Player
    this.player = this.physics.add.sprite(700, 650, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 220;

    // The Shiv Dhanush (bow) placed on a pedestal in the center
    this.dhanush = this.physics.add.staticSprite(700, 350, 'npc').setTint(0x888800).setScale(1.6);
    this.add.text(700, 300, 'Shiv Dhanush', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    // Rival kings watching (decorative NPCs around the hall)
    const kingPositions = [[400, 500], [1000, 500], [400, 250], [1000, 250]];
    kingPositions.forEach(([x, y], i) => {
      this.add.image(x, y, 'npc').setTint(0x444488);
      this.add.text(x, y - 40, `Raja ${i + 1}`, { fontSize: '12px', color: '#aaaaff' }).setOrigin(0.5);
    });

    // Janak Raja (quest giver)
    this.add.image(700, 480, 'npc').setTint(0xdddddd);
    this.add.text(700, 440, 'Raja Janak', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

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
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    this.hud = this.add.text(16, 16, 'Chapter 3: Mithila\nWalk to the Shiv Dhanush and press E', {
      fontSize: '14px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);

    this.add.text(width / 2, height - 20,
      'WASD: Move | Shift: Sprint | E: Interact',
      { fontSize: '14px', color: '#aaaaaa' }
    ).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    this.stage = 'approach'; // approach -> minigame -> complete
    this.minigameActive = false;

    this.showDialogue(
      'Raja Janak: "Jo bhi is Shiv Dhanush ko utha ke pratyancha\nchadhayega, uska vivah Sita se hoga. Bahut se rajaon ne\nkoshish ki hai... aur asafal rahe."'
    );
  }

  showDialogue(text) {
    const { width, height } = this.cameras.main;
    const box = this.add.rectangle(width / 2, height - 80, width - 60, 90, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(80);
    const t = this.add.text(width / 2, height - 80, text, {
      fontSize: '15px', color: '#ffffff', align: 'center', wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.time.delayedCall(3400, () => { box.destroy(); t.destroy(); });
  }

  startMinigame() {
    this.minigameActive = true;
    this.stage = 'minigame';
    const { width, height } = this.cameras.main;

    // Simple timing minigame: a marker sweeps left-right across a bar,
    // player must press SPACE when marker is inside the gold "sweet spot".
    this.minigameOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6)
      .setScrollFactor(0).setDepth(90);

    this.minigameLabel = this.add.text(width / 2, height / 2 - 90,
      'Pratyancha Chadhao!\nSPACE dabao jab marker sweet spot me ho', {
      fontSize: '18px', color: '#d4af37', align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const barX = width / 2 - 200;
    const barY = height / 2;
    const barW = 400;

    this.minigameBarBg = this.add.rectangle(width / 2, barY, barW, 24, 0x333333)
      .setScrollFactor(0).setDepth(91);

    const sweetSpotW = 60;
    const sweetSpotX = width / 2 + Phaser.Math.Between(-140, 140);
    this.minigameSweetSpot = this.add.rectangle(sweetSpotX, barY, sweetSpotW, 24, 0xd4af37)
      .setScrollFactor(0).setDepth(92);

    this.minigameMarker = this.add.rectangle(barX, barY, 8, 34, 0xffffff)
      .setScrollFactor(0).setDepth(93);

    this.minigameDir = 1;
    this.minigameSpeed = 260;
    this.minigameBarX = barX;
    this.minigameBarW = barW;

    this.minigameAttemptsLeft = 3;
    this.attemptsText = this.add.text(width / 2, height / 2 + 60,
      `Attempts left: ${this.minigameAttemptsLeft}`, { fontSize: '14px', color: '#ffffff' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const spaceHandler = () => this.checkMinigameHit();
    this.input.keyboard.on('keydown-SPACE', spaceHandler);
    this._minigameSpaceHandler = spaceHandler;
  }

  checkMinigameHit() {
    if (!this.minigameActive) return;
    const markerX = this.minigameMarker.x;
    const spot = this.minigameSweetSpot;
    const hit = Math.abs(markerX - spot.x) <= spot.width / 2;

    if (hit) {
      this.endMinigame(true);
    } else {
      this.minigameAttemptsLeft--;
      this.attemptsText.setText(`Attempts left: ${this.minigameAttemptsLeft}`);
      if (this.minigameAttemptsLeft <= 0) {
        this.endMinigame(false);
      }
    }
  }

  endMinigame(success) {
    this.minigameActive = false;
    this.input.keyboard.off('keydown-SPACE', this._minigameSpaceHandler);

    [this.minigameOverlay, this.minigameLabel, this.minigameBarBg,
     this.minigameSweetSpot, this.minigameMarker, this.attemptsText].forEach(o => o.destroy());

    if (success) {
      this.completeChapter();
    } else {
      this.showDialogue('Pratyancha nahi chad payi... Raja Janak: "Phir se koshish karo."');
      this.stage = 'approach';
    }
  }

  completeChapter() {
    this.stage = 'complete';
    window.DHARMA_STATE.unlockedChapters.push(4);
    window.DHARMA_STATE.inventory.push('Divine Bow (Kodanda)');

    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 30,
      'Shiv Dhanush Toota!\n\nAchievement Unlocked: "Shiv Dhanush Broken"\nReward: Divine Bow (Kodanda) obtained\n\nSita se vivah tay hua. Ab Vanvas ki taiyari...',
      { fontSize: '18px', color: '#d4af37', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 110, '[ Continue to Chapter 4 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('Chapter4Scene'));
  }

  update(time, delta) {
    if (this.stage === 'complete') {
      if (this.player.body) this.player.setVelocity(0, 0);
      return;
    }

    if (this.minigameActive) {
      // Sweep marker
      this.minigameMarker.x += this.minigameDir * this.minigameSpeed * (delta / 1000);
      if (this.minigameMarker.x >= this.minigameBarX + this.minigameBarW) {
        this.minigameMarker.x = this.minigameBarX + this.minigameBarW;
        this.minigameDir = -1;
      } else if (this.minigameMarker.x <= this.minigameBarX) {
        this.minigameMarker.x = this.minigameBarX;
        this.minigameDir = 1;
      }
      if (this.player.body) this.player.setVelocity(0, 0);
      return;
    }

    // Normal movement
    const speed = this.keys.sprint.isDown ? this.playerSpeed * 1.6 : this.playerSpeed;
    let vx = 0, vy = 0;
    if (this.keys.left.isDown) vx = -1;
    else if (this.keys.right.isDown) vx = 1;
    if (this.keys.up.isDown) vy = -1;
    else if (this.keys.down.isDown) vy = 1;
    const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
    this.player.setVelocity(vec.x, vec.y);

    // Interact prompt near dhanush
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.dhanush.x, this.dhanush.y);
    if (dist < 80 && Phaser.Input.Keyboard.JustDown(this.interactKey) && this.stage === 'approach') {
      this.startMinigame();
    }
  }
}
