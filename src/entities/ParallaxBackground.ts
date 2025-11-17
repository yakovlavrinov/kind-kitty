export class ParallaxBackground {
  private scene: Phaser.Scene;
  private layers: Record<string, Phaser.GameObjects.TileSprite> = {};

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    const { height } = this.scene.scale;
    const { width } = this.scene.physics.world.bounds

    // Создаем слои параллакса в правильном порядке (от дальнего к ближнему)

    // Слой 1: дальний фон
    this.layers.background = this.scene.add.tileSprite(0, 0, width, height, "background").setOrigin(0, 0);

    // Слой 2: солнце
    this.scene.add.image(width * 0.27, height * 0.01, "sun")

    // Слой 3: дальние здания
    this.layers.city4 = this.scene.add.tileSprite(0, height, width, height, "city4plan").setOrigin(0, 1);

    // Слой 4: следующий слой зданий
    this.layers.city3 = this.scene.add.tileSprite(0, height, width, height, "city3plan").setOrigin(0, 1);

    // Слой 5: эффект дыма/тумана
    this.layers.smog2 = this.scene.add
      .tileSprite(0, 0, width, height, "smog2")
      .setOrigin(0, 0)
      .setAlpha(0.2)
      .setBlendMode(Phaser.BlendModes.ADD);

    // Слой 6: ближние здания
    this.layers.city2 = this.scene.add.tileSprite(0, height, width, 360, "city2plan").setOrigin(0, 1);

    // Слой 7: эффект дыма/тумана
    this.layers.smog1 = this.scene.add
      .tileSprite(0, 0, width, height, "smog1")
      .setOrigin(0, 0)
      .setAlpha(0.2)
      .setBlendMode(Phaser.BlendModes.ADD);

    // Слой 8: самые близкие здания
    this.layers.city1 = this.scene.add.tileSprite(0, height, width, 360, "city1plan").setOrigin(0, 1);
    

   
  }

  update(playerVelocityX: number) {
    const direction = playerVelocityX > 0 ? 1 : playerVelocityX < 0 ? -1 : 0;
    const speed = Math.min(Math.abs(playerVelocityX) * 0.005, 200);

    this.layers.city1.tilePositionX += speed * direction * 0.8;
    this.layers.city2.tilePositionX += speed * direction * 0.6;
    this.layers.city3.tilePositionX += speed * direction * 0.4
    this.layers.city4.tilePositionX += speed * direction * 0.2;

    this.layers.smog2.tilePositionX += speed * direction * 0.1
    this.layers.smog1.tilePositionX += speed * direction * 0.05
  }
}
