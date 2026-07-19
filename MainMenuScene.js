// =====================================================
// MainMenuScene
// =====================================================

class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#0a0e27');

    this.add.text(width / 2, 90, 'DHARMA', {
      fontSize: '56px',
      color: '#d4af37',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 140, 'The Epic Saga', {
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const menuItems = [
      { label: 'Story Mode', action: () => this.scene.start('Chapter1Scene') },
      { label: 'Continue', action: () => this.scene.start('Chapter1Scene') },
      { label: 'Chapters', action: () => this.showComingSoon('Chapters menu') },
      { label: 'Collection', action: () => this.showComingSoon('Collection') },
      { label: 'Settings', action: () => this.showComingSoon('Settings') },
      { label: 'Credits', action: () => this.showComingSoon('Credits') }
    ];

    const startY = 220;
    const spacing = 42;

    menuItems.forEach((item, i) => {
      const btn = this.add.text(width / 2, startY + i * spacing, item.label, {
        fontSize: '24px',
        color: '#ffffff'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => btn.setColor('#d4af37'));
      btn.on('pointerout', () => btn.setColor('#ffffff'));
      btn.on('pointerdown', item.action);
    });

    this.infoText = this.add.text(width / 2, height - 30, '', {
      fontSize: '16px',
      color: '#888888'
    }).setOrigin(0.5);
  }

  showComingSoon(label) {
    this.infoText.setText(`${label} — Coming Soon`);
    this.time.delayedCall(1500, () => this.infoText.setText(''));
  }
}
