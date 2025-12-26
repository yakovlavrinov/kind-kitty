import { Character } from './Character'

export class Kitty extends Character {
  private runKey: Phaser.Input.Keyboard.Key
  private isRunning = false
  private speed = 50 // Скорость ходьбы
  private runSpeed = 150 // Скорость бега
  private jumpVelocity = -190 // Сила прыжка
  private animation = ''

  // Переменные для сенсорного управления
  private swipeStartX: number = 0
  private swipeStartY: number = 0
  private swipeThreshold = 50 // Минимальное расстояние для свайпа
  // private isTouchMoving = false // Флаг активного сенсорного движения
  private touchRun = false // Флаг бега для сенсорного ввода
  private isSwipeStarted = false // Флаг начала свайпа

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'kitty')

    this.setCollideWorldBounds(true)
    this.body?.setSize(20, 28)
    this.body?.setOffset(30, 20)

    // Инициализация клавиатурного ввода
    this.runKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)

    // Инициализация сенсорного ввода
    const input = scene.input

    // Начало касания
    input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.swipeStartX = pointer.x
      this.swipeStartY = pointer.y
      this.isSwipeStarted = true
    })

    // Движение пальца
    input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!pointer.isDown || !this.isSwipeStarted) return

      const deltaX = pointer.x - this.swipeStartX
      const deltaY = pointer.y - this.swipeStartY

      // Определяем, является ли это свайпом
      if (Math.abs(deltaX) > this.swipeThreshold || Math.abs(deltaY) > this.swipeThreshold) {
        // this.isTouchMoving = true

        // Горизонтальный свайп: движение
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          this.isRunning = Math.abs(deltaX) > this.swipeThreshold * 2 // Бег при длинном свайпе
          this.touchRun = this.isRunning
          if (deltaX > 0) {
            this.setVelocityX(this.isRunning ? this.runSpeed : this.speed)
            this.flipX = true
          } else {
            this.setVelocityX(this.isRunning ? -this.runSpeed : -this.speed)
            this.flipX = false
          }
        }
      }
    })

    // Конец касания
    input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      if (!this.isSwipeStarted) return

      const deltaX = pointer.x - this.swipeStartX
      const deltaY = pointer.y - this.swipeStartY
      const duration = pointer.upTime - pointer.downTime
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      const onGround = this.body?.blocked.down || this.body?.touching.down

      // Короткий тап или свайп вверх — прыжок
      if (
        onGround &&
        ((duration < 200 && distance < 30) || // Короткий тап
          (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < -this.swipeThreshold)) // Свайп вверх
      ) {
        this.setVelocityY(this.jumpVelocity)
      }

      // Сбрасываем сенсорное состояние
      this.isSwipeStarted = false
      // this.isTouchMoving = false
      this.touchRun = false
    })
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    const body = this.body
    if (!body) return

    const onGround = body.blocked.down || body.touching.down
    const velX = body.velocity.x || 0
    const absVelX = Math.abs(velX)

    // 1. Определяем, активно ли сейчас касание
    const isTouchActive = this.scene.input.pointer1.isDown // или activePointer.isDown

    // 2. Клавиатурное управление (работает, если НЕТ активного касания)
    if (!isTouchActive) {
      this.isRunning = this.runKey.isDown
      const currentSpeed = this.isRunning ? this.runSpeed : this.speed

      if (cursors.left.isDown) {
        this.setVelocityX(-currentSpeed)
        this.flipX = false
      } else if (cursors.right.isDown) {
        this.setVelocityX(currentSpeed)
        this.flipX = true
      }
      // Если клавиши отпущены → не трогаем velocity (оставляем для плавной остановки ниже)
    }

    // 3. Сенсорное управление (только при активном касании)
    if (isTouchActive && this.isSwipeStarted) {
      const pointer = this.scene.input.pointer1
      const deltaX = pointer.x - this.swipeStartX

      // Движение только если достаточно большой горизонтальный свайп
      if (Math.abs(deltaX) > this.swipeThreshold) {
        this.isRunning = Math.abs(deltaX) > this.swipeThreshold * 2
        this.touchRun = this.isRunning
        const currentSpeed = this.isRunning ? this.runSpeed : this.speed

        if (deltaX > 0) {
          this.setVelocityX(currentSpeed)
          this.flipX = true
        } else {
          this.setVelocityX(-currentSpeed)
          this.flipX = false
        }
      }
    }

    // 4. Анимации движения (независимо от источника ввода)
    if (absVelX > 10 && onGround) {
      this.isRunning = this.isRunning || this.touchRun // обновляем на всякий случай
      this.animation = this.isRunning ? 'kitty_run' : 'kitty_walk'
      this.play(this.animation, true)
    } else if (absVelX <= 10 && onGround) {
      this.play('kitty_idle', true)
    }

    // 5. Анимации в воздухе
    if (!onGround) {
      if (body.velocity.y < 0) {
        this.play('kitty_jump', true)
      } else if (body.velocity.y > 0) {
        this.play('kitty_fall', true) // если анимация существует
      }
    }

    // 6. Плавная остановка, только когда нет никакого активного ввода
    const noInput =
      !isTouchActive && !cursors.left.isDown && !cursors.right.isDown && !this.runKey.isDown

    if (noInput && absVelX > 0 && onGround) {
      this.setVelocityX(velX * 0.88) // чуть более резкая остановка
      if (absVelX < 12) {
        this.setVelocityX(0)
      }
    }

    // Сбрасываем touchRun, если касание закончилось
    if (!isTouchActive) {
      this.touchRun = false
    }
  }

  hurt() {
    this.play('kitty_hurt', true)
  }
}
