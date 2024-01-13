import "./style.css";
import Phaser from "phaser";

//size and speed constants
const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;

//Build the scene
class GameScene extends Phaser.Scene {

  //1. construct components of the game
  constructor() {
    super("scene-game");
    this.player; //the basket
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.target; // the apple
    this.points = 0;
  }

  //2. load any assets
  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }

  //3. develop logic
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // Makes the basket hitbox smaller and realistic
    this.player.setSize(80, 15).setOffset(10, 70);

        //A more "reactive" way to do it
    // this.player.setSize(this.player.width-this.player.width/4, this.player.height/6).
    // setOffset(this.player.width/10, this.player.height - this.player.height/10);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);

    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );

    this.cursor = this.input.keyboard.createCursorKeys();
  }

  //5. What happens
  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }


  //   callback functions  // ||||||
  // get random x coordinate for each new apple
  getRandomX() {
    return Math.floor(Math.random() * 480);
  }

  // points will increment when the apple reaches y=0 AND contains the randomly generated X coordinate
  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
  }
}



const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};


const game = new Phaser.Game(config);
