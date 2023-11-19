// Professor Jonatan says: it is not valid, did not extends from Agent, just overwrites it and
// removes an argument in compute. Professor Jonatan modified it to extends but not sure it is going to work
class CREC extends Agent {
    constructor() {
        super();
        this.board = new Board();
    }

    init(color, board, time = 20000, k = 4) {
        super.init(color, board, time, k);
        this.opponentColor = this.color === 'W' ? 'B' : 'W';
    }

    findAvailableRow(board, col) {
        for (let row = this.size - 1; row >= 0; row--) {
            if (board[row][col] === ' ') return row;
        }
        return -1;
    }

    minimax(board, depth, maximizingPlayer, alpha, beta) {
        let winner = this.board.winner(board, this.k);
        if (winner === this.color) return Infinity;
        else if (winner === this.opponentColor) return -Infinity;
        else if (depth === 0) return 0; // Tie or depth limit

        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (let col = 0; col < this.size; col++) {
                let row = this.findAvailableRow(board, col);
                if (row !== -1) {
                    board[row][col] = this.color;
                    let evaluation = this.minimax(board, depth - 1, false, alpha, beta);
                    board[row][col] = ' ';
                    maxEval = Math.max(maxEval, evaluation);
                    alpha = Math.max(alpha, evaluation);
                    if (beta <= alpha) break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let col = 0; col < this.size; col++) {
                let row = this.findAvailableRow(board, col);
                if (row !== -1) {
                    board[row][col] = this.opponentColor;
                    let evaluation = this.minimax(board, depth - 1, true, alpha, beta);
                    board[row][col] = ' ';
                    minEval = Math.min(minEval, evaluation);
                    beta = Math.min(beta, evaluation);
                    if (beta <= alpha) break;
                }
            }
            return minEval;
        }
    }

    findBestMove(board) {
        let bestMove = -1;
        let maxEval = -Infinity;
        for (let col = 0; col < this.size; col++) {
            let row = this.findAvailableRow(board, col);
            if (row !== -1) {
                board[row][col] = this.color;
                let evaluation = this.minimax(board, 3, false, -Infinity, Infinity);
                board[row][col] = ' ';
                if (evaluation > maxEval) {
                    maxEval = evaluation;
                    bestMove = col;
                }
            }
        }
        bestMove = bestMove == -1 ? 0 : bestMove;
        return bestMove;        
    }

    compute(board, time) {
        return this.findBestMove(board);
    }
}