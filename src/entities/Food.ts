export class Food extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, points: number) {
    super(scene, x, y, texture)
    scene.add.existing(this)
    scene.physics.add.existing(this, true)

    this.setOrigin(0.5, 0.85)
    this.setData('points', points)

    scene.tweens.add({
      targets: this,
      y: this.y - 5,
      duration: 1600 + Phaser.Math.Between(-200, 200),
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
  }
}
