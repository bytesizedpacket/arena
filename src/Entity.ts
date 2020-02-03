import { Sprite } from "pixi.js";
import { Graphics } from "pixi.js";
import { Container } from "pixi.js";
import { Application } from "pixi.js";
import { entities } from "./index";
import { app } from "./index";

export enum STATE {
  ACTIVE,
  INACTIVE, // won't move or do anything
  DEAD // will remove itself from the game/memory
}

export enum MOVEMENT_TYPE {
  DEFAULT, // regular movement
  FLY // "orbit" movement
}

// generic entity class
export class Entity {
  public spriteObject: Sprite;
  public healthBar: Container;
  public movementType: MOVEMENT_TYPE;
  public outlineHealthBar: Graphics;
  public rearHealthBar: Graphics;
  public frontHealthBar: Graphics;
  public state: STATE;
  public health: number = 100;
  public speed: number;
  public velX: number = 0; // velocity X
  public velY: number = 0; // velocity Y

  constructor(
    spriteName: string,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean,
    movementType?: MOVEMENT_TYPE
  ) {
    // create our sprite with the given name
    let currentSprite = new Sprite(app.loader.resources[spriteName].texture);

    // keep this consistent
    currentSprite.name = spriteName;

    // make sure we can click it
    currentSprite.interactive = true;

    this.spriteObject = currentSprite;

    // default to 2 speed if not specified
    if (speed) {
      this.speed = speed;
    } else {
      this.speed = 1;
    }

    this.speed = this.speed * 2; // since 1 is too slow, but I like 1 being the player speed

    this.velX = 0;
    this.velY = 0;

    // set up our health bar (enabled by default)
    if (displayHealthBar == undefined || displayHealthBar) {
      this.healthBar = new Container();

      // create the outline rectangle
      this.outlineHealthBar = new Graphics();
      this.outlineHealthBar.beginFill(0x000000);
      this.outlineHealthBar.drawRect(0, 0, this.spriteObject.width + 2, 4);
      this.outlineHealthBar.endFill();
      this.healthBar.addChild(this.outlineHealthBar);

      // create the back red rectangle
      this.rearHealthBar = new Graphics();
      this.rearHealthBar.beginFill(0xff3300);
      this.rearHealthBar.drawRect(1, 1, this.spriteObject.width, 2); // same width as the sprite
      this.rearHealthBar.endFill();
      this.healthBar.addChild(this.rearHealthBar);

      //Create the front green rectangle
      this.frontHealthBar = new Graphics();
      this.frontHealthBar.beginFill(0x00ff00);
      this.frontHealthBar.drawRect(1, 1, this.spriteObject.width, 2);
      this.frontHealthBar.endFill();
      this.healthBar.addChild(this.frontHealthBar);

      app.stage.addChild(this.healthBar);
    }

    if (movementType) {
      this.movementType = movementType;
    } else {
      this.movementType = MOVEMENT_TYPE.DEFAULT;
    }

    // initiate as alive
    this.state = STATE.ACTIVE;

    // make it clickable (calls this.onClick)
    // this is jank
    // also, this is jank
    let tthis = this;
    this.spriteObject.on("mousedown", function(e: any) {
      tthis.onClick(e);
    });

    // add it to the game
    app.stage.addChild(this.spriteObject);
    entities.push(this);
  }

  // keep healthbar under entity and displaying correct amount of health
  public updateHealthBar() {
    // make sure we actually have a health bar
    if (this.healthBar != undefined) {
      // put 2px it under the entity
      this.healthBar.position.set(
        this.spriteObject.x - 1,
        this.spriteObject.y + this.spriteObject.height + 2
      );

      // change size of green to represent current health
      this.frontHealthBar.width =
        (this.health * this.rearHealthBar.width) / 100;
    }
  }

  // runs every frame
  // this DOES NOT GET CALLED if the state is INACTIVE
  public tick() {
    this.updateHealthBar();

    // uh oh spaghettios it's dead
    if (this.health <= 0) {
      this.health = 0; // prevents the healthbar from descending into deader-than-dead
      this.state = STATE.DEAD;
    }
  }

  // it has been clicked!
  public onClick(e?: any) {
    // generic entity click behavior
    // 404 not found
  }

  // destroy this entity from the game :c
  public destroy() {
    app.stage.removeChild(this.spriteObject);
    if (this.healthBar) {
      app.stage.removeChild(this.healthBar);
      this.healthBar.destroy();
    }
    entities.splice(entities.indexOf(this), 1);
    this.spriteObject.destroy();
  }
}
