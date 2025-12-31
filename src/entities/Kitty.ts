import { Character } from './Character'

export const KITTY_STATE = {
  IDLE: 'idle',
  WALK: 'walk',
  JUMP: 'jump',
  RUN: 'run',
  ATTACK: 'attack',
  HURT: 'hurt',
} as const

export const KITTY_WALK_SPEED = 50
export const KITTY_RUN_SPEED = 150

export type KittyState = (typeof KITTY_STATE)[keyof typeof KITTY_STATE]

export interface KittyStates extends Record<KittyState, () => void> {}

export class Kitty extends Character {
  private kittyState: KittyState = KITTY_STATE.IDLE
  private direction: 1 | -1 = 1
  private runKey: Phaser.Input.Keyboard.Key

  private kittyStates = {
    idle: () => this.idle(),
    walk: () => this.walk(),
    jump: () => this.jump(),
    run: () => this.run(),
    attack: () => this.attack(),
    hurt: () => this.hurt(),
  }

  // Переменные для сенсорного управления
  private swipeStartX = 0
  private swipeStartY = 0
  private swipeThreshold = 50
  private isSwipeStarted = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'kitty')

    this.setCollideWorldBounds(true)

    this.body?.setSize(20, 28)
    this.body?.setOffset(30, 20)
    this.runKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    //  Сенсорное управление
    const input = scene.input

    input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.swipeStartX = pointer.x
      this.swipeStartY = pointer.y
      this.isSwipeStarted = true
    })

    input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown) return

      const deltaX = pointer.x - this.swipeStartX
      const deltaY = pointer.y - this.swipeStartY

      if (Math.abs(deltaX) > this.swipeThreshold || Math.abs(deltaY) > this.swipeThreshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          const isRunning =
            Math.abs(deltaX) > this.swipeThreshold * 2 || Math.abs(deltaY) > this.swipeThreshold * 2
              ? KITTY_STATE.RUN
              : KITTY_STATE.WALK
          if (deltaX > 0) {
            this.direction = 1
            this.flipX = true
            this.setKittyState(isRunning)
          } else {
            this.direction = -1
            this.flipX = false
            this.setKittyState(isRunning)
          }
        } else if (Math.abs(deltaX) < Math.abs(deltaY)) {
          if (deltaY < 0) {
            this.setKittyState('jump')
          }
        }
      }
    })

    input.on('pointerup', () => {
      this.isSwipeStarted = false
    })
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const isRunning = this.runKey.isDown ? KITTY_STATE.RUN : KITTY_STATE.WALK
    // TODO изменить название переменной состояние движения
    this.flipX = this.direction > 0
    if (!this.isSwipeStarted) {
      if (cursors.left.isDown) {
        this.direction = -1
        this.flipX = false

        this.setKittyState(isRunning)
      } else if (cursors.right.isDown) {
        this.direction = 1
        this.flipX = true

        this.setKittyState(isRunning)
      } else {
        this.onGround && this.setKittyState(KITTY_STATE.IDLE)
        this.flipX = this.direction > 0
      }

      if (cursors.up.isDown) {
        this.onGround && this.setKittyState(KITTY_STATE.JUMP)
        this.flipX = this.direction > 0
      }

      if (!this.onGround && this.body?.velocity.y !== 0) {
        // this.play('kitty_jump', true);
        // TODO нужно заменить на анимацию падения и прописать логику чтобы не пересекалась
      }
    }

    this.executeState()
  }

  executeState() {
    // TODO оптимизировать от лишних вызовов
    this.kittyStates[this.kittyState]()
  }

  idle() {
    this.setVelocityX(0)
    this.play('kitty_idle', true)
  }
  walk() {
    this.setVelocityX(this.direction * KITTY_WALK_SPEED)
    this.onGround && this.play('kitty_walk', true)
  }

  jump() {
    if (this.onGround) {
      this.setVelocityY(-190)
      this.play('kitty_jump', true)
    }
  }

  run() {
    this.setVelocityX(this.direction * KITTY_RUN_SPEED)
    this.onGround && this.play('kitty_run', true)
  }
  attack() {}

  hurt() {
    this.play('kitty_hurt', true)
  }

  setKittyState(newKittyState: KittyState) {
    if (newKittyState !== this.kittyState) {
      this.kittyState = newKittyState
    }
  }

  get onGround() {
    const body = this.body as Phaser.Physics.Arcade.Body
    return body.onFloor()
  }
}
