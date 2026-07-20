// =====================================================
// Chapter6Scene - Golden Deer Chase (Maricha in disguise)
// =====================================================

class Chapter6Scene extends Phaser.Scene {
  constructor() {
    super('Chapter6Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    const worldW = 1800;
    const worldH = 1000;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setTint(0x33552a).setAlpha(0.9);
      }
    }

    this.add.text(width / 2, 20, 'Chapter 6: The Golden Deer', {
      fontSize: '20px', color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Player
    this.player = this.physics.add.sprite(300, 500, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 240;

    // Golden Deer (Maricha in disguise) — flees from player, weaves toward the world edge
    this.deer = this.physics.add.sprite(500, 500, 'npc').setTint(0xffd700).setScale(0.9);
    this.deer.setCollideWorldBounds(true);
    this.deer.speed = 190;
    this.deer.setCircle(16);

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
    this.input.on('pointerdown', (pointer) => this.shootArrow(pointer));

    this.physics.add.overlap(this.arrows, this.deer, (arrow) => this.hitDeer(arrow));

    this.hud = this.add.text(16, 16, '', {
      fontSize: '14px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);

    this.add.text(width / 2, height - 20, 'WASD: Move | Shift: Sprint | Click: Shoot Arrow', {
      fontSize: '14px', color: '#aaaaaa'
    }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    this.chaseTimer = 0;
    this.chaseDuration = 35000; // 35s chase before deer reaches "deep forest" and chapter auto-advances
    this.hits = 0;
    this.hitsNeeded = 1; // one clean hit ends the chase (Ram shoots the deer)
    this.phase = 'chase';

    this.deer.dir = new Phaser.Math.Vector2(1, 0);
    this.deer.dirTimer = 0;

    this.showDialogue('Ek anokha sunehra hiran dikha! Sita ne use pakadne ki\nzid ki. Ram uska peecha karne nikle...');
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

  shootArrow(pointer) {
    if (this.phase !== 'chase') return;
    const worldPoint = pointer.positionToCamera(this.cameras.main);
    const arrow = this.arrows.create(this.player.x, this.player.y, 'arrow');
    const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
    arrow.setRotation(angle);
    arrow.setVelocity(Math.cos(angle) * 550, Math.sin(angle) * 550);
    this.time.delayedCall(1500, () => { if (arrow.active) arrow.destroy(); });
  }

  hitDeer(arrow) {
    arrow.destroy();
    if (this.phase !== 'chase') return;
    this.hits++;
    this.flash(this.deer.x, this.deer.y - 30, 'Hit!', '#ff6666');
    if (this.hits >= this.hitsNeeded) {
      this.completeChapter();
    }
  }

  flash(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '14px', color }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 25, alpha: 0, duration: 700, onComplete: () => t.destroy() });
  }

  completeChapter() {
    this.phase = 'complete';
    window.DHARMA_STATE.unlockedChapters.push(7);
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 20,
      'Hiran giraa... aur ek maaya-cheekh gunji: "Hey Sita! Hey Lakshman!"\n\nRam ko shanka hui — yeh Maricha ka chhal tha.\nUnhone Lakshman ko yaad kiya aur turant kutiya ki\nore daud pade...',
      { fontSize: '17px', color: '#d4af37', align: 'center', wordWrap: { width: width - 120 } }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 110, '[ Continue to Chapter 7 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('Chapter7Scene'));
  }

  update(time, delta) {
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

    // Deer flees: runs away from player, occasionally darts in a new direction
    this.deer.dirTimer -= delta;
    const distToPlayer = Phaser.Math.Distance.Between(this.deer.x, this.deer.y, this.player.x, this.player.y);

    if (this.deer.dirTimer <= 0 || distToPlayer < 220) {
      const awayAngle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.deer.x, this.deer.y);
      const jitter = Phaser.Math.FloatBetween(-0.6, 0.6);
      this.deer.dir = new Phaser.Math.Vector2(Math.cos(awayAngle + jitter), Math.sin(awayAngle + jitter));
      this.deer.dirTimer = Phaser.Math.Between(700, 1400);
    }
    this.deer.setVelocity(this.deer.dir.x * this.deer.speed, this.deer.dir.y * this.deer.speed);

    this.hud.setText(`Chapter 6: Golden Deer\nGet close and shoot the deer!`);
  }
}
