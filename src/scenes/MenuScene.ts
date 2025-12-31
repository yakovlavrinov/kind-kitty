export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const centerX = this.cameras.main.width / 2
    const centerY = this.cameras.main.height / 2

    this.createButton(centerX, centerY - 100, 'ИГРАТЬ', () => {
      this.scale.stopFullscreen()
      this.scene.start('MainScene')
    })

    this.createButton(centerX, centerY, 'Выживание', () => {
      alert('Данный режим в разработке')
    })

    // this.createButton(centerX, centerY + 100, 'ВЫХОД', () => {
    //   alert('Пока! 👋')
    // })

    this.createButton(centerX, centerY + 100, 'ВЕСЬ ЭКРАН', () => {
      if (this.scale.isFullscreen) {
        // Уже в полноэкранном — выходим
        this.scale.stopFullscreen()
      } else {
        // Входим в полноэкранный режим
        this.scale.startFullscreen()
      }
    })
  }

  private createButton(x: number, y: number, label: string, onClick: () => void) {
    const button = this.add
      .text(x, y, label, {
        fontSize: '40px',
        color: '#ffffff',
        backgroundColor: '#222222',
        fontFamily: 'Arial, sans-serif',
        padding: { x: 20, y: 15 },
        fixedWidth: 300,
        fixedHeight: 80,
        align: 'center',
        stroke: '#000000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    const defaultStyle = { color: '#ffffff', backgroundColor: '#222222' }
    const hoverStyle = { color: '#ffffff', backgroundColor: '#222222' }

    button.on('pointerover', () => {
      button.setStyle(hoverStyle)
      this.tweens.add({
        targets: button,
        scale: 1.1,
        duration: 200,
        ease: 'Power2',
      })
    })

    button.on('pointerout', () => {
      button.setStyle(defaultStyle)
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 200,
        ease: 'Power2',
      })
    })

    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scale: 0.95,
        duration: 100,
        yoyo: true,
        ease: 'Power1',
      })
      onClick()
    })
  }
}
