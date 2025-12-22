import { Enemy } from './Enemy'

interface DogStates {
  patrol: () => void
  chase: () => void
  attack: () => void
  idle: () => void
}
export type DogState = keyof DogStates

export class Dog extends Enemy {
  private direction: 1 | -1 = -1
  private patrolSpeed = 100
  private chaseSpeed = 120
  private dogStates: DogStates

  dogState: DogState = 'patrol'

  private target?: Phaser.Physics.Arcade.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dog')
    this.body?.setSize(24, 32)
    this.body?.setOffset(12, 16)

    this.dogStates = {
      patrol: this.patrol,
      chase: this.chase,
      attack: this.attack,
      idle: this.idle,
    }
  }

  setDogState(newState: DogState) {
    console.log(this.dogState)
    this.dogState = newState
  }

  setTarget(player: Phaser.Physics.Arcade.Sprite) {
    this.target = player
  }

  override update() {
    if (!this.target) {
      this.setDogState('patrol')
      return
    }

    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
    const heightDifference = Math.abs(this.y - this.target.y)

    if (
      50 < distance &&
      distance < 220 &&
      heightDifference < 40 &&
      this.anims.currentAnim.key !== 'dog_idle'
    ) {
      this.setDogState('chase')
    } else if (distance > 220 || heightDifference > 40) {
      this.setDogState('patrol')
    }

    this.dogStates[this.dogState].apply(this)
  }

  patrol() {
    const body = this.body as Phaser.Physics.Arcade.Body
    this.setVelocityX(this.direction * this.patrolSpeed)
    this.play('dog_walk', true)
    this.flipX = this.direction < 0

    if (this.direction === -1 && body.blocked.left) {
      this.turnAround()
    }

    if (this.direction === 1 && body.blocked.right) {
      this.turnAround()
    }
  }

  chase() {
    if (!this.target) return
    const dir = this.target.x < this.x ? -1 : 1
    this.setVelocityX(dir * this.chaseSpeed)
    this.play('dog_walk', true)
    this.flipX = dir < 0
  }

  attack() {
    if (!this.target) {
      return
    }
    this.setVelocityX(0)
    this.play('dog_attack', true)
  }

  private turnAround() {
    this.direction *= -1
  }

  idle() {
    this.setVelocityX(0)
    this.play('dog_idle', true)
  }
}


// в объекте переписать на стрелки

// this.anims.currentAnim?.key !== 'dog_idle' добавить? или изменить проверку

// изменить тип на kitty 

// разделение логики обновления  this.updateState()  this.executeState()

// Добавить КОНСТАНТЫ

// Добавить проверку чтобы не менять состояние если оно не изменилось и добавить поддержку прошлого состояния
 