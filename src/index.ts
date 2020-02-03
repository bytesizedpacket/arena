import * as PIXI from "pixi.js";
// make vscode ignore these since they don't have typings
// @ts-ignore
import * as Keyboard from "pixi.js-keyboard";
// @ts-ignore
import * as Mouse from "pixi.js-mouse";
import { Entity } from "./entity";
import { State } from "./entity";
import { Player } from "./player";
import { Enemy } from "./enemy";
// TODO: reduce size of bundle.js by following this guide https://medium.com/anvoevodin/how-to-set-up-pixijs-v5-project-with-npm-and-webpack-41c18942c88d

// aliases and helpful variables
const urlParams = new URLSearchParams(window.location.search);
let statusDiv = document.getElementById("status");

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;
let zoomScale: number = parseInt(urlParams.get("zoom")); // URL query parameter ?zoom=_
if (isNaN(zoomScale)) zoomScale = 2; // default to 2 if not specified
let gameState: Function;
export let player: Player;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// these are our assets
let assets = [
  { name: "player", url: "assets/sprites/player.png" },
  { name: "enemy", url: "assets/sprites/enemy.png" }
];
export let entities: Entity[] = []; // this will be populated later

// setup pixi
export let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// disable rightclicking
app.view.addEventListener("contextmenu", e => {
  if (e.type == "contextmenu") e.preventDefault();
});

// main gameplay loop
let gameLoop = function(delta: any) {
  // only if the player is alive...
  if (player.state == State.ACTIVE) {
    // handle input!
    if (Keyboard.isKeyDown("KeyS", "ArrowDown")) {
      player.velY = player.speed;
    } else {
      if (!Keyboard.isKeyDown("KeyW", "ArrowUp")) player.velY = 0;
    }

    if (Keyboard.isKeyDown("KeyD", "ArrowRight")) {
      player.velX = player.speed;
    } else {
      if (!Keyboard.isKeyDown("KeyA", "ArrowLeft")) player.velX = 0;
    }

    if (Keyboard.isKeyDown("KeyW", "ArrowUp")) {
      player.velY = player.speed * -1;
    } else {
      if (!Keyboard.isKeyDown("KeyS", "ArrowDown")) player.velY = 0;
    }

    if (Keyboard.isKeyDown("KeyA", "ArrowLeft")) {
      player.velX = player.speed * -1;
    } else {
      if (!Keyboard.isKeyDown("KeyD", "ArrowRight")) player.velX = 0;
    }

    // move all of our entities
    entities.forEach(function(entity: Entity) {
      entity.spriteObject.x += entity.velX * delta;
      entity.spriteObject.y += entity.velY * delta;
    });
  }

  // make sure every entity handles their ticks
  entities.forEach(function(entity: Entity) {
    entity.tick();
  });
};

// begin loading assets
app.loader
  .add(assets)
  .on("progress", function() {
    statusDiv.innerHTML = app.loader.progress + "% Loading...";
  })
  .load(function() {
    // Set up a new game

    // make stage interactable
    app.stage.interactive = true;

    // tell the user to click the enemies!
    // TODO: make this a popup notification of some kind
    statusDiv.innerHTML = "Click the enemies!";

    // run this for each asset we have loaded
    assets.forEach(function(asset) {
      // create the sprite object
      let currentSprite = new PIXI.Sprite(
        app.loader.resources[asset.name].texture
      );

      // keep this consistent
      currentSprite.name = asset.name;

      // make sure we can click it
      currentSprite.interactive = true;

      switch (asset.name) {
        case "player":
          // set up player object with this sprite
          player = new Player(currentSprite, app);
          entities.push(player);

          // put sprite in the center of the stage
          currentSprite.x = app.renderer.width / 2 - currentSprite.width / 2;
          currentSprite.y = app.renderer.height / 2 - currentSprite.height / 2;
          break;
        case "enemy":
          // TODO: spawn multiple enemies and place them accordingly
          let enemy = new Enemy(currentSprite, app, 0.7); // make them slightly slower than the player
          entities.push(enemy);

          break;
      }

      // add sprite to stage
      app.stage.addChild(currentSprite);

      // scale view
      app.renderer.resize(gameWidth * zoomScale, gameHeight * zoomScale);
      app.stage.scale.set(zoomScale, zoomScale);

      // begin game loop
      gameState = gameLoop;
      app.ticker.add(delta => tick(delta));
    });
  });

// keeps all of our shit running
let tick = function(delta: any) {
  gameState(delta);
  Keyboard.update();
  Mouse.update();
};

// check for collision between two sprites
export let checkSpriteCollision = function(
  sprite1: PIXI.Sprite,
  sprite2: PIXI.Sprite
) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  // alsdjfkafds
  let r1 = {
    //Find the center points of each sprite
    centerX: sprite1.x + sprite2.width / 2,
    centerY: sprite1.y + sprite1.height / 2,
    //Find the half-widths and half-heights of each sprite
    halfWidth: sprite1.width / 2,
    halfHeight: sprite1.height / 2
  };

  let r2 = {
    //Find the center points of each sprite
    centerX: sprite2.x + sprite2.width / 2,
    centerY: sprite2.y + sprite2.height,
    //Find the half-widths and half-heights of each sprite
    halfWidth: sprite2.width / 2,
    halfHeight: sprite2.height / 2
  };

  //hit will determine whether there's a collision
  hit = false;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};
