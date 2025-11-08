export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.load.image("background", "assets/background/background.png");
    this.load.image("city1plan", "assets/background/city1plan.png");
    this.load.image("city2plan", "assets/background/city2plan.png");
    this.load.image("city3plan", "assets/background/city3plan.png");
    this.load.image("city4plan", "assets/background/city4plan.png");
    this.load.image("light", "assets/background/light.png");
    this.load.image("smog1", "assets/background/smog1.png");
    this.load.image("smog2", "assets/background/smog2.png");
    this.load.image("sun", "assets/background/sun.png");

    this.load.spritesheet("platforms", "assets/oak_woods_tileset.png", {
      frameWidth: 24,
      frameHeight: 24,
    });

    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("kitty-idle", "assets/kitty/IDLE.png", {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 7,
    });
    this.load.spritesheet("kitty-walk", "assets/kitty/WALK.png", {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 11,
    });
    this.load.spritesheet("kitty-jump", "assets/kitty/JUMP.png", {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 2,
    });
    this.load.spritesheet("kitty-run", "assets/kitty/RUN.png", {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 7,
    });
  }
}
