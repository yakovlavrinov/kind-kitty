export const createPlayerAnimations = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: "kitty_idle",
    frames: scene.anims.generateFrameNumbers("kitty-idle", {
      start: 0,
      end: 7,
    }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: "kitty_walk",
    frames: scene.anims.generateFrameNumbers("kitty-walk", {
      start: 0,
      end: 11,
    }),
    frameRate: 20,
    repeat: -1,
  });

  scene.anims.create({
    key: "kitty_jump",
    frames: scene.anims.generateFrameNumbers("kitty-jump", {
      start: 0,
      end: 2,
    }),
    frameRate: 3,
    repeat: 0,
  });

  scene.anims.create({
    key: "kitty_run",
    frames: scene.anims.generateFrameNumbers("kitty-run", {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });
};
