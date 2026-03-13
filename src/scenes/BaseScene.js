import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);

    this.config = config;

    this.fontSize = 34;
    this.lineHeight = 42;

    this.fontOptions = {
      fontSize: `${this.fontSize}px`,
      fill: '#CD00FF',
      fontWeight: '900',
    };
  }

  create() {
    this.createBackground();
    this.createBackButton();
  }

  createBackground() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBackButton() {
    if (!this.config?.canGoBack) return;

    const { width, height } = this.config;

    this.add
      .image(width - 10, height - 10, 'back')
      .setOrigin(1)
      .setScale(2)
      .setDepth(1)
      .setInteractive()
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }

  createMenu(menu, setupMenuEvents) {
    const { centerX, centerY } = this.cameras.main;

    const container = this.add.container(centerX, centerY);

    const menuHeight = menu.length * this.lineHeight;
    const startY = -menuHeight / 2 + this.lineHeight / 2;

    menu.forEach((item, index) => {
      const textGO = this.add.text(0, startY + index * this.lineHeight, item.text, this.fontOptions).setOrigin(0.5);

      container.add(textGO);

      setupMenuEvents({
        ...item,
        textGO,
      });
    });

    return container;
  }
}

export default BaseScene;
