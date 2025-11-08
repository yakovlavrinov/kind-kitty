import { GAME_HEIGHT, GAME_WIDTH, GRAVITY } from "../utils/constants";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: GRAVITY },
    },
  },
  scene: [],
};
