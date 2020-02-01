import { Sprite } from "pixi.js";
import { Graphics } from "pixi.js";
import { Container } from "pixi.js";
import { Application } from "pixi.js";

export enum State {
  ACTIVE,
  DEAD
}

// generic entity class
export class Entity {
  public spriteObject: Sprite;
  public healthBar: Container;
  public rearHealthBar: Graphics;
  public frontHealthBar: Graphics;
  public state: State;
  public health: number = 100;
  public speed: number; // default 2 if not specified
  public velX: number = 0; // velocity X
  public velY: number = 0; // velocity Y

  constructor(
    spriteObject: Sprite,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    this.spriteObject = spriteObject;

    if (speed) {
      this.speed = speed;
    } else {
      this.speed = 2;
    }

    this.velX = 0;
    this.velY = 0;

    // set up our health bar (enabled by default)
    if (displayHealthBar == undefined || displayHealthBar) {
      this.healthBar = new Container();

      // create the back red rectangle
      this.rearHealthBar = new Graphics();
      this.rearHealthBar.beginFill(0xff3300);
      this.rearHealthBar.drawRect(0, 0, this.spriteObject.width, 2); // same width as the sprite
      this.rearHealthBar.endFill();
      this.healthBar.addChild(this.rearHealthBar);

      //Create the front green rectangle
      this.frontHealthBar = new Graphics();
      this.frontHealthBar.beginFill(0x00ff00);
      this.frontHealthBar.drawRect(0, 0, this.spriteObject.width, 2);
      this.frontHealthBar.endFill();
      this.healthBar.addChild(this.frontHealthBar);

      app.stage.addChild(this.healthBar);
    }

    // initiate as alive
    this.state = State.ACTIVE;
  }

  // keep healthbar under player and displaying correct amount of health
  public updateHealthBar() {
    // make sure we actually have a health bar
    if (this.healthBar != undefined) {
      // put 2px it under the player
      this.healthBar.position.set(
        this.spriteObject.x,
        this.spriteObject.y + this.spriteObject.height + 2
      );

      // change size of green to represent current health
      this.frontHealthBar.width =
        (this.health * this.rearHealthBar.width) / 100;
    }
  }

  // runs every frame
  public tick() {
    this.updateHealthBar();

    // uh oh spaghettios we're dead
    if (this.health <= 0) {
      this.health = 0; // prevents the healthbar from descending into deader-than-dead
      this.state = State.DEAD;
    }
  }
}
