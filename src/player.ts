// main player object
export class Player {
  public spriteObject: PIXI.Sprite;
  public speed: number; // default 2 if not specified

  constructor(spriteObject: PIXI.Sprite, speed?: number) {
    this.spriteObject = spriteObject;
    if (speed) {
      this.speed = speed;
    } else {
      this.speed = 2;
    }
  }
}
