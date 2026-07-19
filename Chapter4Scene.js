// =====================================================
// Chapter4Scene - Vanvas: Open Forest, Crafting, Animals, Side Missions
// =====================================================

class Chapter4Scene extends Phaser.Scene {
  constructor() {
    super('Chapter4Scene');
  }

  create() {
    const { width, height } = this.cameras.main;

    const worldW = 2000;
    const worldH = 1400;
    this.physics.world.setBounds(0, 0, worldW, worldH);

    // Dense forest ground
    for (let x = 0; x < worldW; x += 64) {
      for (let y = 0; y < worldH; y += 64) {
        this.add.image(x + 32, y + 32, 'ground').setTint(0x2d4a1e).setAlpha(0.9);
      }
    }

    this.add.text(width / 2, 20, 'Chapter 4: Vanvas — Dandakaranya Forest', {
      fontSize: '20px', color: '#d4af37'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(50);

    // Player
    this.player = this.physics.add.sprite(1000, 700, 'player');
    this.player.setCollideWorldBounds(true);
    this.playerSpeed = 220;

    // Camera
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // --- Crafting resources scattered in the forest ---
    this.resources = this.physics.add.staticGroup();
    this.resourceTypes = ['Wood', 'Herbs', 'Stone'];
    this.resourceColors = { Wood: 0x8b5a2b, Herbs: 0x33aa55, Stone: 0x888888 };

    for (let i = 0; i < 18; i++) {
      const type = Phaser.Utils.Array.GetRandom(this.resourceTypes);
      const x = Phaser.Math.Between(100, worldW - 100);
      const y = Phaser.Math.Between(100, worldH - 100);
      const node = this.resources.create(x, y, 'npc').setTint(this.resourceColors[type]).setScale(0.5);
      node.resourceType = type;
    }

    // --- Animals (wildlife, roam passively; some are "side mission" targets) ---
    this.animals = this.physics.add.group();
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(100, worldW - 100);
      const y = Phaser.Math.Between(100, worldH - 100);
      const animal = this.animals.create(x, y, 'npc').setTint(0xcc8844).setScale(0.7);
      animal.roamTimer = 0;
      animal.roamDir = new Phaser.Math.Vector2(Phaser.Math.FloatBetween(-1, 1), Phaser.Math.FloatBetween(-1, 1)).normalize();
    }

    // --- Side mission NPC: a lost villager near the edge of the forest ---
    this.villager = this.physics.add.staticSprite(1700, 300, 'npc').setTint(0xffffff);
    this.add.text(1700, 260, 'Lost Villager', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5);
    this.villagerMissionActive = false;
    this.villagerMissionDone = false;

    // Exit point (path to Panchavati) — locked until side mission understood, but
    // for Phase 1 it's simply always available to keep progression from stalling.
    this.exitPoint = this.physics.add.staticSprite(100, 1300, 'npc').setTint(0x226644).setScale(1.3);
    this.add.text(100, 1260, 'Path to Panchavati', { fontSize: '12px', color: '#88ff88' }).setOrigin(0.5);

    // Input
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      sprint: Phaser.Input.Keyboard.KeyCodes.SHIFT
    });
    this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.craftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    // Inventory state (resources collected)
    this.craftInventory = { Wood: 0, Herbs: 0, Stone: 0 };
    window.DHARMA_STATE.inventory = window.DHARMA_STATE.inventory || [];

    // Overlap: collect resources
    this.physics.add.overlap(this.player, this.resources, (player, node) => this.collectResource(node));

    this.hud = this.add.text(16, 16, '', {
      fontSize: '13px', color: '#ffffff',
      backgroundColor: '#00000088', padding: { x: 8, y: 6 }
    }).setScrollFactor(0).setDepth(50);

    this.add.text(width / 2, height - 20,
      'WASD: Move | Shift: Sprint | Walk into resources to collect | C: Craft | E: Interact',
      { fontSize: '13px', color: '#aaaaaa' }
    ).setOrigin(0.5, 1).setScrollFactor(0).setDepth(50);

    this.craftKey.on('down', () => this.tryCraft());

    this.showDialogue(
      'Vanvas shuru hua. Yahan lakdi, jadi-booti aur patthar jama karo,\naur crafting station (C) se upyogi cheezein banao. Kuch\ngram-vasi bhi madad ke liye rah rahe hain.'
    );
  }

  showDialogue(text) {
    const { width, height } = this.cameras.main;
    const box = this.add.rectangle(width / 2, height - 90, width - 60, 100, 0x000000, 0.75)
      .setScrollFactor(0).setDepth(80);
    const t = this.add.text(width / 2, height - 90, text, {
      fontSize: '15px', color: '#ffffff', align: 'center', wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(81);
    this.time.delayedCall(3800, () => { box.destroy(); t.destroy(); });
  }

  collectResource(node) {
    if (!node.active) return;
    const type = node.resourceType;
    this.craftInventory[type]++;
    this.flash(node.x, node.y - 20, `+1 ${type}`, '#ffff88');
    node.destroy();
  }

  tryCraft() {
    // Simple recipe: 3 Wood + 2 Herbs + 1 Stone -> "Forest Survival Kit"
    const need = { Wood: 3, Herbs: 2, Stone: 1 };
    const has = this.craftInventory;

    const canCraft = Object.keys(need).every(k => has[k] >= need[k]);
    if (canCraft) {
      Object.keys(need).forEach(k => has[k] -= need[k]);
      window.DHARMA_STATE.inventory.push('Forest Survival Kit');
      this.flash(this.player.x, this.player.y - 40, 'Crafted: Forest Survival Kit!', '#00ff88');
    } else {
      this.flash(this.player.x, this.player.y - 40, 'Not enough resources (need 3 Wood, 2 Herbs, 1 Stone)', '#ff6666');
    }
  }

  flash(x, y, text, color) {
    const t = this.add.text(x, y, text, { fontSize: '13px', color }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: y - 25, alpha: 0, duration: 1000, onComplete: () => t.destroy() });
  }

  update(time, delta) {
    if (!this.player.body) return;

    const speed = this.keys.sprint.isDown ? this.playerSpeed * 1.6 : this.playerSpeed;
    let vx = 0, vy = 0;
    if (this.keys.left.isDown) vx = -1;
    else if (this.keys.right.isDown) vx = 1;
    if (this.keys.up.isDown) vy = -1;
    else if (this.keys.down.isDown) vy = 1;
    const vec = new Phaser.Math.Vector2(vx, vy).normalize().scale(speed);
    this.player.setVelocity(vec.x, vec.y);

    // Animals roam passively, changing direction occasionally
    this.animals.getChildren().forEach((animal) => {
      animal.roamTimer -= delta;
      if (animal.roamTimer <= 0) {
        animal.roamDir = new Phaser.Math.Vector2(
          Phaser.Math.FloatBetween(-1, 1), Phaser.Math.FloatBetween(-1, 1)
        ).normalize();
        animal.roamTimer = Phaser.Math.Between(1500, 3500);
      }
      animal.setVelocity(animal.roamDir.x * 40, animal.roamDir.y * 40);
    });

    // Side mission interact
    const distVillager = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.villager.x, this.villager.y);
    if (distVillager < 80 && Phaser.Input.Keyboard.JustDown(this.interactKey) && !this.villagerMissionDone) {
      if (!this.villagerMissionActive) {
        this.villagerMissionActive = true;
        this.showDialogue('Gram-vasi: "Mujhe 2 Herbs chahiye, jungle ke jaanwaron se\nbachne ke liye dawai banani hai. Kya tum de sakte ho? (E se do)"');
      } else if (this.craftInventory.Herbs >= 2) {
        this.craftInventory.Herbs -= 2;
        this.villagerMissionDone = true;
        window.DHARMA_STATE.inventory.push('Villager Blessing (+Luck)');
        this.showDialogue('Gram-vasi: "Dhanyavaad! Yeh lo, mera aashirwad tumhare saath rahega."');
      } else {
        this.showDialogue('Gram-vasi: "Abhi tumhare paas 2 Herbs nahi hain."');
      }
    }

    // Exit to next chapter
    const distExit = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.exitPoint.x, this.exitPoint.y);
    if (distExit < 80 && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      this.completeChapter();
    }

    this.hud.setText(
      `Chapter 4: Vanvas\nWood: ${this.craftInventory.Wood}  Herbs: ${this.craftInventory.Herbs}  Stone: ${this.craftInventory.Stone}\n` +
      `Side mission: ${this.villagerMissionDone ? 'Complete' : this.villagerMissionActive ? 'In progress' : 'Not started'}\n` +
      `Reach the green marker (bottom-left) & press E to continue`
    );
  }

  completeChapter() {
    window.DHARMA_STATE.unlockedChapters.push(5);
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setScrollFactor(0).setDepth(90);
    this.add.text(width / 2, height / 2 - 20,
      'Vanvas Complete!\n\nAage Panchavati hai, jahan ek naya adhyay shuru\nhoga...',
      { fontSize: '18px', color: '#d4af37', align: 'center' }
    ).setOrigin(0.5).setScrollFactor(0).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 60, '[ Continue to Chapter 5 ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('Chapter5Scene'));

    this.scene.pause();
  }
}
