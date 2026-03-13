import BaseScene from './BaseScene';

const PIPES_TO_RENDER = 4;
const PIPE_SPEED = -200;

class PlayScene extends BaseScene {
  constructor(config) {
    super('PlayScene', config);

    this.bird = null;
    this.pipes = null;

    this.isPaused = false;
    this.flapVelocity = 300;

    this.score = 0;
    this.scoreText = null;

    this.currentDifficulty = 'easy';

    this.difficulties = {
      easy: {
        pipeHorizontalDistanceRange: [300, 400],
        pipeVerticalDistanceRange: [150, 250],
      },
      medium: {
        pipeHorizontalDistanceRange: [250, 350],
        pipeVerticalDistanceRange: [100, 200],
      },
      hard: {
        pipeHorizontalDistanceRange: [250, 300],
        pipeVerticalDistanceRange: [100, 150],
      },
    };
  }

  create() {
    super.create();

    this.createBird();
    this.createPipes();
    this.createColliders();
    this.createScore();
    this.createPause();
    this.handleInputs();
    this.listenToEvents();
  }

  update() {
    if (!this.isPaused) {
      this.checkGameStatus();
      this.recyclePipes();
    }
  }

  listenToEvents() {
    if (this.pauseEvent) return;

    this.pauseEvent = this.events.on('resume', () => {
      this.initialTime = 3;

      this.countDownText = this.add
        .text(...this.screenCenter, `Fly in: ${this.initialTime}`, this.fontOptions)
        .setOrigin(0.5);

      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.initialTime--;

    if (this.initialTime <= 0) {
      this.countDownText.destroy();
      this.isPaused = false;

      this.bird.anims.play('fly');
      this.physics.resume();

      this.timedEvent.remove();
      return;
    }

    this.countDownText.setText(`Fly in: ${this.initialTime}`);
  }

  createBG() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    const { startPosition } = this.config;

    this.bird = this.physics.add
      .sprite(startPosition.x, startPosition.y, 'bird')
      .setScale(3)
      .setFlipX(true)
      .setOrigin(0);

    this.bird.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
      frameRate: 16,
      repeat: -1,
    });

    this.bird.setBodySize(this.bird.width, this.bird.height - 8).setCollideWorldBounds(true);

    this.bird.body.gravity.y = 600;
    this.bird.play('fly');
  }

  createPipes() {
    this.pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
      const upper = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1).setImmovable(true);

      const lower = this.pipes.create(0, 0, 'pipe').setOrigin(0, 0).setImmovable(true);

      this.placePipe(upper, lower);
    }

    this.pipes.setVelocityX(PIPE_SPEED);
  }

  createColliders() {
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
  }

  createScore() {
    const bestScore = Number(localStorage.getItem('bestScore')) || 0;

    this.score = 0;

    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#000',
    });

    this.add.text(16, 52, `Best score: ${bestScore}`, {
      fontSize: '18px',
      fill: '#000',
    });
  }

  createPause() {
    const { width, height } = this.config;

    const pauseButton = this.add
      .image(width - 10, height - 10, 'pause')
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on('pointerdown', () => {
      this.isPaused = true;

      this.bird.anims.stop();
      this.physics.pause();

      this.scene.pause();
      this.scene.launch('PauseScene');
    });
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  flap() {
    if (this.isPaused) return;

    this.bird.setVelocityY(-this.flapVelocity);
  }

  checkGameStatus() {
    const { height } = this.config;

    if (this.bird.getBounds().bottom >= height || this.bird.y <= 0) {
      this.gameOver();
    }
  }

  placePipe(upper, lower) {
    const { pipeHorizontalDistanceRange, pipeVerticalDistanceRange } = this.difficulties[this.currentDifficulty];

    const rightMostX = this.getRightMostPipe();

    const verticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    const horizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

    const verticalPosition = Phaser.Math.Between(20, this.config.height - 20 - verticalDistance);

    upper.x = rightMostX + horizontalDistance;
    upper.y = verticalPosition;

    lower.x = upper.x;
    lower.y = upper.y + verticalDistance;
  }

  recyclePipes() {
    const pipes = this.pipes.getChildren();

    for (let i = 0; i < pipes.length; i += 2) {
      const upper = pipes[i];
      const lower = pipes[i + 1];

      if (upper.getBounds().right <= 0) {
        this.placePipe(upper, lower);
        this.increaseScore();
        this.saveBestScore();
        this.updateDifficulty();
      }
    }
  }

  updateDifficulty() {
    if (this.score > 6) {
      this.currentDifficulty = 'hard';
    } else if (this.score > 3) {
      this.currentDifficulty = 'medium';
    } else {
      this.currentDifficulty = 'easy';
    }
  }

  getRightMostPipe() {
    return Math.max(...this.pipes.getChildren().map(p => p.x));
  }

  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  saveBestScore() {
    const bestScore = Number(localStorage.getItem('bestScore')) || 0;

    if (this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
    }
  }

  gameOver() {
    if (this.isPaused) return;

    this.isPaused = true;

    this.physics.pause();

    this.bird.setTint(0xee4824);
    this.bird.anims.stop();

    this.saveBestScore();

    this.time.delayedCall(1000, () => {
      this.scene.restart();
    });
  }
}

export default PlayScene;
