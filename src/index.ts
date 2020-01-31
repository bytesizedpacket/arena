///<reference types="pixi.js"/>
import * as PIXI from "pixi.js";

// game properties
let gameWidth: number = 256;
let gameHeight: number = 256;

// these are our assets
let assets: string[] = ["assets/sprites/jigglypuff.png"];
let sprites: PIXI.Sprite[] = []; // this will be populated later

// setup pixi
let app = new PIXI.Application({ width: gameWidth, height: gameHeight });
document.body.appendChild(app.view);

// this won't run until after our assets have loaded
let setup = function() {
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
  });
};

// begin loading assets
app.loader.add(assets).load(setup);
