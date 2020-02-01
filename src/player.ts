import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity } from "./entity";

// useful variables
let statusDiv = document.getElementById("status");

// main player object
export class Player extends Entity {
  public score: number;
  constructor(
    spriteObject: Sprite,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean
  ) {
    super(spriteObject, app, speed, displayHealthBar);
    this.score = 0;
  }

  // this will run every frame
  public tick() {
    super.tick();
    if (this.health <= 0) {
      statusDiv.innerHTML = "Uh-oh spaghetti-o's! You're <b>dead.</b>";
    }
  }

  // sets the player's current score
  public setScore(score: number) {
    this.score = score;
    // TODO: render this within the game window
    statusDiv.innerHTML = "Current Score: " + this.score;
  }
}
