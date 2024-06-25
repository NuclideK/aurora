document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const resetButton = document.getElementById("reset");
  const cells = Array(9).fill(null);
  let playerTurn = false;
  let playerIcon = "X";
  let cpuIcon = "O";
  let gameFrozen = false;

  function createBoard() {
    board.innerHTML = "";
    cells.forEach((_, index) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = index;
      cell.addEventListener("click", handlePlayerMove);
      board.appendChild(cell);
    });
  }

  function CPUPlay() {
    let move = aurora.calculateBestMove(cells);
    computerInputMove(move);
  }

  function handlePlayerMove(event) {
    if (gameFrozen) return;
    if (!playerTurn) return;
    const index = event.target.dataset.index;
    if (cells[index] === null) {
      inputMove(playerIcon, index);
      if (checkWinner()) {
        gameFrozen = true;
        setTimeout(() => {
          alert(`You win... somehow?`);
        }, 100);
      } else if (cells.every((cell) => cell !== null)) {
        gameFrozen = true;
        setTimeout(() => {
          alert(`Is that the best you can do?`);
        }, 100);
      } else {
        playerTurn = false;
        CPUPlay(cells);
      }
    }
  }

  function inputMove(char, id) {
    if (cells[id] === null) {
      cells[id] = char;
      document.querySelector(`[data-index='${id}']`).textContent = char;
    }
  }
  function computerInputMove(id) {
    inputMove(cpuIcon, id);
    if (checkWinner()) {
      gameFrozen = true;
      setTimeout(() => {
        alert(`Oh hey I won, what a surprise ;3`);
      }, 100);
    } else if (cells.every((cell) => cell !== null)) {
      gameFrozen = true;
      setTimeout(() => {
        alert(`Is that the best you can do?`);
      }, 100);
    } else {
      playerTurn = true;
    }
  }

  function checkWinner() {
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

    return winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        cells[a] !== null && cells[a] === cells[b] && cells[a] === cells[c]
      );
    });
  }

  function resetBoard() {
    cells.fill(null);
    createBoard();
    playerTurn = false;
    gameFrozen = false;
    setTimeout(CPUPlay, 1);
  }

  resetButton.addEventListener("click", resetBoard);

  resetBoard();
});
