class Game {
    constructor(windowWidth, windowHeight, centerX, centerY, gameNumber) {

        //window
        this.windowHeight = windowHeight;
        this.windowWidth = windowWidth;
        this.centerX = centerX;
        this.centerY = centerY;
        this.gameNumber = gameNumber;
        this.brain = null;
        this.reset();

    }

    setBrain(newBrain) {
        console.log(newBrain)
        this.brain = newBrain;
    }

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }


    update(isDrawing) {

        //update physics


        if(!this.isDead) {

            if(this.brain != null) {
                var inputs = [];

                // console.log(this.xBall);
                // console.log(this.yBall);
                // console.log(this.centerX);
                // console.log(this.centerY);
                // console.log(this.windowWidth);
                // console.log(this.windowHeight);

                //inputs are x of ball, y of ball, x of paddle, y of paddle
                inputs.push((this.xBall - (this.centerX - this.windowWidth/2)) / this.windowWidth) //this normalizes the input
                // inputs.push((this.yBall - (this.centerY - this.windowHeight/2)) / this.windowHeight) 
                inputs.push((this.xPaddle - (this.centerX - this.windowWidth/2)) / this.windowWidth) //this normalizes the input
                // inputs.push((this.yPaddle - this.centerY) / this.windowHeight) 
                // console.log("game: " + this.gameNumber)
                // console.log(inputs)
                // console.log(this.brain)
                var output = this.brain.activate(inputs);
                console.log(output[0])
                if(output[0] > 0.6) {
                    this.moveSlider(false)
                } else {
                    this.moveSlider(true)
                }
            }

            // Ball bounces off walls
            this.xBall += this.xBallChange;
            this.yBall += this.yBallChange;

            if (this.xBall < this.centerX - this.windowWidth/2 + 0.5*this.diameter || 
                this.xBall > this.centerX + this.windowWidth/2 - 0.5*this.diameter) {
                this.xBallChange *= -1;
            }
            if (this.yBall < this.centerY - this.windowHeight/2 + 0.5*this.diameter) {
                    this.yBallChange *= -1;
            } else if(this.yBall > this.centerY + this.windowHeight/2 - 0.5*this.diameter) {
                //game over
                this.isDead = true;
                this.brain.score = this.fitness;
            }

            // Detect collision with paddle
            if ((this.xBall > this.xPaddle &&
                this.xBall < this.xPaddle + this.paddleWidth) &&
            (this.yBall + (this.diameter/2) >= this.yPaddle && 
            this.yBall + (this.diameter/2) <= this.yPaddle + this.paddleHeight
            
            )
            
            ) {
                this.yBallChange *= -1;
                this.score++;
                this.fitness += 500; //bonus for hitting
            }

            var xDistance = Math.abs(this.xPaddle - this.xBallChange);
            xDistance = (this.windowWidth - xDistance) / this.windowWidth;
            this.fitness += xDistance * 5;


        }



        fill(0, 0, 0);
        noStroke();
        rect(this.centerX - this.windowWidth/2, this.centerY - this.windowHeight/2, this.windowWidth, this.windowHeight);
        
        noFill();
        stroke(255, 0, 0);
        rect(this.centerX - this.windowWidth/2, this.centerY - this.windowHeight/2, this.windowWidth, this.windowHeight);


        //draw everything

        if(isDrawing) {

            // Draw ball
            fill(255, 0, 255);
            noStroke();
            ellipse(this.xBall, this.yBall, this.diameter, this.diameter);

            // Draw paddle
            fill(0, 255, 255);
            noStroke();
            rect(this.xPaddle, this.yPaddle, this.paddleWidth, this.paddleHeight);

            // Draw score
            fill(0, 255, 255);
            textSize(24);
            text("Score for Game " + this.gameNumber + ": " + this.score, this.centerX - this.windowWidth/2 + 10, this.centerY - this.windowHeight/2 + 25);
        }

    }

    moveSlider(moveLeft) {
        if(moveLeft && this.xPaddle > this.centerX - this.windowWidth/2 + this.paddleWidth/2) {
            this.xPaddle -= 5;
        } else if (this.xPaddle < this.centerX + this.windowWidth/2 - 2 * this.paddleWidth) {
            this.xPaddle += 5;
        } else {
            this.fitness -= 2;
        }
    }

    reset() {


        // Variables for the paddle
        this.paddleWidth = 50;
        this.paddleHeight = 10;

        this.xPaddle = this.centerX - this.paddleWidth/2;
        this.yPaddle = this.centerY + this.windowHeight/2 - this.paddleHeight - 50;

        // Variables for the ball
        this.diameter = 25;

        this.xBall = this.centerX;
        this.yBall = this.centerY;

        this.xBallChange = (Math.random() < 0.5) && this.randomNumber(-3.5, -2.5) || this.randomNumber(2.5, 3.5);

        this.yBallChange = -Math.sqrt(25 - Math.pow(this.xBallChange, 2));

        //game
        this.score = 0;
        this.fitness = 0;
        this.isDead = false;
    }

}
