import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity } from "./entity";

// useful variables
let statusDiv = document.getElementById("status");
export enum State {
  ACTIVE,
  DEAD
}

// main player object
export class Player extends Entity {
  constructor(
    spriteObject: Sprite,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    super(spriteObject, app, speed, displayHealthBar);
  }

  public tick() {
    super.tick();
    if (this.health <= 0) {
      statusDiv.innerHTML = "Uh-oh spaghetti-o's! You're <b>dead.</b>";
    }
  }
}
