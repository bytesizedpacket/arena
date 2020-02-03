import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity, STATE, MOVEMENT_TYPE } from "./entity";
import { player } from "./index";
import { entities, checkSpriteCollision, currentDelta } from "./index";

// main enemy object
export class Enemy extends Entity {
  constructor(
    spriteName: string,
    app: Application,
    speed?: number,
    displayHealthBar?: boolean,
    movementType?: MOVEMENT_TYPE
  ) {
    super(spriteName, app, speed, displayHealthBar, movementType);
  }

  // this will run every frame
  public tick() {
    super.tick();
    // oh no it fucking died :c
    if (this.health <= 0) {
      player.setScore(player.score + 1); // yay

      this.destroy(); // :c
    } else {
      // if you have reached this point, the thing isn't dead

      // direction towards player
      let toPlayerX = player.spriteObject.x - this.spriteObject.x;
      let toPlayerY = player.spriteObject.y - this.spriteObject.y;

      // normalize
      let toPlayerLength = Math.sqrt(
        toPlayerX * toPlayerX + toPlayerY * toPlayerY
      );
      toPlayerX = toPlayerX / toPlayerLength;
      toPlayerY = toPlayerY / toPlayerLength;

      // different movement based on enemy type
      switch (this.movementType) {
        case MOVEMENT_TYPE.DEFAULT:
          this.velX = toPlayerX * this.speed;
          this.velY = toPlayerY * this.speed;
          break;
        case MOVEMENT_TYPE.FLY:
          this.velX += (toPlayerX * this.speed) / 15;
          this.velY += (toPlayerY * this.speed) / 15;
          break;
      }

      // remember these for a sec
      let prevX = this.spriteObject.x;
      let prevY = this.spriteObject.y;

      // actually move the sprite so we can check for collision
      this.spriteObject.x += this.velX * currentDelta;
      this.spriteObject.y += this.velY * currentDelta;

      // are we now intersecting with something?
      let tthis = this; // gotta work around this jank lol
      entities.forEach(function(entityB: Entity) {
        if (entityB instanceof Enemy && entityB != tthis) {
          if (checkSpriteCollision(entityB.spriteObject, tthis.spriteObject)) {
            let toEnemyX = entityB.spriteObject.x - tthis.spriteObject.x;
            let toEnemyY = entityB.spriteObject.y - tthis.spriteObject.y;
            let toEnemyLength = Math.sqrt(
              toEnemyX * toEnemyX + toEnemyY * toEnemyY
            );
            toEnemyX = toEnemyX / toEnemyLength;
            toEnemyY = toEnemyY / toEnemyLength;

            // move AWAY from the enemy for a frame
            tthis.velX = toEnemyX * -1 * tthis.speed;
            tthis.velY = toEnemyY * -1 * tthis.speed;
          }
        }
      });

      // we don't *actually* move the entity here, we leave this to the main game loop
      this.spriteObject.position.set(prevX, prevY);
    }
  }

  // we have been clicked!
  public onClick(e?: Event) {
    super.onClick(e);
    if (player.state == STATE.ACTIVE) this.health -= 25;
  }
}
