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

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;
let zoomScale: number = 1; // how much to zoom the viewport
let gameState: Function;
export let player: Player;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// aliases and helpful variables
let statusDiv = document.getElementById("status");

// these are our assets
let assets = [
  { name: "player", url: "assets/sprites/player.png" },
  { name: "enemy", url: "assets/sprites/enemy.png" }
];
let entities: Entity[] = []; // this will be populated later

// setup pixi
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// disable rightclicking
app.view.addEventListener("contextmenu", e => {
  if (e.type == "contextmenu") e.preventDefault();
});

// main gameplay loop
let gameLoop = function(delta: any) {
  let playerSprite = player.spriteObject;

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

    if (Keyboard.isKeyDown("KeyB")) {
      player.health -= 1;
    }

    // actually move the sprite
    playerSprite.x += player.velX * delta;
    playerSprite.y += player.velY * delta;
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

    // clear our status thingy
    statusDiv.innerHTML = "Press B to deplete health";

    // run this for each asset we have loaded
    assets.forEach(function(asset) {
      // create the sprite object
      let currentSprite = new PIXI.Sprite(
        app.loader.resources[asset.name].texture
      );

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
          let enemy = new Enemy(currentSprite, app);
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
