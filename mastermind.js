/*
Mastermind game:

6 possible colors (R, O, Y, G, B, P)

player 1 chooses a secret code (4 colors, can have duplicates, in a specific order)

player 2 has 10 tries to guess the secret code

after each guess, player 1 “scores” the guess, as follows:
1 black peg for each exact match (right color in the right spot)
1 white peg for each color match (right color in the wrong spot)

*/
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getUserInput = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const colors = ["R", "O", "Y", "G", "B", "P"];

function getRandomInt() {
  min = 0;
  max = 6;
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getWinnerCombo() {
  const winnerCombo = [];
  for (i = 0; i < 4; i++) {
    winnerCombo.push(colors[getRandomInt()]);
  }
  return winnerCombo;
}

const winnerCombo = getWinnerCombo();
const rounds = [];

console.log("Welcome to Mastermind!");

const main = async () => {
  console.log(winnerCombo);
  for (let i = 0; i < 10; i++) {
    // Get user guess (userInput = "Y G B P")
    let userInput = await getUserInput(`Round ${i + 1}: What is your pick? `);
    // Check user input
    const guess = userInput.split(" ");
    let regex = /^([ROYGBP] ){3}([ROYGBP])$/gi;
    while (!regex.test(userInput)) {
      console.log("Invalid input! Only R O Y G B P accepted.");
      userInput = await getUserInput(`Round ${i + 1}: Please try again: `);
    }

    const thisRoundWinnerCombo = [...winnerCombo];

    // Check against winnerCombo
    let blackPegs = 0;
    let whitePegs = 0;
    // Check for black pegs
    guess.map((peg, index) => {
      if (peg === thisRoundWinnerCombo[index]) {
        blackPegs++;
        thisRoundWinnerCombo[index] = "X";
      }
    });

    // Check for white pegs
    guess.map((peg) => {
      if (thisRoundWinnerCombo.find((winnerPeg) => winnerPeg === peg)) {
        const index = thisRoundWinnerCombo.findIndex(
          (winnerPeg) => winnerPeg === peg
        );
        if (index >= 0) {
          thisRoundWinnerCombo[index] = "Z";
          whitePegs++;
        }
      }
    });

    rounds.push(
      "#" +
        (i + 1) +
        " Your guess: " +
        userInput +
        " " +
        "Black pegs: " +
        blackPegs +
        " White pegs: " +
        whitePegs
    );

    console.log("Black pegs: ", blackPegs);
    console.log("White pegs: ", whitePegs);
    console.log("--------------");
    if (blackPegs === 4) {
      console.log("You Won!");
      return rl.close();
    }
    console.log("Rounds so far:");
    rounds.map((roundInfo) => console.log(roundInfo));
  }
  console.log("You lost!");
  return rl.close();
};
main();
