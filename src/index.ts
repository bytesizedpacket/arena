///<reference types="pixi.js"/>
import * as PIXI from "pixi.js";

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;
let gameState: Function;

// aliases and helpful variables
let statusDiv = document.getElementById("status");

// these are our assets
let assets: string[] = ["assets/sprites/jigglypuff.png"];
let sprites: PIXI.Sprite[] = []; // this will be populated later

// setup pixi
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// main gameplay loop
let gameLoop = function(delta: any) {
  sprites[0].x += 0.5; // look at her go
  if (sprites[0].x > app.view.width) sprites[0].x = sprites[0].width * -1; // wrap around
};

// this won't run until after our assets have loaded
let setup = function() {
  // clear our status thingy
  statusDiv.innerHTML = "";

  // run this for each asset we have loaded
  assets.forEach(function(asset) {
    // create the sprite object
    let currentSprite = new PIXI.Sprite(app.loader.resources[asset].texture);

    // set the name of the sprite based on the filename of its texture
    currentSprite.name = asset
      .substr(asset.lastIndexOf("/") + 1)
      .replace(".png", "");

    // populate our sprite array with this
    sprites.push(currentSprite);

    // add sprite to stage
    app.stage.addChild(currentSprite);

    // begin game loop
    gameState = gameLoop;
    app.ticker.add(delta => tick(delta));
  });
};

// begin loading assets
app.loader
  .add(assets)
  .on("progress", function() {
    statusDiv.innerHTML = app.loader.progress + "% Loading...<br/>";
  })
  .load(setup);

// runs 60 times per second
let tick = function(delta: any) {
  gameState(delta);
};
