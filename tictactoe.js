document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const resetButton = document.getElementById("reset");
  const cells = Array(9).fill(null);
  let playerTurn = true;
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
          alert(`Player wins!`);
        }, 100);
      } else if (cells.every((cell) => cell !== null)) {
        gameFrozen = true;
        setTimeout(() => {
          alert(`Draw`);
        }, 100);
      } else {
        playerTurn = false;
        setTimeout(() => {
          CPUPlay(cells); // Look, I could remove the timeout, but it feels better to play with it on tbh
        }, 500);
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
        alert(`Aurora wins :3`);
      }, 100);
    } else if (cells.every((cell) => cell !== null)) {
      gameFrozen = true;
      setTimeout(() => {
        alert(`Draw`);
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
    playerTurn = true;
    gameFrozen = false;
  }

  resetButton.addEventListener("click", resetBoard);

  resetBoard();
});
