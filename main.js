import "./style.css";
import Phaser from "phaser";

//size and speed constants
const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 300;


//html query selectors
const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");
const gameWinLoseSpan = document.querySelector("#gameWinLoseSpan");
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan");

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
    this.textScore;
    this.textTime;
    this.timedEvent;
    this.remainingTime;
    this.coinMusic;
    this.bgMusic;
    this.emitter;
  }


  //-------------------------------//
  //2. load any assets
  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
    this.load.audio("bgMusic", "/assets/bgMusic.mp3");
    this.load.audio("coin", "/assets/coin.mp3");
    this.load.image("money", "/assets/money.png")

  }


  //------------------------------//

  //3. develop logic
  create() {

    this.scene.pause("scene-game")

    //create sounds
    this.coinMusic = this.sound.add("coin");
    this.bgMusic =this.sound.add("bgMusic");
    this.bgMusic.play();

    //add background and basket w/ physics
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // Makes the basket hit box smaller and realistic
    this.player.setSize(80, 15).setOffset(10, 70);

    //Another, more "reactive" way to do it
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

    //create place to keep score
    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#000000",
    });

    //place to show timer
    this.textTime = this.add.text(10, 10, "Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    //Set timer countdown in miliseconds
    this.timedEvent = this.time.delayedCall(30000, this.gameOver, [], this);

    this.emitter=this.add.particles(0,0,"money",{
      speed:100,
      gravityY:speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    })

    // money emitter follows the basket
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 10);



  }

//------------------------------------------- //

  //5. What happens
  update() {
    //gets time left
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Time - ${Math.round(this.remainingTime).toString()}`
    );

    //moves apple down and changes spawn point
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

  // logic for when apple hits basket
  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);

    this.emitter.start();

    //plays coin sound when apple hits
    this.coinMusic.play();

    // turn this ON to stop annoying noises!! 
    // this.coinMusic.stop();
  }

  gameOver() {
    this.sys.game.destroy(true);
    if(this.points >= 10) {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Win"
    }
    else {
      gameEndScoreSpan.textContent = this.points
      gameWinLoseSpan.textContent = "Lose"
    }

    gameEndDiv.style.display="flex"
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


//START button
gameStartBtn.addEventListener("click", ()=>{
  gameStartDiv.style.display="none"
  game.scene.resume("scene-game")
})
