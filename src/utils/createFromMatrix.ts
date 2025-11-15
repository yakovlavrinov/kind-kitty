

export const createFromMatrix = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  texture: string,
  tileSize: number,
  matrix: number[][]
) => {
  const group = scene.physics.add.staticGroup();

  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < matrix[row].length; column++) {
      const frame = matrix[row][column];

      if (frame !== null && frame !== undefined) {
        group.create(x + column * tileSize, y + row * tileSize, texture, frame);
      }
    }
  }
console.log(group)
  return group;
};
