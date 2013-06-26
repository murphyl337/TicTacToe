/**
 * Created with JetBrains WebStorm.
 * User: tmurphy
 * Date: 6/25/13
 * Time: 1:36 PM
 * To change this template use File | Settings | File Templates.
 */
function GameRules(){
    this.getMoves = function(board, marker){
        var moves = [];
        for(var space=0; space<9; space++){
            if(board.spaces[space].mark === marker)
                moves.push(space);
        }

        return moves;
    };

    this.isValidMove = function(board, position){
        return (board.spaces[position].mark === "");
    };

    this.isWinner = function(board, marker){
        var wins = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        var moves = this.getMoves(board, marker);
        var winner = false;
        for(var win=0; win<wins.length; win++){
            if(moves.containsContentsOf(wins[win]))
                winner = true
        }
        return winner;
    };

    this.isDraw = function(board){
        var draw = false;
        if(!board.hasOpenSpaces() &&
            (!this.isWinner(board, "X") && !this.isWinner(board, "O")))
            draw = true;
        return draw;
    };

    this.isGameOver = function(board){
        return (this.isWinner(board, "X") || this.isWinner(board, "O") || this.isDraw(board));
    };

    this.getState = function(board){
        var state = "";
        if(this.isGameOver(board)){
            if(this.isWinner(board, "X")) state = "X is winner";
            if(this.isWinner(board, "O")) state = "O is winner";
            if(this.isDraw(board)) state = "It's a draw";
        }
        return state;
    };
}