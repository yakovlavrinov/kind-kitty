import { ParallaxBackground } from "../entities/ParallaxBackground";
import { Player } from "../entities/Player";
import { GROUND, PLATFORM } from "../utils/constants";
import { createFromMatrix } from "../utils/createFromMatrix";

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

    // const platforms = this.physics.add.staticGroup();
    // platforms.create(12, 348, "platforms",0 ).refreshBody();

    const platforms = createFromMatrix(this, 10, 350, 'platforms', 24, GROUND)
   

    this.player = new Player(this, 100, 450);
    this.physics.add.collider(this.player.sprite, platforms);

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    this.player.update(this.cursors);
    this.background.update(this.player.sprite.body?.velocity.x || 0);
  }
}
