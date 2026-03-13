import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {
  constructor(config) {
    super('ScoreScene', { ...config, canGoBack: true });
  }

  create() {
    super.create();

    const { centerX, centerY } = this.cameras.main;
    const bestScore = Number(localStorage.getItem('bestScore')) || 0;

    this.add.text(centerX, centerY, `Best Score: ${bestScore}`, this.fontOptions).setOrigin(0.5);
  }
}

export default ScoreScene;
