/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Implements the logic for Conway's Game of Life.
 * The game is played on a 2D grid of cells, each of which can be in one of
 * two possible states, alive or dead. Every cell interacts with its eight
 * neighbours, which are the cells that are horizontally, vertically, or
 * diagonally adjacent.
 */
export class ConwayGameOfLife {
  private grid: number[][];
  public readonly rows: number;
  public readonly cols: number;

  /**
   * Creates an instance of the Game of Life.
   * @param rows The number of rows in the grid.
   * @param cols The number of columns in the grid.
   */
  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.createGrid(rows, cols);
  }

  /**
   * Initializes a grid with all cells set to dead (0).
   * @param rows The number of rows.
   * @param cols The number of columns.
   * @returns A 2D number array representing the grid.
   */
  private createGrid(rows: number, cols: number): number[][] {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  /**
   * Fills the grid with a random pattern of alive and dead cells.
   */
  public randomize(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = Math.random() > 0.75 ? 1 : 0; // 25% chance of being alive
      }
    }
  }

  /**
   * Calculates the next state of the grid based on the rules of the game.
   */
  public nextGeneration(): void {
    const nextGrid = this.createGrid(this.rows, this.cols);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const neighbors = this.countNeighbors(i, j);
        const cell = this.grid[i][j];

        if (cell === 1 && (neighbors < 2 || neighbors > 3)) {
          nextGrid[i][j] = 0; // Underpopulation or overpopulation
        } else if (cell === 0 && neighbors === 3) {
          nextGrid[i][j] = 1; // Reproduction
        } else {
          nextGrid[i][j] = cell; // Stasis
        }
      }
    }

    this.grid = nextGrid;
  }

  /**
   * Counts the number of live neighbors for a given cell.
   * This implementation treats the grid as a torus (edges wrap around).
   * @param row The row of the cell.
   * @param col The column of the cell.
   * @returns The number of live neighbors (0-8).
   */
  private countNeighbors(row: number, col: number): number {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;

        const x = (row + i + this.rows) % this.rows;
        const y = (col + j + this.cols) % this.cols;
        
        sum += this.grid[x][y];
      }
    }
    return sum;
  }

  /**
   * Returns the current state of the grid.
   * @returns A 2D number array representing the grid.
   */
  public getGrid(): number[][] {
    return this.grid;
  }
}