import { Devilfan } from '../entities/Devilfan'
import { Kitty } from '../entities/Kitty'
import { ParallaxBackground } from '../entities/ParallaxBackground'
import { createAllAnimations } from '../utils/animation'

export class MainScene extends Phaser.Scene {
  private kitty!: Kitty
  private devilfan!: Devilfan
  private background!: ParallaxBackground
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private worldWidth = 2400
  private worldHeight = 360
  private stars!: Phaser.Physics.Arcade.Group
  private bombs!: Phaser.Physics.Arcade.Group
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

    const map = this.make.tilemap({ key: 'map' })

    // Добавляем тайлсет к карте
    // "oak_woods_tileset" - имя из поля "source" в вашем JSON
    const tileset = map.addTilesetImage('oak_woods_tileset', 'tiles')
    if (tileset) {
      console.error(
        'Tileset not found! Check names:',
        'oak_woods_tileset should match Tiled,',
        'tiles should match load.image() key'
      )
      return
    }

    // Создаем слой (имя берется из "name" в JSON)
    const groundLayer = map.createLayer('Слой тайлов 1', tileset, 0, 0)
    if (groundLayer) {
      console.error('Layer not created! Available layers:')
      map.layers.forEach((layer, index) => {
        console.log(`[${index}] ${layer.name}`)
      })
      return
    }
    // Включаем коллизии для тайлов (если есть)
    if (groundLayer) {
      groundLayer.setCollisionByProperty({ collides: true })
      // или для всех ненулевых тайлов
      groundLayer.setCollisionByExclusion([-1, 0])
    }

    createAllAnimations(this)

    this.devilfan = new Devilfan(this, 200, 100)
    this.kitty = new Kitty(this, 300, 300)
    this.physics.add.collider(this.kitty, groundLayer)
    this.physics.add.collider(this.devilfan, groundLayer)

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 100, y: 200, stepX: 70 },
    })
    this.stars.children.iterate((child) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
        //   child.setCollideWorldBounds(true)
      }

      return true
    })

    this.bombs = this.physics.add.group()

    this.scoreText = this.add.text(16, 16, 'score: 0', {
      fontSize: '32px',
      color: '#000',
    })

    this.physics.add.overlap(this.kitty, this.stars, this.collectStar, undefined, this)

    this.physics.add.collider(this.kitty, this.bombs, this.hitBomb, undefined, this)

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

  collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (playerObj, starObj) => {
    const player = playerObj as Phaser.Physics.Arcade.Sprite
    const star = starObj as Phaser.Physics.Arcade.Sprite
    star.disableBody(true, true)

    this.score += 10
    this.scoreText.setText(`Score: ${this.score}`)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          child.enableBody(true, child.x, 0, true, true)
        }
        return true
      })
      const x = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

      const bomb = this.bombs.create(x, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
      bomb.allowGravity = false
    }
  }

  hitBomb: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (player) => {
    this.physics.pause()
    if (player instanceof Phaser.Physics.Arcade.Sprite) {
      player.setTint(0xff0000)
    }
    this.gameOver = true
  }
}
