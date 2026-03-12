import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {
  constructor(config) {
    super('PlayScene');
    this.config = {
      ...config,
      pipeVerticalDistanceRange: [150, 250],
      pipeHorizontalDistanceRange: [500, 550],
      flapVelocity: 250,
      PIPES_TO_RENDER: 4,
    };

    this.bird = null;
    this.pipes = null;
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
  }
  create() {
    this.createBackground();
    this.createBird();
    this.createPipes();
    this.handleCollisions();
    this.handleInputs();
  }

  update() {
    this.handleBirdCollisions();

    this.recyclePipes();
  }

  createBackground() {
    this.add.image(0, 0, 'sky').setOrigin(0);
  }

  createBird() {
    this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
    this.bird.body.gravity.y = 400;
  }

  createPipes() {
    this.pipes = this.physics.add.group();
    for (let i = 0; i < this.config.PIPES_TO_RENDER; i++) {
      const upperPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 1);
      const lowerPipe = this.pipes.create(0, 0, 'pipe').setOrigin(0, 0);

      this.placePipe(upperPipe, lowerPipe);
    }

    this.pipes.setVelocityX(-200);

    this.pipes.getChildren().forEach(pipe => {
      pipe.body.allowGravity = false;
      pipe.body.immovable = true;
    });
  }

  handleCollisions() {
    this.physics.add.collider(this.bird, this.pipes, () => {
      this.reset();
    });
  }

  handleBirdCollisions() {
    if (this.bird.y > this.config.height || this.bird.y < -this.bird.height) {
      this.reset();
    }
  }

  handleInputs() {
    this.input.on('pointerdown', this.flap, this);
    this.input.keyboard.on('keydown_SPACE', this.flap, this);
  }

  flap() {
    this.bird.body.velocity.y = -this.config.flapVelocity;
  }

  placePipe(uPipe, lPipe) {
    const rightMostX = this.getRightMostPipe();
    const pipeVerticalDistance = Phaser.Math.Between(...this.config.pipeVerticalDistanceRange);
    const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
    const pipeHorizontalDistance = Phaser.Math.Between(...this.config.pipeHorizontalDistanceRange);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  getRightMostPipe() {
    let rightMostX = 0;

    this.pipes.getChildren().forEach(pipe => {
      rightMostX = Math.max(pipe.x, rightMostX);
    });

    return rightMostX;
  }

  recyclePipes() {
    const tempPipes = [];
    this.pipes.getChildren().forEach(pipe => {
      if (pipe.getBounds().right <= 0) {
        tempPipes.push(pipe);
        if (tempPipes.length === 2) {
          this.placePipe(...tempPipes);
        }
      }
    });
  }

  reset() {
    this.bird.x = this.config.startPosition.x;
    this.bird.y = this.config.startPosition.y;
    this.bird.setVelocity(0, 0);
  }
}

export default PlayScene;
