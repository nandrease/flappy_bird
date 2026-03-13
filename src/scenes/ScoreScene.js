import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', {...config, canGoBack: true});
  }

  create() {
    super.create();

    const bestScore = localStorage.getItem('bestScore');
    this.add
      .text(this.cameras.main.centerX, this.cameras.main.centerY, `Best Score: ${bestScore}`, this.fontOptions)
      .setOrigin(0.5, 0.5);
  }
}

export default ScoreScene;
