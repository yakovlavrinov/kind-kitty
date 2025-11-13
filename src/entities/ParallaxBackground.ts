
export class ParallaxBackground {
    private scene: Phaser.Scene
    private layers: Record<string, Phaser.GameObjects.TileSprite> = {}

    constructor(scene: Phaser.Scene) {
        this.scene = scene
    }

    create() {
        const {width, height} = this.scene.scale

        this.layers.city4 = this.scene.add.tileSprite(0,height, width, 360, "city4plan").setOrigin(0,1)
        this.layers.city3 = this.scene.add.tileSprite(0,height, width, 360, "city3plan").setOrigin(0,1)
        this.layers.city2 = this.scene.add.tileSprite(0,height, width, 360, "city2plan").setOrigin(0,1)
        this.layers.city1 = this.scene.add.tileSprite(0,height, width, 360, "city1plan").setOrigin(0,1)
    }

    update(playerVelocityX: number) {
        const direction = playerVelocityX > 0 ? 1 : playerVelocityX < 0 ? -1 : 0
        const speed = Math.min(Math.abs(playerVelocityX) * 0.005, 2)

        this.layers.city1.tilePositionX += speed * direction * 0.8
        this.layers.city1.tilePositionX += speed * direction * 0.6
        this.layers.city1.tilePositionX += speed * direction * 0.4
        this.layers.city1.tilePositionX += speed * direction * 0.2
        
    }
}