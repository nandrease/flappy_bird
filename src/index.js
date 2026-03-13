import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_POSITION = { x: GAME_WIDTH * 0.1, y: GAME_HEIGHT / 2 };

const SHARED_CONFIG = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  startPosition: BIRD_POSITION,
};

const scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = Scene => new Scene(SHARED_CONFIG);
const initScenes = () => scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: initScenes(),
};

const game = new Phaser.Game(config);

export default game;
