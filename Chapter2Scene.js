// =====================================================
// Chapter2Scene - Vishwamitra: Protect Yagya, First Combat, Boss: Tataka
// =====================================================

class Chapter2Scene extends Phaser.Scene {
  constructor() {
    super('Chapter2Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    const worldW = 1400;
    const worldH = 800;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Ground (forest/ashram tint)
    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setTint(0x5a4a2a).setAlpha(0.9);
      }
    }

    this.add.text(width / 2, 20, 'Chapter 2: Vishwamitra — Protect the Yagya', {
      fontSize: '20px',
      color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Yagya altar (must be protected — has its own health)
    this.altar = this.physics.add.staticSprite(700, 400, 'npc').setTint(0xffaa00).setScale(1.4);
    this.add.text(700, 340, 'Yagya Kund', { fontSize: '14px', color: '#ffcc66' }).setOrigin(0.5);
    this.altarHealth = 100;

    // Vishwamitra (quest giver, stands near altar)
    this.add.image(620, 400, 'npc').setTint(0xffffff);
    this.add.text(620, 360, 'Vishwamitra', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);

    // Player
    this.player = this.physics.add.sprite(700, 600, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 220;
    this.playerHealth = 100;

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

    this.arrows = this.physics.add.group();
    this.input.on('pointerdown', (pointer) => this.shootArrow(pointer));

    // ---- WAVE OF DEMONS BEFORE BOSS ----
    this.demons = this.physics.add.group();
    this.wave = 0;
    this.maxWaves = 2;
    this.demonsPerWave = 3;
    this.bossSpawned = false;
    this.phase = 'intro'; // intro -> waves -> boss -> complete

    this.hud = this.add.text(16, 16, '', {
      fontSize: '14px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);

    this.add.text(width / 2, height - 20,
      'WASD: Move | Shift: Sprint | Click: Shoot Arrow',
      { fontSize: '14px', color: '#aaaaaa' }
    ).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    // Collisions
    this.physics.add.overlap(this.arrows, this.demons, (arrow, demon) => this.hitDemon(arrow, demon));
    this.physics.add.overlap(this.demons, this.altar, (demon) => this.demonHitsAltar(demon));
    this.physics.add.overlap(this.player, this.demons, (player, demon) => this.demonHitsPlayer(demon));

    this.showDialogue(
      'Vishwamitra: "Rakshasas hamare yagya ko bhrasht karne aayenge.\nUnhe roko, aur Tataka se savdhan rehna."',
      () => this.startWaves()
    );
  }

  showDialogue(text, onDone) {
    const { width, height } = this.cameras.main;
    const box = this.add.rectangle(width / 2, height - 80, width - 60, 90, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(80);
    const t = this.add.text(width / 2, height - 80, text, {
      fontSize: '15px', color: '#ffffff', align: 'center', wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);

    this.time.delayedCall(3200, () => {
      box.destroy();
      t.destroy();
      if (onDone) onDone();
    });
  }

  startWaves() {
    this.phase = 'waves';
    this.spawnWave();
  }

  spawnWave() {
    this.wave++;
    for (let i = 0; i < this.demonsPerWave; i++) {
      const edge = Phaser.Math.Between(0, 3);
      let x, y;
      if (edge === 0) { x = 0; y = Phaser.Math.Between(0, 800); }
      else if (edge === 1) { x = 1400; y = Phaser.Math.Between(0, 800); }
      else if (edge === 2) { x = Phaser.Math.Between(0, 1400); y = 0; }
      else { x = Phaser.Math.Between(0, 1400); y = 800; }

      const demon = this.demons.create(x, y, 'npc').setTint(0x882222);
      demon.health = 30;
      demon.speed = 80;
      demon.setCircle(16);
    }
  }

  hitDemon(arrow, demon) {
    arrow.destroy();
    demon.health -= 20;
    this.flash(demon.x, demon.y - 30, '-20', '#ff6666');
    if (demon.health <= 0) {
      demon.destroy();
      this.checkWaveClear();
    }
  }

  checkWaveClear() {
    if (this.demons.countActive(true) > 0) return;

    if (this.phase === 'waves') {
      if (this.wave < this.maxWaves) {
        this.showDialogue(`Wave ${this.wave} cleared! Agli wave aa rahi hai...`, () => this.spawnWave());
      } else {
        this.showDialogue('Waves cleared! Ab Tataka aa rahi hai...', () => this.spawnBoss());
      }
    }
  }

  spawnBoss() {
    this.phase = 'boss';
    this.bossSpawned = true;

    this.boss = this.physics.add.sprite(700, 100, 'npc').setTint(0x550000).setScale(2.2);
    this.boss.health = 200;
    this.boss.maxHealth = 200;
    this.boss.speed = 60;
    this.boss.setCircle(24);

    this.bossLabel = this.add.text(700, 40, 'Tataka', {
      fontSize: '18px', color: '#ff4444'
    }).setOrigin(0.5);

    this.bossHealthBarBg = this.add.rectangle(this.cameras.main.width / 2, 60, 300, 16, 0x333333)
      .setScrollFactor(0).setDepth(60);
    this.bossHealthBar = this.add.rectangle(this.cameras.main.width / 2, 60, 300, 16, 0xaa2222)
      .setScrollFactor(0).setDepth(61);

    this.physics.add.overlap(this.arrows, this.boss, (arrow, boss) => this.hitBoss(arrow));
    this.physics.add.overlap(this.player, this.boss, () => this.demonHitsPlayer(this.boss, 15));
  }

  hitBoss(arrow) {
    arrow.destroy();
    this.boss.health -= 15;
    this.flash(this.boss.x, this.boss.y - 40, '-15', '#ffaa00');

    const pct = Phaser.Math.Clamp(this.boss.health / this.boss.maxHealth, 0, 1);
    this.bossHealthBar.width = 300 * pct;

    if (this.boss.health <= 0) {
      this.boss.destroy();
      this.bossLabel.destroy();
      this.bossHealthBar.destroy();
      this.bossHealthBarBg.destroy();
      this.completeChapter();
    }
  }

  demonHitsAltar(demon) {
    demon.destroy();
    this.altarHealth -= 15;
    this.flash(this.altar.x, this.altar.y - 40, 'Yagya damaged!', '#ff4444');
    if (this.altarHealth <= 0) {
      this.failChapter();
    }
  }

  demonHitsPlayer(demon, dmg = 5) {
    this.playerHealth -= dmg * (1 / 30); // small continuous chip while overlapping
    if (this.playerHealth <= 0) this.failChapter();
  }

  shootArrow(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const arrow = this.arrows.create(this.player.x, this.player.y, 'arrow');
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    arrow.setRotation(angle);
    arrow.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
    this.time.delayedCall(2000, () => { if (arrow.active) arrow.destroy(); });
  }

  flash(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '14px', color }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 25, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  completeChapter() {
    this.phase = 'complete';
    window.DHARMA_STATE.unlockedChapters.push(3);
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 20,
      'Tataka Defeated!\nYagya suraksha safal rahi. Vishwamitra ab tumhe\nMithila le jayenge, jahan Shiv Dhanush ki pariksha hai...',
      { fontSize: '18px', color: '#d4af37', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 70, '[ Continue to Chapter 3 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('Chapter3Scene'));
  }

  failChapter() {
    this.phase = 'complete';
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x330000, 0.8).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 10, 'Yagya bhrasht ho gaya...\nPhir se koshish karo.', {
      fontSize: '20px', color: '#ff6666', align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 60, '[ Retry Chapter 2 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.restart());
  }

  update() {
    if (!this.player.body || this.phase === 'complete') {
      if (this.player.body) this.player.setVelocity(0, 0);
      return;
    }

    const speed = this.keys.sprint.isDown ? this.playerSpeed * 1.6 : this.playerSpeed;
    let vx = 0, vy = 0;
    if (this.keys.left.isDown) vx = -1;
    else if (this.keys.right.isDown) vx = 1;
    if (this.keys.up.isDown) vy = -1;
    else if (this.keys.down.isDown) vy = 1;

    const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
    this.player.setVelocity(vec.x, vec.y);

    // Demons chase the altar (or player if closer)
    this.demons.getChildren().forEach((demon) => {
      if (!demon.active) return;
      const target = this.altar;
      const angle = Phaser.Math.Angle.Between(demon.x, demon.y, target.x, target.y);
      demon.setVelocity(Math.cos(angle) * demon.speed, Math.sin(angle) * demon.speed);
    });

    // Boss chases player
    if (this.boss && this.boss.active) {
      const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
      this.boss.setVelocity(Math.cos(angle) * this.boss.speed, Math.sin(angle) * this.boss.speed);
    }

    this.hud.setText(
      `Chapter 2: Vishwamitra\nPlayer HP: ${Math.max(0, Math.floor(this.playerHealth))}\n` +
      `Yagya HP: ${Math.max(0, this.altarHealth)}\n` +
      (this.phase === 'waves' ? `Wave: ${this.wave}/${this.maxWaves}` : this.phase === 'boss' ? 'BOSS: Tataka' : '')
    );
  }
}
