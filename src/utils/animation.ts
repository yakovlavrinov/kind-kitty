export const createAllAnimations = (scene: Phaser.Scene) => {
  // kitty
  scene.anims.create({
    key: 'kitty_idle',
    frames: scene.anims.generateFrameNumbers('kitty-idle', {
      start: 0,
      end: 7,
    }),
    frameRate: 8,
    repeat: -1,
  })

  scene.anims.create({
    key: 'kitty_walk',
    frames: scene.anims.generateFrameNumbers('kitty-walk', {
      start: 0,
      end: 11,
    }),
    frameRate: 20,
    repeat: -1,
  })

  scene.anims.create({
    key: 'kitty_jump',
    frames: scene.anims.generateFrameNumbers('kitty-jump', {
      start: 0,
      end: 2,
    }),
    frameRate: 3,
    repeat: 0,
  })

  scene.anims.create({
    key: 'kitty_run',
    frames: scene.anims.generateFrameNumbers('kitty-run', {
      start: 0,
      end: 7,
    }),
    frameRate: 20,
    repeat: -1,
  })
  scene.anims.create({
    key: 'kitty_attack',
    frames: scene.anims.generateFrameNumbers('kitty-attack', {
      start: 0,
      end: 3,
    }),
    frameRate: 6,
    repeat: -1,
  })
  scene.anims.create({
    key: 'kitty_hurt',
    frames: scene.anims.generateFrameNumbers('kitty-hurt', {
      start: 0,
      end: 1,
    }),
    frameRate: 6,
    repeat: -1,
  })

  // dog / пес

   scene.anims.create({
    key: 'dog_idle',
    frames: scene.anims.generateFrameNumbers('dog-idle', {
      start: 0,
      end: 3,
    }),
    frameRate: 6,
    repeat: -1,
  })
  scene.anims.create({
    key: 'dog_walk',
    frames: scene.anims.generateFrameNumbers('dog-walk', {
      start: 0,
      end: 5,
    }),
    frameRate: 15,
    repeat: -1,
  })
  scene.anims.create({
    key: 'dog_attack',
    frames: scene.anims.generateFrameNumbers('dog-attack', {
      start: 0,
      end: 3,
    }),
    frameRate: 6,
    repeat: -1,
  })
  scene.anims.create({
    key: 'dog_hurt',
    frames: scene.anims.generateFrameNumbers('dog-hurt', {
      start: 0,
      end: 1,
    }),
    frameRate: 6,
    repeat: -1,
  })
  scene.anims.create({
    key: 'dog_death',
    frames: scene.anims.generateFrameNumbers('dog-death', {
      start: 0,
      end: 3,
    }),
    frameRate: 6,
    repeat: -1,
  })

  // devilfan / чертофан

  scene.anims.create({
    key: 'devilfan_idle',
    frames: scene.anims.generateFrameNumbers('devilfan-idle', {
      start: 0,
      end: 2,
    }),
    frameRate: 8,
    repeat: -1,
  })
}
