import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#CD00FF', fontWeight: '900' };
    this.screenCenter = [this.config.width / 2, this.config.height / 2];
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0);
    this.createBackButton();
  }

  createBackButton() {
    if (!this.config.canGoBack) {
      return;
    }

    const backButton = this.add
      .image(this.config.width - 10, this.config.height - 10, 'back')
      .setScale(2)
      .setDepth(1)
      .setOrigin(1)
      .setInteractive();

    backButton.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }

  createMenu(menu, setupMenuEvents) {
    const container = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);

    const menuHeight = menu.length * this.lineHeight;
    const startY = (menuHeight - this.lineHeight) / -2;

    menu.forEach((menuItem, index) => {
      menuItem.textGO = this.add
        .text(0, startY + index * this.lineHeight, menuItem.text, this.fontOptions)
        .setOrigin(0.5);
      setupMenuEvents(menuItem);

      container.add(menuItem.textGO);
    });
  }
}

export default BaseScene;
