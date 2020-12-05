//rename variables
var Neat    = window.neataptic.Neat;
// var Methods = window.neataptic.Methods;
// var Config  = window.neataptic.Config;
var Architect = window.neataptic.architect;

console.log(Architect)

//variables

var gameArray = [];
var neat;


//GAME SETTINGS

var PLAYER_AMOUNT = 15;
var MUTATION_RATE = 0.2;
var ELITISM_PERCENT = 0.5;
var NUM_INPUTS = 2;
var START_HIDDEN_SIZE = 0;
var NUM_OUTPUTS = 1;


function setup() {
  createCanvas(windowWidth, windowHeight);

    //create the ai

    neat = new Neat(
        NUM_INPUTS,
        NUM_OUTPUTS,
        null,
        {
          popsize: PLAYER_AMOUNT,
          mutationRate: MUTATION_RATE,
          elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
          network: new Architect.Random(NUM_INPUTS, START_HIDDEN_SIZE, NUM_OUTPUTS)
        }
      );


    //we have to create 1 game for each of our ai
    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 3; j++) {
            gameArray.push(new Game(windowWidth/5, windowHeight/3, windowWidth/10 + i * windowWidth/5, windowHeight/6 + j * windowHeight/3, i*3 + j + 1))
        }
    }

    var c = 0;
    for(var genome in neat.population){
        genome = neat.population[genome];
        gameArray[c].setBrain(genome);
        c += 1;
    }
}

function draw() {
  background(256);


  //inside draw, there are two things that we can be doing:
  //1: have the AI play the game
  //2: reset the population since all of the AI are dead
    
    var allDead = true; //assume all of the AI are dead
    var isDrawing = true;

  for(var i = 0; i < gameArray.length; i++ ) {
      if(!gameArray[i].isDead) {
          allDead = false;
        //   isDrawing = false;
      }
      gameArray[i].update(!gameArray[i].isDead);
  }

  //all of the AI are dead so we now have to reset the population
  if(allDead) {

    console.log('Generation:', neat.generation, '- average score:', neat.getAverage());

    neat.sort();
    var newPopulation = [];

    // Elitism
    for(var i = 0; i < neat.elitism; i++){
        newPopulation.push(neat.population[i]);
    }

    // Breed the next individuals
    for(var i = 0; i < neat.popsize - neat.elitism; i++){
        newPopulation.push(neat.getOffspring());
    }

    // Replace the old population with the new population
    neat.population = newPopulation;
    neat.mutate();

    neat.generation++;

    //update all of the games

    var c = 0;

    for(var genome in neat.population){
        genome = neat.population[genome];
        gameArray[c].setBrain(genome);
        gameArray[c].reset();
        c += 1;
    }

  }



  if(keyIsDown(LEFT_ARROW)) {
    gameArray[0].moveSlider(true)
  } else if(keyIsDown(RIGHT_ARROW)) {
    gameArray[0].moveSlider(false)
  }
  
}
