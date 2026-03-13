import BaseScene from './BaseScene';

class MenuScene extends BaseScene {
  constructor(config) {
    super('MenuScene', config);

    this.menu = [
      { action: 'start', scene: 'PlayScene', text: 'Play' },
      { action: 'start', scene: 'ScoreScene', text: 'Score' },
      { action: 'exit', text: 'Exit' },
    ];

    this.defaultStyle = { fill: '#CD00FF' };
    this.hoverStyle = { fill: 'hotpink' };
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents);
  }

  setupMenuEvents = menuItem => {
    const { textGO, action, scene } = menuItem;

    textGO
      .setInteractive()
      .on('pointerover', () => textGO.setStyle(this.hoverStyle))
      .on('pointerout', () => textGO.setStyle(this.defaultStyle))
      .on('pointerup', () => this.handleMenuAction(action, scene));
  };

  handleMenuAction(action, scene) {
    switch (action) {
      case 'start':
        this.scene.start(scene);
        break;

      case 'exit':
        // this.game.destroy(true);
        window.history.back();
        break;
    }
  }
}

export default MenuScene;
