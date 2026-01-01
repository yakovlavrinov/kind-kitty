export class PreloadScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics
  private percentText!: Phaser.GameObjects.Text
  private assetText!: Phaser.GameObjects.Text
  private progressFillConfig!: {
    x: number
    y: number
    width: number
    height: number
  }

  constructor() {
    super('Preload')
  }

  preload() {
    this.loadFoodAssets()
    this.loadLevelMapAssets()
    this.loadBackgroundAssets()
    this.loadPlatformAssets()
    this.loadGameItemsAssets()
    this.loadKittyAssets()
    this.loadDogAssets()
    this.loadDevilfanAssets()

    this.loader()
  }

  private loader() {
    this.createLoadingUI()
    this.initLoadingEvents()
  }

  private createLoadingUI() {
    const { width, height } = this.cameras.main

    const centerX = width / 2
    const centerY = height / 2

    // Размеры фона прогресс-бара
    const progressBoxX = centerX - 160
    const progressBoxY = centerY - 25
    const progressBoxWidth = 320
    const progressBoxHeight = 50

    // Размеры полосы прогресс-бара
    this.progressFillConfig = {
      x: centerX - 150,
      y: centerY - 15,
      width: 300,
      height: 30,
    }

    // Общий стиль для текстов
    const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: 'monospace',
      color: '#ffffff',
    }

    // Фон бара
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x222222, 0.8)
    progressBox.fillRect(progressBoxX, progressBoxY, progressBoxWidth, progressBoxHeight)

    // Полоса прогресса
    this.progressBar = this.add.graphics()

    // Текст "Загрузка..."
    this.add
      .text(centerX, centerY - 60, 'Загрузка...', {
        ...textStyle,
        fontSize: '24px',
      })
      .setOrigin(0.5)

    // Процент
    this.percentText = this.add
      .text(centerX, centerY, '0%', {
        ...textStyle,
        fontSize: '20px',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    // Текущий файл
    this.assetText = this.add
      .text(centerX, centerY + 40, '', {
        ...textStyle,
        fontSize: '18px',
      })
      .setOrigin(0.5)
  }

  private initLoadingEvents() {
    const { x, y, width, height } = this.progressFillConfig

    // Обновление полосы прогресс-бара
    this.load.on('progress', (value: number) => {
      this.percentText.setText(Math.round(value * 100) + '%')
      this.progressBar.clear()
      this.progressBar.fillStyle(0xffffff, 1)
      this.progressBar.fillRect(x, y, width * value, height)
    })

    // Загружаемые файлы
    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      this.assetText.setText('Загружается: ' + file.key)
    })

    // Завершение загрузки
    this.load.on('complete', () => {
      this.scene.start('MenuScene')
    })
  }

  private loadFoodAssets() {
    this.load.image('chicken-leg', 'assets/food/chicken_leg.png')
    this.load.image('fish', 'assets/food/fish.png')
    this.load.image('milk-pack', 'assets/food/milk_pack.png')
    this.load.image('pepper-red', 'assets/food/pepper_red.png')
    this.load.image('tiles', 'assets/oak_woods_tileset.png')
  }

  private loadLevelMapAssets() {
    this.load.tilemapTiledJSON('level_one', 'assets/level_one.json')
  }

  private loadBackgroundAssets() {
    this.load.image('background', 'assets/background/background.png')
    this.load.image('city1plan', 'assets/background/city1plan.png')
    this.load.image('city2plan', 'assets/background/city2plan.png')
    this.load.image('city3plan', 'assets/background/city3plan.png')
    this.load.image('city4plan', 'assets/background/city4plan.png')
    this.load.image('light', 'assets/background/light.png')
    this.load.image('smog1', 'assets/background/smog1.png')
    this.load.image('smog2', 'assets/background/smog2.png')
    this.load.image('sun', 'assets/background/sun.png')
  }

  private loadPlatformAssets() {
    this.load.spritesheet('platforms', 'assets/oak_woods_tileset.png', {
      frameWidth: 24,
      frameHeight: 24,
    })
  }

  private loadGameItemsAssets() {
    // star
    this.load.image('star', 'assets/star.png')

    // bomb
    this.load.image('bomb', 'assets/bomb.png')
  }

  private loadKittyAssets() {
    this.load.spritesheet('kitty-idle', 'assets/kitty/idle.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 7,
    })
    this.load.spritesheet('kitty-walk', 'assets/kitty/walk.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 11,
    })
    this.load.spritesheet('kitty-jump', 'assets/kitty/jump.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 2,
    })
    this.load.spritesheet('kitty-run', 'assets/kitty/run.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 7,
    })
    this.load.spritesheet('kitty-attack', 'assets/kitty/attack.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 7,
    })
    this.load.spritesheet('kitty-hurt', 'assets/kitty/hurt.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 3,
    })
  }

  private loadDogAssets() {
    this.load.spritesheet('dog-idle', 'assets/dog/idle.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 3,
    })
    this.load.spritesheet('dog-walk', 'assets/dog/walk.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 5,
    })
    this.load.spritesheet('dog-attack', 'assets/dog/attack.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 3,
    })
    this.load.spritesheet('dog-hurt', 'assets/dog/hurt.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 1,
    })
    this.load.spritesheet('dog-death', 'assets/dog/death.png', {
      frameWidth: 48,
      frameHeight: 48,
      endFrame: 3,
    })
  }

  private loadDevilfanAssets() {
    this.load.spritesheet('devilfan-idle', 'assets/devilfan/idle.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 3,
    })
  }
}
