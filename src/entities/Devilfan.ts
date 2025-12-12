import { Enemy } from './Enemy'

export class Devilfan extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'devilfan')
    this.body?.setSize(96, 96)
  }

  update() {}

  patrol() {}

  chasePlayer() {}

  attackPlayer() {}
}
