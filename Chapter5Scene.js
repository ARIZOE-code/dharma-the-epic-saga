// =====================================================
// Chapter5Scene - Panchavati: Surpanakha, Boss: Khara
// =====================================================

class Chapter5Scene extends Phaser.Scene {
  constructor() {
    super('Chapter5Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    const worldW = 1400;
    const worldH = 800;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setTint(0x2d4a1e).setAlpha(0.9);
      }
    }

    this.add.text(width / 2, 20, 'Chapter 5: Panchavati', {
      fontSize: '20px', color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Hut (Ram, Sita, Lakshman's dwelling)
    this.add.image(300, 400, 'npc').setTint(0x996633).setScale(1.5);
    this.add.text(300, 350, 'Kutiya (Hut)', { fontSize: '13px', color: '#ffffff' }).setOrigin(0.5);

    // Player (as Lakshman for this story beat, per the traditional narrative)
    this.player = this.physics.add.sprite(400, 450, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 220;

    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });

    this.arrows = this.physics.add.group();
    this.input.on('pointerdown', (pointer) => { if (this.phase === 'combat') this.shootArrow(pointer); });

    this.hud = this.add.text(16, 16, '', {
      fontSize: '14px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);

    this.add.text(width / 2, height - 20, 'WASD: Move | Shift: Sprint | Click: Shoot Arrow (during combat)', {
      fontSize: '14px', color: '#aaaaaa'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    this.phase = 'story';
    this.bossSpawned = false;

    // Cinematic story sequence — kept as narrative summary, not graphic depiction.
    this.storyBeats = [
      'Panchavati me Ram, Sita aur Lakshman shanti se rah rahe the.',
      'Surpanakha wahan aayi aur Ram se vivah ka prastaav rakha.\nRam ne vinamrata se mana kar diya.',
      'Krodhit hoke usne Sita par aakraman karne ki koshish ki.\nLakshman ne use rok diya aur use wapas bheja.',
      'Apmaanit Surpanakha apne bhai Khara ke paas gayi aur\nsena leke aa gayi, badla lene...'
    ];
    this.beatIndex = 0;
    this.playStoryBeat();
  }

  playStoryBeat() {
    if (this.beatIndex >= this.storyBeats.length) {
      this.startCombat();
      return;
    }
    this.showDialogue(this.storyBeats[this.beatIndex], () => {
      this.beatIndex++;
      this.playStoryBeat();
    });
  }

  showDialogue(text, onDone) {
    const { width, height } = this.cameras.main;
    const box = this.add.rectangle(width / 2, height - 80, width - 60, 90, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(80);
    const t = this.add.text(width / 2, height - 80, text, {
      fontSize: '15px', color: '#ffffff', align: 'center', wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.time.delayedCall(3600, () => { box.destroy(); t.destroy(); if (onDone) onDone(); });
  }

  startCombat() {
    this.phase = 'combat';
    this.spawnBoss();
  }

  spawnBoss() {
    this.bossSpawned = true;
    this.boss = this.physics.add.sprite(1100, 400, 'npc').setTint(0x662200).setScale(2.4);
    this.boss.health = 250;
    this.boss.maxHealth = 250;
    this.boss.speed = 70;
    this.boss.setCircle(26);

    this.bossLabel = this.add.text(1100, 330, 'Khara', { fontSize: '18px', color: '#ff4444' }).setOrigin(0.5);

    this.bossHealthBarBg = this.add.rectangle(this.cameras.main.width / 2, 60, 300, 16, 0x333333)
      .setScrollFactor(0).setDepth(60);
    this.bossHealthBar = this.add.rectangle(this.cameras.main.width / 2, 60, 300, 16, 0xaa2222)
      .setScrollFactor(0).setDepth(61);

    this.physics.add.overlap(this.arrows, this.boss, (arrow) => this.hitBoss(arrow));
    this.physics.add.overlap(this.player, this.boss, () => this.bossHitsPlayer());

    this.playerHealth = 100;
  }

  shootArrow(pointer) {
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const arrow = this.arrows.create(this.player.x, this.player.y, 'arrow');
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    arrow.setRotation(angle);
    arrow.setVelocity(Math.cos(angle) * 500, Math.sin(angle) * 500);
    this.time.delayedCall(2000, () => { if (arrow.active) arrow.destroy(); });
  }

  hitBoss(arrow) {
    arrow.destroy();
    this.boss.health -= 12;
    this.flash(this.boss.x, this.boss.y - 45, '-12', '#ffaa00');
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

  bossHitsPlayer() {
    this.playerHealth -= 0.4;
    if (this.playerHealth <= 0) this.failChapter();
  }

  flash(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '14px', color }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 25, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  completeChapter() {
    this.phase = 'complete';
    window.DHARMA_STATE.unlockedChapters.push(6);
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 20,
      'Khara Parajit!\n\nPanchavati surakshit hui. Lekin ye sirf shuruaat thi —\nRavan ko iski khabar mil chuki hai...',
      { fontSize: '18px', color: '#d4af37', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 70, '[ Return to Main Menu ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('MainMenuScene'));
  }

  failChapter() {
    this.phase = 'complete';
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x330000, 0.8).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 10, 'Khara ne tumhe parajit kar diya...\nPhir se koshish karo.', {
      fontSize: '20px', color: '#ff6666', align: 'center'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 60, '[ Retry Chapter 5 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.restart());
  }

  update() {
    if (!this.player.body || this.phase === 'complete') {
      if (this.player.body) this.player.setVelocity(0, 0);
      return;
    }

    if (this.phase === 'story') {
      this.player.setVelocity(0, 0);
    } else {
      const speed = this.keys.sprint.isDown ? this.playerSpeed * 1.6 : this.playerSpeed;
      let vx = 0, vy = 0;
      if (this.keys.left.isDown) vx = -1;
      else if (this.keys.right.isDown) vx = 1;
      if (this.keys.up.isDown) vy = -1;
      else if (this.keys.down.isDown) vy = 1;
      const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
      this.player.setVelocity(vec.x, vec.y);
    }

    if (this.boss && this.boss.active) {
      const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y);
      this.boss.setVelocity(Math.cos(angle) * this.boss.speed, Math.sin(angle) * this.boss.speed);
    }

    this.hud.setText(
      `Chapter 5: Panchavati\n` +
      (this.phase === 'combat' ? `Player HP: ${Math.max(0, Math.floor(this.playerHealth))}\nBOSS: Khara` : 'Cinematic...')
    );
  }
}
