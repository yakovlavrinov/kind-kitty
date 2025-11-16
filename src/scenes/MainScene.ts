import { ParallaxBackground } from "../entities/ParallaxBackground";
import { Player } from "../entities/Player";
import { GROUND } from "../utils/constants";
import { createFromMatrix } from "../utils/createFromMatrix";

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private background!: ParallaxBackground;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private worldWidth: number = 2400
  private worldHeight: number = 1200

  constructor() {
    super("MainScene");
  }

  create() {
    this.physics.world.setBounds(0,0, this.worldWidth, this.worldHeight)

    this.background = new ParallaxBackground(this);
    this.background.create();

    const ground = createFromMatrix(this, 12, 1200, 'platforms', 24, GROUND)

    this.player = new Player(this, 100, 1100);

    this.physics.add.collider(this.player.sprite, ground);

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
    this.player.update(this.cursors);
    this.background.update(this.player.sprite.body?.velocity.x || 0);
  }
}
