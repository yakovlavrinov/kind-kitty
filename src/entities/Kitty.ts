import { Character } from './Character'

export class Kitty extends Character {
  private runKey: Phaser.Input.Keyboard.Key
  private isRunning = false
  private speed = 0
  private animation = ''

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'kitty')

    this.setCollideWorldBounds(true)

    this.body?.setSize(20, 28)
    this.body?.setOffset(30, 20)
    this.runKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const onGround = this.body?.blocked.down || this.body?.touching.down

    this.isRunning = this.runKey.isDown
    this.speed = this.isRunning ? 150 : 50
    this.animation = this.isRunning ? 'kitty_run' : 'kitty_walk'

    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed)

      onGround && this.play(this.animation, true)

      this.flipX = false
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed)

      onGround && this.play(this.animation, true)

      this.flipX = true
    } else {
      this.setVelocityX(0)

      onGround && this.play('kitty_idle', true)
    }

    if (cursors.up.isDown && onGround) {
      this.setVelocityY(-190)

      this.play('kitty_jump')
    }

    if (!onGround && this.body?.velocity.y !== 0) {
      // player.play('kitty_jump');
      // Нужно заменить на анимацию падения и прописать логику чтобы не пересекалась
    }
  }
}
