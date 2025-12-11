import Phaser from 'phaser'
import { Character } from './Character'


export abstract class Enemy extends Character {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame)
  }

  protected abstract patrol(): void
  protected abstract chasePlayer(): void
  protected abstract attackPlayer(): void

  public override update(): void {
    // Здесь общая логика определения состояния + вызов нужного метода
    // Или оставь абстрактным, если каждый враг сильно отличается
  }
}
