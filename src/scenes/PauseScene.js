import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      { action: 'resume', scene: 'PlayScene', text: 'Continue' },
      { action: 'exit', scene: 'MenuScene', text: 'Main Menu' },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents);
  }

  setupMenuEvents = menuItem => {
    const { textGO, action, scene } = menuItem;

    textGO
      .setInteractive()
      .on('pointerover', () => textGO.setStyle({ fill: '#ff0' }))
      .on('pointerout', () => textGO.setStyle({ fill: '#fff' }))
      .on('pointerup', () => this.handleMenuAction(action, scene));
  };

  handleMenuAction(action, scene) {
    switch (action) {
      case 'resume':
        this.scene.stop();
        this.scene.resume(scene);
        break;

      case 'exit':
        this.scene.stop('PlayScene');
        this.scene.start(scene);
        break;
    }
  }
}

export default PauseScene;
