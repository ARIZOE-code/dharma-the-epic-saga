// =====================================================
// IntroScene - Logo -> Conch cue -> Cinematic -> Disclaimer -> Skip
// =====================================================

class IntroScene extends Phaser.Scene {
  constructor() {
    super('IntroScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#0a0e27');

    // Skip button (always visible top-right)
    const skipBtn = this.add.text(width - 20, 20, 'Skip ▶', {
      fontSize: '16px',
      color: '#d4af37'
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true }).setDepth(100);

    skipBtn.on('pointerdown', () => this.goToMenu());

    // Sequence container
    this.sequenceIndex = 0;
    this.textObj = this.add.text(width / 2, height / 2, '', {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width - 120 }
    }).setOrigin(0.5);

    this.steps = [
      { text: 'STK CREATION', duration: 1500, color: '#d4af37', size: '36px' },
      { text: '🐚 (Conch Sound Cue)', duration: 1200, color: '#ffffff', size: '20px' },
      { text: 'DHARMA\nThe Epic Saga', duration: 2000, color: '#d4af37', size: '42px' },
      {
        text: 'Disclaimer: Yeh ek fictional, respectful reimagining hai jo\nRamayana ki kathaon se prerit hai. Kisi bhi dharmik bhavna ko\nthes pahunchane ka udeshya nahi hai.',
        duration: 3500,
        color: '#cccccc',
        size: '18px'
      }
    ];

    this.playStep();
  }

  playStep() {
    if (this.sequenceIndex >= this.steps.length) {
      this.goToMenu();
      return;
    }

    const step = this.steps[this.sequenceIndex];
    this.textObj.setText(step.text);
    this.textObj.setColor(step.color);
    this.textObj.setFontSize(step.size);
    this.textObj.setAlpha(0);

    this.tweens.add({
      targets: this.textObj,
      alpha: 1,
      duration: 400,
      onComplete: () => {
        this.time.delayedCall(step.duration, () => {
          this.tweens.add({
            targets: this.textObj,
            alpha: 0,
            duration: 400,
            onComplete: () => {
              this.sequenceIndex++;
              this.playStep();
            }
          });
        });
      }
    });
  }

  goToMenu() {
    this.tweens.killAll();
    this.scene.start('MainMenuScene');
  }
}
