// main player object
export class Player {
  public spriteObject: PIXI.Sprite;
  public speed: number; // default 2 if not specified
  public velX: number = 0; // velocity X
  public velY: number = 0; // velocity Y

    speed?: number,
    this.spriteObject = spriteObject;
    if (speed) {
      this.speed = speed;
    } else {
      this.speed = 2;
    }

    this.velX = 0;
    this.velY = 0;
  }
}
