import { MainScene } from "../scenes/MainScene";
import { PreloadScene } from "../scenes/PreloadScene";
import { DESKTOP_HEIGHT, DESKTOP_WIDTH, GRAVITY } from "../utils/constants";

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: DESKTOP_WIDTH,
  height: DESKTOP_HEIGHT,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: GRAVITY },
    },
  },
  scene: [PreloadScene, MainScene],
};
