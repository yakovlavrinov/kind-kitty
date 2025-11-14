import { ParallaxBackground } from "../entities/ParallaxBackground";
import { Player } from "../entities/Player";

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private background!: ParallaxBackground;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("MainScene");
  }

  create() {
    this.background = new ParallaxBackground(this);
    this.background.create();

    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 580, "platforms", 0).setScale(4).refreshBody();

    this.player = new Player(this, 100, 450);
    this.physics.add.collider(this.player.sprite, platforms);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    this.player.update(this.cursors);
    this.background.update(this.player.sprite.body?.velocity.x || 0);
  }
}
