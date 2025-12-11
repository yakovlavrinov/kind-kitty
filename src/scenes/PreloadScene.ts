export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('Preload')
  }

  preload() {
    this.load.image('tiles', 'assets/oak_woods_tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/map.json');
    

    // background
    this.load.image('background', 'assets/background/background.png')
    this.load.image('city1plan', 'assets/background/city1plan.png')
    this.load.image('city2plan', 'assets/background/city2plan.png')
    this.load.image('city3plan', 'assets/background/city3plan.png')
    this.load.image('city4plan', 'assets/background/city4plan.png')
    this.load.image('light', 'assets/background/light.png')
    this.load.image('smog1', 'assets/background/smog1.png')
    this.load.image('smog2', 'assets/background/smog2.png')
    this.load.image('sun', 'assets/background/sun.png')

    // platform
    this.load.spritesheet('platforms', 'assets/oak_woods_tileset.png', {
      frameWidth: 24,
      frameHeight: 24,
    })

    // star
    this.load.image('star', 'assets/food/fish_fillet.png')

    // bomb
    this.load.image('bomb', 'assets/bomb.png')

    // kitty
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

    // devilfan / чертофан

    this.load.spritesheet('devilfan-idle', 'assets/devilfan/idle.png', {
      frameWidth: 80,
      frameHeight: 64,
      endFrame: 3,
    })
  }

  create() {
    this.scene.start('MainScene')
  }
}
