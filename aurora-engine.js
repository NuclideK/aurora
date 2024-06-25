class Aurora {
  constructor(char, enemy) {
    this.char = char;
    this.enemy = enemy;
  }

  calculateBestMove(cells) {
    // yeah so ok here's where it gets funny, I have no idea what I'm doing, but fuck it we ball
    // What I do know is that we need to make a tree of the possibilities right
    // There's a few ways to implement this from what I can tell, what we could do is cook up the entire gametree at the beginning
    // But also that seems like a boring thing to do, and also more expensive since we can cut half of the entire gametree by simply giving the first move to the player first
    // From there, I suppose it'd be most computationally efficient to calculate the entire tree from there,

    // BUT I am lazy, so I think I'll just be calculating it each time a move is made
    // That is terribly inefficient, but I have a fast CPU and 0 fucks to give.

    // well, first things first, we should check out all available moves:
    let possibleMoves = {};
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === null) {
        // Okay, so this is a possible move, now we need to calculate which type of move would be the best....
        // I suppose for this we just need to check if we win or not, and if it had an existing value
        let cellsWithMoveDone = this.statePlusMove(cells, i, this.char);
        possibleMoves[i] = {
          value: this.evaluateStateValue(cellsWithMoveDone, false, 0), // OKAY HERE IS WHERE IT GETS BS I WILL START CRYING HELP ME
        };
      }
    }

    // well well well, let's see which is the best move then I guess lmao
    let highestMove = null;
    let highestValue = -2;
    let lowestValue = 2;
    for (const moveIndex in possibleMoves) {
      const move = possibleMoves[moveIndex];
      if (highestValue < move.value) {
        highestValue = move.value;
        highestMove = moveIndex;
      }
      if (lowestValue > move.value) {
        lowestValue = move.value;
      }
    }
    console.table(possibleMoves);
    return highestMove;
  }

  statePlusMove(cells, move, char) {
    let newState = [...cells];
    newState[move] = char;
    return newState;
  }

  evaluateStateValue(cells, isRobotTurn, depth) {
    // I cried while writing this :)
    depth = depth + 1;
    let winner = this.checkwin(cells);
    if (winner == this.char) {
      return 1;
    }
    if (winner) {
      return -1;
    }
    if (cells.every((cell) => cell !== null)) {
      return 0;
    }
    let possibleMoves = {};
    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === null) {
        let stateWithTheMoveDone = this.statePlusMove(
          cells,
          i,
          isRobotTurn ? this.char : this.enemy
        );
        possibleMoves[i] = {
          value: this.evaluateStateValue(
            stateWithTheMoveDone,
            !isRobotTurn,
            depth
          ),
          stateWithTheMoveDone,
        };
      }
    }

    let highestValue = -2;
    let lowestValue = 2;
    for (const moveIndex in possibleMoves) {
      const move = possibleMoves[moveIndex];
      if (highestValue < move.value) {
        highestValue = move.value;
      }
      if (lowestValue > move.value) {
        lowestValue = move.value;
      }
    }
    if (!isRobotTurn) return lowestValue;
    return highestValue;
  }

  checkwin(cells) {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winningCombinations.length; i++) {
      let [a, b, c] = winningCombinations[i];
      if (cells[a] !== null && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  }
}
