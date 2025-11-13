

let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let stars: Phaser.Physics.Arcade.Group;
let bombs: Phaser.Physics.Arcade.Group;
let scoreText: Phaser.GameObjects.Text;
let score = 0;
let gameOver = false;

// Переменные для параллакс-фона
// @ts-ignore
let background: Phaser.GameObjects.TileSprite;
let city1plan: Phaser.GameObjects.TileSprite;
let city2plan: Phaser.GameObjects.TileSprite;
let city3plan: Phaser.GameObjects.TileSprite;
let city4plan: Phaser.GameObjects.TileSprite;
let light: Phaser.GameObjects.TileSprite;
let smog1: Phaser.GameObjects.TileSprite;
let smog2: Phaser.GameObjects.TileSprite;
// @ts-ignore
let sun: Phaser.GameObjects.Image;

function preload(this: Phaser.Scene) {
  this.load.image("background", "/public/assets/background/background.png");
  this.load.image("city1plan", "/public/assets/background/city1plan.png");
  this.load.image("city2plan", "/public/assets/background/city2plan.png");
  this.load.image("city3plan", "/public/assets/background/city3plan.png");
  this.load.image("city4plan", "/public/assets/background/city4plan.png");
  this.load.image("light", "/public/assets/background/light.png");
  this.load.image("smog1", "/public/assets/background/smog1.png");
  this.load.image("smog2", "/public/assets/background/smog2.png");
  this.load.image("sun", "/public/assets/background/sun.png");

  this.load.spritesheet("platforms", "/public/assets/oak_woods_tileset.png", {
    frameWidth: 24,
    frameHeight: 24,
  });
  
  this.load.image("star", "/public/assets/star.png");
  this.load.image("bomb", "/public/assets/bomb.png");
  this.load.spritesheet("kitty-idle", "/public/assets/kitty/IDLE.png", {
    frameWidth: 80,
    frameHeight: 64,
    endFrame: 7,
  });
  this.load.spritesheet("kitty-walk", "/public/assets/kitty/WALK.png", {
    frameWidth: 80,
    frameHeight: 64,
    endFrame: 11,
  });
  this.load.spritesheet("kitty-jump", "/public/assets/kitty/JUMP.png", {
    frameWidth: 80,
    frameHeight: 64,
    endFrame: 2,
  });
  this.load.spritesheet("kitty-run", "/public/assets/kitty/RUN.png", {
    frameWidth: 80,
    frameHeight: 64,
    endFrame: 7,
  });
}

function createParallaxBackground(this: Phaser.Scene) {
  const { width, height } = this.game.config;

  // Создаем слои параллакса в правильном порядке (от дальнего к ближнему)

  // Слой 1: Самый дальний фон
  background = this.add
    .tileSprite(0, 0, width as number, height as number, "background")
    .setOrigin(0, 0)
    .setScrollFactor(0);

  // Слой 2: Солнце
  sun = this.add
    .image((width as number) * 0.8, (height as number) * 0.2, "sun")
    .setScrollFactor(0.1)
    .setAlpha(0.9);

  // Слой 3: Дальние здания
  city4plan = this.add
    .tileSprite(0, height as number, width as number, 360, "city4plan")
    .setOrigin(0, 1)
    .setScrollFactor(0.2);

  // Слой 4: Следующий слой зданий
  city3plan = this.add
    .tileSprite(0, height as number, width as number, 360, "city3plan")
    .setOrigin(0, 1)
    .setScrollFactor(0.4);

  // Слой 5: Ближние здания
  city2plan = this.add
    .tileSprite(0, height as number, width as number, 360, "city2plan")
    .setOrigin(0, 1)
    .setScrollFactor(0.6);

  // Слой 6: Самые близкие здания
  city1plan = this.add
    .tileSprite(0, height as number, width as number, 360, "city1plan")
    .setOrigin(0, 1)
    .setScrollFactor(0.8);

  // Слой 7: Эффекты дыма/тумана
  smog1 = this.add
    .tileSprite(0, 0, width as number, height as number, "smog1")
    .setOrigin(0, 0)
    .setScrollFactor(0.3)
    .setAlpha(0.2)
    .setBlendMode(Phaser.BlendModes.ADD);

  smog2 = this.add
    .tileSprite(0, 0, width as number, height as number, "smog2")
    .setOrigin(0, 0)
    .setScrollFactor(0.4)
    .setAlpha(0.15)
    .setBlendMode(Phaser.BlendModes.OVERLAY);

  // Слой 8: Световые эффекты
  light = this.add
    .tileSprite(0, 0, width as number, height as number, "light")
    .setOrigin(0, 0)
    .setScrollFactor(0.1)
    .setAlpha(0.1)
    .setBlendMode(Phaser.BlendModes.ADD);
}

function updateParallaxBackground() {
  if (gameOver) return;

  // Двигаем фон в зависимости от движения игрока
  const playerVelocityX = player.body?.velocity.x || 0;

  // Если игрок движется, двигаем фон
  if (Math.abs(playerVelocityX) > 0) {
    const direction = playerVelocityX > 0 ? 1 : -1;
    const speed = Math.min(Math.abs(playerVelocityX) * 0.005, 2);

    // Двигаем слои с разной скоростью для параллакс-эффекта
    city1plan.tilePositionX += speed * direction * 0.8;
    city2plan.tilePositionX += speed * direction * 0.6;
    city3plan.tilePositionX += speed * direction * 0.4;
    city4plan.tilePositionX += speed * direction * 0.2;

    // Медленное движение эффектов
    smog1.tilePositionX += speed * direction * 0.05;
    smog2.tilePositionX += speed * direction * 0.03;
    light.tilePositionX += speed * direction * 0.02;
  }
}

function createPlatform(
  platforms: Phaser.Physics.Arcade.StaticGroup,
  x: number,
  y: number,
  frames: number | number[] | number,
  count: number = 1
) {
  let currentX = x;

  for (let i = 0; i < count; i++) {
    if (Array.isArray(frames)) {
      // Если frames - массив, создаем все платформы из массива
      frames.forEach((frame) => {
        platforms.create(currentX, y, "platforms", frame);
        currentX += 24;
      });
    } else {
      // Если frames - число, создаем одну платформу с этим фреймом
      platforms.create(currentX, y, "platforms", frames);
      currentX += 24;
    }
  }
}

function create(this: Phaser.Scene) {
  createParallaxBackground.call(this);

  const platforms = this.physics.add.staticGroup();
  createPlatform(platforms, 0, 590, [0, 1, 2, 3], 9);

  createPlatform(platforms, 150, 490, [0, 1, 2, 3], 2);
  createPlatform(platforms, 420, 320, [0, 1, 2, 3], 3);
  createPlatform(platforms, 0, 390, [0, 1, 2, 3], 3);

  player = this.physics.add.sprite(100, 450, "kitty-idle");

  player.body?.setSize(32, 32); // Обрезаем лишнее (невидимый бокс)

  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "kitty_idle",
    frames: this.anims.generateFrameNumbers("kitty-idle", { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1,
  });

  this.anims.create({
    key: "kitty_walk",
    frames: this.anims.generateFrameNumbers("kitty-walk", {
      start: 0,
      end: 11,
    }),
    frameRate: 20,
    repeat: -1,
  });

  this.anims.create({
    key: "kitty_jump",
    frames: this.anims.generateFrameNumbers("kitty-jump", { start: 0, end: 2 }),
    frameRate: 3,
    repeat: 0,
  });

  this.anims.create({
    key: "kitty_run",
    frames: this.anims.generateFrameNumbers("kitty-run", { start: 0, end: 7 }),
    frameRate: 10,
    repeat: -1,
  });

  if (this.input.keyboard) {
    cursors = this.input.keyboard.createCursorKeys();
  }

  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate((child) => {
    if (child instanceof Phaser.Physics.Arcade.Sprite) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }

    return true;
  });

  bombs = this.physics.add.group();

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "32px",
    color: "#000",
  });

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  this.physics.add.overlap(player, stars, collectStar, undefined, this);

  this.physics.add.collider(player, bombs, hitBomb, undefined, this);
}

function update(this: Phaser.Scene) {
  if (gameOver) return;
  const onGround = player.body?.blocked.down || player.body?.touching.down;

  if (cursors.left.isDown) {
    player.setVelocityX(-100);

    if (onGround) {
      player.setVelocityX(-50);

      player.play("kitty_walk", true);
    }

    onGround && player.play("kitty_walk", true);

    player.flipX = false;
  } else if (cursors.right.isDown) {
    player.setVelocityX(100);

    if (onGround) {
      player.setVelocityX(50);

      player.play("kitty_walk", true);
    }

    player.flipX = true;
  } else {
    player.setVelocityX(0);

    onGround && player.play("kitty_idle", true);
  }

  if (cursors.up.isDown && onGround) {
    player.setVelocityY(-260);

    player.play("kitty_jump");
  }

  if (!onGround && player.body?.velocity.y !== 0) {
    // player.play('kitty_jump');
    // Нужно заменить на анимацию падения и прописать логику чтобы не пересекалась
  }
  // Обновляем параллакс-фон
  updateParallaxBackground();
}

const collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
  playerObj,
  starObj
) => {
  const player = playerObj as Phaser.Physics.Arcade.Sprite;
  const star = starObj as Phaser.Physics.Arcade.Sprite;

  star.disableBody(true, true);

  score += 10;
  scoreText.setText(`Score: ${score}`);

  if (stars.countActive(true) === 0) {
    stars.children.iterate((child) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        child.enableBody(true, child.x, 0, true, true);
      }
      return true;
    });
    const x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
};

const hitBomb: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = function (
  this: Phaser.Scene,
  player
) {
  this.physics.pause();
  if (player instanceof Phaser.Physics.Arcade.Sprite) {
    player.setTint(0xff0000);
  }
  gameOver = true;
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 300 },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

export const game = new Phaser.Game(config);
