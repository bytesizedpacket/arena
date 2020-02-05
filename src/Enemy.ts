import { Sprite } from "pixi.js";
import { Application } from "pixi.js";
import { Entity, STATE, MOVEMENT_TYPE } from "./Entity";
import { player } from "./index";
import {
  entities,
  checkSpriteCollision,
  currentDelta,
  viewHeight,
  viewWidth
} from "./index";

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
      let toPlayerX = player.position.x - this.position.x;
      let toPlayerY = player.position.y - this.position.y;

      // normalize
      let toPlayerLength = Math.sqrt(
        toPlayerX * toPlayerX + toPlayerY * toPlayerY
      );

      toPlayerX = toPlayerX / toPlayerLength;
      toPlayerY = toPlayerY / toPlayerLength;

      // prevent enemies from colliding with each other
      // don't do this if we can fly
      if (this.movementType != MOVEMENT_TYPE.FLY) {
        // are we now intersecting with something?
        let tthis = this; // gotta work around this jank lol
        entities.forEach(function(entityB: Entity) {
          if (
            entityB instanceof Enemy &&
            entityB != tthis &&
            entityB.movementType != MOVEMENT_TYPE.FLY
          ) {
            if (checkSpriteCollision(entityB, tthis)) {
              let toEnemyX = entityB.position.x - tthis.position.x;
              let toEnemyY = entityB.position.y - tthis.position.y;
              let toEnemyLength = Math.sqrt(
                toEnemyX * toEnemyX + toEnemyY * toEnemyY
              );
              toEnemyX = toEnemyX / toEnemyLength;
              toEnemyY = toEnemyY / toEnemyLength;

              // bump the enemy away from what it just collided with
              tthis.velX = toEnemyX * -0.5 * tthis.speed;
              tthis.velY = toEnemyY * -0.5 * tthis.speed;
            }
          }
        });
      }

      // collide with walls
      this.checkMapCollision();

      // actually move the sprite
      this.position.x += this.velX * currentDelta;
      this.position.y += this.velY * currentDelta;

      // prepare velocity for next frame
      // different movement based on enemy type
      switch (this.movementType) {
        case MOVEMENT_TYPE.DEFAULT:
          // we apply friction so it doesn't get stupid fast
          this.velX -= this.velX * 0.1;
          this.velY -= this.velY * 0.1;

          // TODO: make aggro distance a property of the enemy
          if (toPlayerLength < 100) {
            this.velX += (toPlayerX * this.speed) / 15;
            this.velY += (toPlayerY * this.speed) / 15;
          }
          break;
        case MOVEMENT_TYPE.FLY:
          // friction!
          this.velX -= this.velX * 0.02;
          this.velY -= this.velY * 0.02;
          if (toPlayerLength < 100) {
            this.velX += (toPlayerX * this.speed) / 15;
            this.velY += (toPlayerY * this.speed) / 15;
          }
          break;
      }
    }
  }
}
