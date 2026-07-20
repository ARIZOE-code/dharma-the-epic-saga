// =====================================================
// Chapter7Scene - Lakshman Rekha (Interactive Story)
// =====================================================

class Chapter7Scene extends Phaser.Scene {
  constructor() {
    super('Chapter7Scene');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a2a1a');

    this.add.text(width / 2, 20, 'Chapter 7: Lakshman Rekha', {
      fontSize: '20px', color: '#d4af37'
    }).setOrigin(0.5, 0).setDepth(50);

    // Simple static tableau: hut, Sita, the drawn line, Lakshman leaving
    this.add.image(width / 2, height / 2 + 40, 'npc').setTint(0x996633).setScale(2).setAlpha(0.5);
    this.sitaSprite = this.add.image(width / 2 - 30, height / 2 + 20, 'npc').setTint(0xffffff).setScale(0.9);
    this.add.text(width / 2 - 30, height / 2 - 20, 'Sita', { fontSize: '13px', color: '#ffffff' }).setOrigin(0.5);

    // The Rekha (line) drawn on ground
    this.rekhaLine = this.add.rectangle(width / 2, height / 2 + 90, 260, 6, 0xd4af37);

    this.beatIndex = 0;
    this.beats = [
      {
        text: 'Sita ki cheekh sunkar Lakshman turant kutiya ki\nore bhaage. Jaane se pehle unhone kutiya ke chaaron\nor ek rekha kheenchi.',
        choice: null
      },
      {
        text: 'Lakshman: "Mata, is rekha ko kabhi mat paar\nkijiyega, chahe kuch bhi ho jaaye. Yeh aapki raksha\nkaregi."',
        choice: null
      },
      {
        text: 'Kuch der baad, ek sadhu bhikshu (chhadmveshi Ravan)\nkutiya ke dwaar par aaya, bhiksha maangte hue...',
        choice: null
      }
    ];

    this.dialogueBox = this.add.rectangle(width / 2, height - 90, width - 60, 110, 0x000000, 0.75).setDepth(80);
    this.dialogueText = this.add.text(width / 2, height - 90, '', {
      fontSize: '15px', color: '#ffffff', align: 'center', wordWrap: { width: width - 100 }
    }).setOrigin(0.5).setDepth(81);

    this.continuePrompt = this.add.text(width / 2, height - 30, 'Click to continue', {
      fontSize: '13px', color: '#888888'
    }).setOrigin(0.5).setDepth(81);

    this.input.on('pointerdown', () => this.advance());

    this.playBeat();
  }

  playBeat() {
    if (this.beatIndex >= this.beats.length) {
      this.showChoice();
      return;
    }
    this.dialogueText.setText(this.beats[this.beatIndex].text);
    this.continuePrompt.setVisible(true);
  }

  advance() {
    if (this.choiceActive) return;
    this.beatIndex++;
    this.playBeat();
  }

  showChoice() {
    this.continuePrompt.setVisible(false);
    this.dialogueText.setText('Sita ko bhiksha dene ke liye rekha paar karni hogi...\nAapka faisla kya hoga?');
    this.choiceActive = true;

    const { width, height } = this.cameras.main;
    const optA = this.add.text(width / 2 - 160, height - 30, '[ Dharma nibhao: bhiksha do ]', {
      fontSize: '14px', color: '#d4af37'
    }).setOrigin(0.5).setDepth(82).setInteractive({ useHandCursor: true });

    const optB = this.add.text(width / 2 + 160, height - 30, '[ Rekha ke andar raho ]', {
      fontSize: '14px', color: '#aaaaaa'
    }).setOrigin(0.5).setDepth(82).setInteractive({ useHandCursor: true });

    // Narratively the story requires the traditional outcome to continue,
    // but the player's choice is acknowledged before the scripted event occurs.
    optA.on('pointerdown', () => this.resolveChoice(optA, optB, 'Sita ne apni daya-bhavna ke karan\nrekha paar ki...'));
    optB.on('pointerdown', () => this.resolveChoice(optA, optB, 'Sita hichkichayi, lekin sadhu ke\nbaar-baar bhiksha maangne par\naakhir rekha paar karni padi...'));
  }

  resolveChoice(optA, optB, resultText) {
    optA.destroy();
    optB.destroy();
    this.choiceActive = false;
    this.dialogueText.setText(resultText);

    this.time.delayedCall(2800, () => {
      this.tweens.add({
        targets: this.sitaSprite,
        x: this.sitaSprite.x + 60,
        duration: 800,
        onComplete: () => {
          this.dialogueText.setText('Jaise hi Sita ne rekha paar ki, Ravan ne apna asli\nroop dikhaya aur use bal-purvak le gaya...');
          this.time.delayedCall(3200, () => this.completeChapter());
        }
      });
    });
  }

  completeChapter() {
    window.DHARMA_STATE.unlockedChapters.push(8);
    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8).setDepth(90);
    this.add.text(width / 2, height / 2 - 10, 'Sita Haran ho gaya...\n\nAage kya hua?', {
      fontSize: '20px', color: '#d4af37', align: 'center'
    }).setOrigin(0.5).setDepth(91);

    const btn = this.add.text(width / 2, height / 2 + 60, '[ Return to Main Menu ]', {
      fontSize: '18px', color: '#ffffff'
    }).setOrigin(0.5).setDepth(91).setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => this.scene.start('MainMenuScene'));
  }
}
