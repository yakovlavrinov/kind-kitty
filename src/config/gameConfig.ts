import { MainScene } from '../scenes/MainScene'
import { MenuScene } from '../scenes/MenuScene'
import { PreloadScene } from '../scenes/PreloadScene'
import { DESKTOP_HEIGHT, DESKTOP_WIDTH, GRAVITY } from '../utils/constants'

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: DESKTOP_WIDTH,
  height: DESKTOP_HEIGHT,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
    },
  },
  scene: [PreloadScene, MenuScene, MainScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 630,
    height: 360,
  },
  render: {
    antialias: false, // 🔥 ВЫКЛЮЧИТЬ сглаживание
    pixelArt: true, // 🔥 ВКЛЮЧИТЬ пиксель-арт режим
    roundPixels: true, // 🔥 Округление позиций
    transparent: false,
    clearBeforeRender: true,
  },
}
