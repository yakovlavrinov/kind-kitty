import Phaser from "phaser";
import { createPlayerAnimations } from "../utils/animation";

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.physics.add.sprite(x, y, "kitty-idle");
    this.sprite.setCollideWorldBounds(true);
    this.sprite.body?.setSize(32, 32);

    createPlayerAnimations(scene);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const onGround = this.sprite.body?.blocked.down || this.sprite.body?.touching.down;

    if (cursors.left.isDown) {
      this.sprite.setVelocityX(-100);

      if (onGround) {
        this.sprite.setVelocityX(-50);

        this.sprite.play("kitty_walk", true);
      }

      onGround && this.sprite.play("kitty-walk", true);

      this.sprite.flipX = false;
    } else if (cursors.right.isDown) {
      this.sprite.setVelocityX(100);

      if (onGround) {
        this.sprite.setVelocityX(50);

        this.sprite.play("kitty_walk", true);
      }
      this.sprite.flipX = true;
    } else {
      this.sprite.setVelocity(0);

      onGround && this.sprite.play("kitty_idle", true);
    }

    if (cursors.up.isDown && onGround) {
      this.sprite.setVelocityY(-260);

      this.sprite.play("kitty_jump");
    }
  }
}
