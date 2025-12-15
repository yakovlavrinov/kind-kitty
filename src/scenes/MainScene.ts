import { Devilfan } from '../entities/Devilfan'
import { Food } from '../entities/Food'
import { Kitty } from '../entities/Kitty'
import { ParallaxBackground } from '../entities/ParallaxBackground'
import { createAllAnimations } from '../utils/animation'

export class MainScene extends Phaser.Scene {
  private kitty!: Kitty
  private devilfan!: Devilfan
  private background!: ParallaxBackground
  private map!: Phaser.Tilemaps.Tilemap
  private foodGroup!: Phaser.GameObjects.Group
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private worldWidth = 2400
  private worldHeight = 360
  private scoreText!: Phaser.GameObjects.Text
  private score = 0
  private gameOver = false

  constructor() {
    super('MainScene')
  }

  create() {
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    this.background = new ParallaxBackground(this)
    this.background.create()

    this.map = this.make.tilemap({ key: 'level_one' })

    const tileset = this.map.addTilesetImage('oak_woods_tileset', 'tiles')

    if (!tileset) return

    const groundLayer = this.map.createLayer('ground', tileset, 0, 0)
    const platformsLayer = this.map.createLayer('platforms', tileset, 0, 0)
    this.map.createLayer('mountain', tileset, 0, 0)

    if (!groundLayer) return
    groundLayer.setCollisionByProperty({ collides: true })

    if (!platformsLayer) return
    platformsLayer.setCollisionByProperty({ collides: true })

    this.createFood()

    createAllAnimations(this)

    this.kitty = new Kitty(this, 1300, 90)
    this.kitty.play('kitty_idle', true)
    this.devilfan = new Devilfan(this, 200, 100)
    this.devilfan.play('devilfan_idle', true)

    this.physics.add.collider(this.kitty, groundLayer)
    this.physics.add.collider(this.devilfan, groundLayer)
    this.physics.add.collider(this.kitty, platformsLayer)
    this.physics.add.collider(this.devilfan, platformsLayer)

    this.scoreText = this.add
      .text(16, 16, 'score: 0', {
        fontSize: '32px',
        color: '#000',
      })
      .setScrollFactor(0)
      .setDepth(100)

    this.physics.add.overlap(this.kitty, this.foodGroup, this.collectFood, undefined, this)

    this.cursors = this.input.keyboard!.createCursorKeys()

    this.setupCamera()
  }

  private setupCamera() {
    // Делаем камеру следящей за игроком
    this.cameras.main.startFollow(this.kitty)

    // Настраиваем мертвую зону (когда камера начинает двигаться)
    this.cameras.main.setDeadzone(100, 100)

    // Устанавливаем границы камеры (не дальше границ мира)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight)

    // Плавность камеры (опционально)
    this.cameras.main.setLerp(0.1, 0.1)

    // Отступ от краев (чтобы игрок не был строго по центру)
    this.cameras.main.setFollowOffset(0, 0)
  }

  update() {
    if (this.gameOver) return

    this.kitty.update(this.cursors)
    this.background.update(this.kitty.body?.velocity.x || 0)
  }

  createFood() {
    const foodLayer = this.map.getObjectLayer('food')

    if (!foodLayer) return

    this.foodGroup = this.add.group({ classType: Food })

    foodLayer.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
      // Безопасная проверка координат
      if (!obj.x || !obj.y || !obj.type) {
        console.warn('Invalid food object:', obj)
        return
      }

      switch (obj.type) {
        case 'chicken_leg':
          this.foodGroup.add(new Food(this, obj.x!, obj.y!, 'chicken-leg', 20))
          break
        case 'fish':
          this.foodGroup.add(new Food(this, obj.x!, obj.y!, 'fish', 10))
          break
        case 'milk_pack':
          this.foodGroup.add(new Food(this, obj.x!, obj.y!, 'milk-pack', 100))
          break
        case 'pepper_red':
          this.foodGroup.add(new Food(this, obj.x!, obj.y!, 'pepper-red', -10))
          break
        default:
          console.warn('Unknown food type:', obj.type)
          return
      }
    })
  }

  collectFood: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_player, starObj) => {
    const food = starObj as Phaser.GameObjects.Sprite

    switch (food.texture.key) {
      case 'chicken_leg':
        this.score += 20
        break
      case 'fish':
        this.score += 10
        break
      case 'milk_pack':
        this.score += 100
        break
      case 'pepper_red':
        this.score -= 10
        break
    }
    food.destroy()

    this.scoreText.setText(`Score: ${this.score}`)
  }
}
