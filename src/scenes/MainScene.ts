import { ParallaxBackground } from "../entities/ParallaxBackground";
import { Player } from "../entities/Player";
import { CUB, GROUND, PLATFORM1, PLATFORM3, PLATFORM4 } from "../utils/constants";
import { createFromMatrix } from "../utils/createFromMatrix";

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private background!: ParallaxBackground;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private worldWidth = 2400;
  private worldHeight = 360;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private score = 0;
  private gameOver = false;

  constructor() {
    super("MainScene");
  }

  create() {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    this.background = new ParallaxBackground(this);
    this.background.create();

    const ground = createFromMatrix(this, 12, 360, "platforms", 24, GROUND);
    const platform1 = createFromMatrix(this, 300, 330, "platforms", 24, PLATFORM4);
    const platform2 = createFromMatrix(this, 600, 350, "platforms", 24, PLATFORM3);
    const platform3 = createFromMatrix(this, 700, 308, "platforms", 24, PLATFORM1);
    const platform4 = createFromMatrix(this, 768, 280, "platforms", 24, PLATFORM3);
    const platform5 = createFromMatrix(this, 620, 250, "platforms", 24, PLATFORM3);
    const cub = createFromMatrix(this, 1200, 235, "platforms", 24, CUB);

    this.player = new Player(this, 100, 300);

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(this.player.sprite, platform1);
    this.physics.add.collider(this.player.sprite, platform2);
    this.physics.add.collider(this.player.sprite, platform3);
    this.physics.add.collider(this.player.sprite, platform4);
    this.physics.add.collider(this.player.sprite, platform5);
    this.physics.add.collider(this.player.sprite, cub);

    this.stars = this.physics.add.group({ key: "star", repeat: 11, setXY: { x: 100, y: 200, stepX: 70 } });
    this.stars.children.iterate((child) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        //   child.setCollideWorldBounds(true)
      }

      return true;
    });

    this.physics.add.collider(this.stars, ground);
    this.physics.add.collider(this.stars, platform1);
    this.physics.add.collider(this.stars, platform2);
    this.physics.add.collider(this.stars, platform3);
    this.physics.add.collider(this.stars, platform4);
    this.physics.add.collider(this.stars, platform5);
    this.physics.add.collider(this.stars, cub);

    this.bombs = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      color: "#000",
    });

    this.physics.add.overlap(this.player.sprite, this.stars, this.collectStar, undefined, this);

    this.physics.add.collider(this.player.sprite, this.bombs, this.hitBomb, undefined, this);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.setupCamera();
  }

  private setupCamera() {
    // Делаем камеру следящей за игроком
    this.cameras.main.startFollow(this.player.sprite);

    // Настраиваем мертвую зону (когда камера начинает двигаться)
    this.cameras.main.setDeadzone(100, 100);

    // Устанавливаем границы камеры (не дальше границ мира)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // Плавность камеры (опционально)
    this.cameras.main.setLerp(0.1, 0.1);

    // Отступ от краев (чтобы игрок не был строго по центру)
    this.cameras.main.setFollowOffset(0, 0);
  }

  update() {
    if (this.gameOver) return;

    this.player.update(this.cursors);
    this.background.update(this.player.sprite.body?.velocity.x || 0);
  }

  collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (playerObj, starObj) => {
    const player = playerObj as Phaser.Physics.Arcade.Sprite;
    const star = starObj as Phaser.Physics.Arcade.Sprite;
    star.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          child.enableBody(true, child.x, 0, true, true);
        }
        return true;
      });
      const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      const bomb = this.bombs.create(x, 16, "bomb");
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  };

  hitBomb: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (player) => {
    this.physics.pause();
    if (player instanceof Phaser.Physics.Arcade.Sprite) {
      player.setTint(0xff0000);
    }
    this.gameOver = true;
  };
}
