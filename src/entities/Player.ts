import Phaser from "phaser";
import { createPlayerAnimations } from "../utils/animation";

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private isRunning: boolean = false
  private runKey: Phaser.Input.Keyboard.Key
  private animation: string
  private speed: number

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "kitty-idle");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body?.setSize(28, 28);
    this.runKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    this.animation = ''
    this.speed = 0
    createPlayerAnimations(scene);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const onGround = this.sprite.body?.blocked.down || this.sprite.body?.touching.down;
    this.isRunning = this.runKey.isDown
    this.speed = this.isRunning? 150 : 50
    this.animation = this.isRunning? 'kitty_run' : 'kitty_walk'
    
    if (cursors.left.isDown) {
      
      this.sprite.setVelocityX(-this.speed);

      onGround && this.sprite.play(this.animation, true);

      this.sprite.flipX = false;
    } else if (cursors.right.isDown) {
      this.sprite.setVelocityX(this.speed);

      onGround && this.sprite.play(this.animation, true);

      this.sprite.flipX = true;
    } else {
      this.sprite.setVelocityX(0);

      onGround && this.sprite.play("kitty_idle", true);
    }

    if (cursors.up.isDown && onGround) {
      this.sprite.setVelocityY(-190);

      this.sprite.play("kitty_jump");
    }

    if (!onGround && this.sprite.body?.velocity.y !== 0) {
      // player.play('kitty_jump');
      // Нужно заменить на анимацию падения и прописать логику чтобы не пересекалась
    }
  }
}
