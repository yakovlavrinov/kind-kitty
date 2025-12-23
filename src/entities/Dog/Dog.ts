import { Enemy } from '../Enemy'
import type { Kitty } from '../Kitty'
import {
  DOG_CHASE_SPEED,
  DOG_ANIMATIONS,
  DOG_BODY_OFFSET_HEIGHT,
  DOG_BODY_OFFSET_WIDTH,
  DOG_BODY_SIZE_HEIGHT,
  DOG_BODY_SIZE_WIDTH,
  DOG_MAX_CHASE_DISTANCE,
  DOG_MIN_CHASE_DISTANCE,
  DOG_MIN_CHASE_HEIGHT,
  DOG_PATROL_SPEED,
} from './constants'
import { DOG_STATE, type DogState, type DogStates } from './types'

export class Dog extends Enemy {
  private dogState: DogState = DOG_STATE.PATROL
  private direction: 1 | -1 = -1
  private dogStates: DogStates
  private target?: Kitty

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'dog')
    this.body?.setSize(DOG_BODY_SIZE_WIDTH, DOG_BODY_SIZE_HEIGHT)
    this.body?.setOffset(DOG_BODY_OFFSET_WIDTH, DOG_BODY_OFFSET_HEIGHT)

    this.dogStates = {
      patrol: () => this.patrol(),
      chase: () => this.chase(),
      attack: () => this.attack(),
      idle: () => this.idle(),
    }
  }

  setTarget(kitty: Kitty) {
    this.target = kitty
  }

  override update() {
    this.updateState()
    this.executeState()
  }

  updateState() {
    if (!this.target) {
      this.setDogState(DOG_STATE.PATROL)
      return
    }

    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y)
    const heightDifference = Math.abs(this.y - this.target.y)

    if (
      DOG_MIN_CHASE_DISTANCE < distance &&
      distance < DOG_MAX_CHASE_DISTANCE &&
      heightDifference < DOG_MIN_CHASE_HEIGHT &&
      this.anims.currentAnim?.key !== DOG_ANIMATIONS.IDLE
    ) {
      this.setDogState(DOG_STATE.CHASE)
    } else if (distance > DOG_MAX_CHASE_DISTANCE || heightDifference > DOG_MIN_CHASE_HEIGHT) {
      this.setDogState(DOG_STATE.PATROL)
    }
  }

  executeState() {
    this.dogStates[this.dogState]()
  }

  patrol() {
    if (!this.body) return
    this.setVelocityX(this.direction * DOG_PATROL_SPEED)
    this.play(DOG_ANIMATIONS.WALK, true)
    this.flipX = this.direction < 0

    if (this.direction === -1 && this.body.blocked.left) {
      this.reverseDirection()
    }

    if (this.direction === 1 && this.body.blocked.right) {
      this.reverseDirection()
    }
  }

  chase() {
    if (!this.target) return
    const dir = this.target.x < this.x ? -1 : 1
    this.setVelocityX(dir * DOG_CHASE_SPEED)
    this.play(DOG_ANIMATIONS.WALK, true)
    this.flipX = dir < 0
  }

  attack() {
    if (!this.target) {
      return
    }
    this.setVelocityX(0)
    this.play(DOG_ANIMATIONS.ATTACK, true)
  }

  private reverseDirection() {
    this.direction *= -1
  }

  idle() {
    this.setVelocityX(0)
    this.play(DOG_ANIMATIONS.IDLE, true)
  }

  setDogState(newDogState: DogState) {
    if (newDogState !== this.dogState) {
      this.dogState = newDogState
    }
  }
}
